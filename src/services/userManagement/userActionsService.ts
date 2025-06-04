
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/pharmaceutical';

export class UserActionsService {
  private static async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }
    return { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' };
  }

  static async approveUser(userId: string, newRole: UserRole = 'facility_officer'): Promise<void> {
    const headers = await this.getAuthHeaders();
    const response = await fetch('/api/approve-user', {
      method: 'POST',
      headers,
      body: JSON.stringify({ userId, newRole }),
    });
    if (!response.ok) {
      const { error } = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Failed to approve user: ${error}`);
    }
  }

  static async rejectUser(userId: string, reason?: string): Promise<void> {
    const headers = await this.getAuthHeaders();
    const response = await fetch('/api/reject-user', {
      method: 'POST',
      headers,
      body: JSON.stringify({ userId, reason }),
    });
    if (!response.ok) {
      const { error } = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Failed to reject user: ${error}`);
    }
  }

  static async changeUserRole(userId: string, newRole: UserRole, reason?: string): Promise<void> {
    const headers = await this.getAuthHeaders();
    const response = await fetch('/api/change-user-role', {
      method: 'POST',
      headers,
      body: JSON.stringify({ userId, newRole, reason }),
    });
    if (!response.ok) {
      const { error } = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Failed to change user role: ${error}`);
    }
  }
}
