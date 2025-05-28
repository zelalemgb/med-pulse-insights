export interface AuditEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: 'product' | 'facility' | 'user' | 'system' | 'report';
  entityId: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  metadata?: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditFilter {
  userId?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export interface AuditReport {
  totalEntries: number;
  userActivity: Array<{
    userId: string;
    userName: string;
    actionCount: number;
    lastActivity: Date;
  }>;
  entityChanges: Array<{
    entityType: string;
    entityId: string;
    changeCount: number;
    lastChange: Date;
  }>;
  securityEvents: Array<{
    type: string;
    count: number;
    severity: 'low' | 'medium' | 'high';
  }>;
}

export class AuditTrailManager {
  private auditEntries: Map<string, AuditEntry> = new Map();
  private isEnabled = true;

  enable(): void {
    this.isEnabled = true;
  }

  disable(): void {
    this.isEnabled = false;
  }

  log(entry: Omit<AuditEntry, 'id' | 'timestamp'>): void {
    if (!this.isEnabled) return;

    const auditEntry: AuditEntry = {
      ...entry,
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
    };

    this.auditEntries.set(auditEntry.id, auditEntry);
    console.log('Audit entry logged:', auditEntry);

    // Clean up old entries (keep last 10000)
    if (this.auditEntries.size > 10000) {
      const entries = Array.from(this.auditEntries.entries())
        .sort(([, a], [, b]) => b.timestamp.getTime() - a.timestamp.getTime());
      
      // Keep only the newest 8000 entries
      const toKeep = new Map(entries.slice(0, 8000));
      this.auditEntries.clear();
      toKeep.forEach((value, key) => this.auditEntries.set(key, value));
    }
  }

  logDataChange(
    userId: string,
    userName: string,
    entityType: AuditEntry['entityType'],
    entityId: string,
    changes: AuditEntry['changes'],
    metadata?: Record<string, any>
  ): void {
    this.log({
      userId,
      userName,
      action: 'UPDATE',
      entityType,
      entityId,
      changes,
      metadata,
    });
  }

  logUserAction(
    userId: string,
    userName: string,
    action: string,
    entityType: AuditEntry['entityType'],
    entityId: string,
    metadata?: Record<string, any>
  ): void {
    this.log({
      userId,
      userName,
      action,
      entityType,
      entityId,
      metadata,
    });
  }

  logSecurityEvent(
    userId: string,
    userName: string,
    event: string,
    metadata?: Record<string, any>
  ): void {
    this.log({
      userId,
      userName,
      action: 'SECURITY_EVENT',
      entityType: 'system',
      entityId: 'security',
      metadata: { event, ...metadata },
    });
  }

  getAuditEntries(filter: AuditFilter = {}): AuditEntry[] {
    let entries = Array.from(this.auditEntries.values());

    // Apply filters
    if (filter.userId) {
      entries = entries.filter(entry => entry.userId === filter.userId);
    }
    if (filter.action) {
      entries = entries.filter(entry => entry.action === filter.action);
    }
    if (filter.entityType) {
      entries = entries.filter(entry => entry.entityType === filter.entityType);
    }
    if (filter.entityId) {
      entries = entries.filter(entry => entry.entityId === filter.entityId);
    }
    if (filter.startDate) {
      entries = entries.filter(entry => entry.timestamp >= filter.startDate!);
    }
    if (filter.endDate) {
      entries = entries.filter(entry => entry.timestamp <= filter.endDate!);
    }

    // Sort by timestamp (newest first)
    entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Apply pagination
    const page = filter.page || 1;
    const limit = filter.limit || 50;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return entries.slice(startIndex, endIndex);
  }

  generateAuditReport(startDate?: Date, endDate?: Date): AuditReport {
    let entries = Array.from(this.auditEntries.values());

    if (startDate) {
      entries = entries.filter(entry => entry.timestamp >= startDate);
    }
    if (endDate) {
      entries = entries.filter(entry => entry.timestamp <= endDate);
    }

    // User activity analysis
    const userActivityMap = new Map<string, { userName: string; actionCount: number; lastActivity: Date }>();
    
    entries.forEach(entry => {
      const existing = userActivityMap.get(entry.userId) || {
        userName: entry.userName,
        actionCount: 0,
        lastActivity: new Date(0),
      };
      
      userActivityMap.set(entry.userId, {
        userName: entry.userName,
        actionCount: existing.actionCount + 1,
        lastActivity: entry.timestamp > existing.lastActivity ? entry.timestamp : existing.lastActivity,
      });
    });

    const userActivity = Array.from(userActivityMap.entries()).map(([userId, data]) => ({
      userId,
      ...data,
    }));

    // Entity changes analysis
    const entityChangesMap = new Map<string, { changeCount: number; lastChange: Date }>();
    
    entries.forEach(entry => {
      const key = `${entry.entityType}:${entry.entityId}`;
      const existing = entityChangesMap.get(key) || {
        changeCount: 0,
        lastChange: new Date(0),
      };
      
      entityChangesMap.set(key, {
        changeCount: existing.changeCount + 1,
        lastChange: entry.timestamp > existing.lastChange ? entry.timestamp : existing.lastChange,
      });
    });

    const entityChanges = Array.from(entityChangesMap.entries()).map(([key, data]) => {
      const [entityType, entityId] = key.split(':');
      return { entityType, entityId, ...data };
    });

    // Security events analysis
    const securityEventsMap = new Map<string, number>();
    
    entries
      .filter(entry => entry.action === 'SECURITY_EVENT')
      .forEach(entry => {
        const eventType = entry.metadata?.event || 'unknown';
        securityEventsMap.set(eventType, (securityEventsMap.get(eventType) || 0) + 1);
      });

    const securityEvents = Array.from(securityEventsMap.entries()).map(([type, count]) => ({
      type,
      count,
      severity: this.getSecurityEventSeverity(type),
    }));

    return {
      totalEntries: entries.length,
      userActivity,
      entityChanges,
      securityEvents,
    };
  }

  private getClientIP(): string {
    // This is a placeholder - in a real app, you'd get this from the server
    return 'unknown';
  }

  private getSecurityEventSeverity(eventType: string): 'low' | 'medium' | 'high' {
    const highSeverityEvents = ['failed_login', 'unauthorized_access', 'privilege_escalation'];
    const mediumSeverityEvents = ['password_change', 'permission_change', 'data_export'];
    
    if (highSeverityEvents.includes(eventType)) return 'high';
    if (mediumSeverityEvents.includes(eventType)) return 'medium';
    return 'low';
  }
}

export const auditTrail = new AuditTrailManager();
