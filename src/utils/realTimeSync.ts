
import { ProductData } from '@/types/pharmaceutical';
import { APIClient, ExternalSystem, SyncResponse } from './apiClient';

export interface SyncStatus {
  isConnected: boolean;
  lastSync: Date | null;
  pendingOperations: number;
  errors: string[];
}

export interface SyncOperation {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: 'product' | 'facility' | 'user';
  data: any;
  timestamp: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  retryCount: number;
}

export class RealTimeSyncManager {
  private systems: Map<string, APIClient> = new Map();
  private syncQueue: SyncOperation[] = [];
  private syncInterval: NodeJS.Timeout | null = null;
  private isProcessing = false;

  constructor(private onStatusChange?: (status: SyncStatus) => void) {}

  addSystem(system: ExternalSystem): void {
    if (system.isActive) {
      const client = new APIClient({
        baseURL: system.endpoint,
        apiKey: system.apiKey,
        timeout: 30000,
      });
      this.systems.set(system.id, client);
    }
  }

  removeSystem(systemId: string): void {
    this.systems.delete(systemId);
  }

  startRealTimeSync(intervalMs: number = 30000): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      this.processSyncQueue();
    }, intervalMs);

    console.log(`Real-time sync started with ${intervalMs}ms interval`);
  }

  stopRealTimeSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    console.log('Real-time sync stopped');
  }

  queueOperation(operation: Omit<SyncOperation, 'id' | 'timestamp' | 'status' | 'retryCount'>): void {
    const syncOperation: SyncOperation = {
      ...operation,
      id: Date.now().toString(),
      timestamp: new Date(),
      status: 'pending',
      retryCount: 0,
    };

    this.syncQueue.push(syncOperation);
    this.updateStatus();
  }

  private async processSyncQueue(): Promise<void> {
    if (this.isProcessing || this.syncQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const pendingOperations = this.syncQueue.filter(op => op.status === 'pending');
    
    for (const operation of pendingOperations.slice(0, 10)) { // Process max 10 at a time
      operation.status = 'processing';
      
      try {
        await this.executeOperation(operation);
        operation.status = 'completed';
      } catch (error) {
        console.error(`Sync operation failed:`, error);
        operation.status = 'failed';
        operation.retryCount++;
        
        // Retry logic
        if (operation.retryCount < 3) {
          operation.status = 'pending';
        }
      }
    }

    // Clean up completed operations
    this.syncQueue = this.syncQueue.filter(op => 
      op.status !== 'completed' && (op.status !== 'failed' || op.retryCount < 3)
    );

    this.isProcessing = false;
    this.updateStatus();
  }

  private async executeOperation(operation: SyncOperation): Promise<void> {
    const promises = Array.from(this.systems.values()).map(async (client) => {
      switch (operation.type) {
        case 'CREATE':
          return client.syncProducts(operation.data.facilityId);
        case 'UPDATE':
          return client.exportProducts([operation.data]);
        case 'DELETE':
          // Implement delete sync if needed
          return { success: true, message: 'Delete operation simulated' };
        default:
          throw new Error(`Unknown operation type: ${operation.type}`);
      }
    });

    await Promise.all(promises);
  }

  private updateStatus(): void {
    if (this.onStatusChange) {
      const status: SyncStatus = {
        isConnected: this.systems.size > 0,
        lastSync: this.getLastSyncTime(),
        pendingOperations: this.syncQueue.filter(op => op.status === 'pending').length,
        errors: this.syncQueue
          .filter(op => op.status === 'failed')
          .map(op => `Operation ${op.id} failed after ${op.retryCount} retries`),
      };
      this.onStatusChange(status);
    }
  }

  private getLastSyncTime(): Date | null {
    const completedOps = this.syncQueue.filter(op => op.status === 'completed');
    if (completedOps.length === 0) return null;
    
    return completedOps.reduce((latest, op) => 
      op.timestamp > latest ? op.timestamp : latest, 
      completedOps[0].timestamp
    );
  }

  getStatus(): SyncStatus {
    return {
      isConnected: this.systems.size > 0,
      lastSync: this.getLastSyncTime(),
      pendingOperations: this.syncQueue.filter(op => op.status === 'pending').length,
      errors: this.syncQueue
        .filter(op => op.status === 'failed')
        .map(op => `Operation ${op.id} failed after ${op.retryCount} retries`),
    };
  }
}

export const syncManager = new RealTimeSyncManager();
