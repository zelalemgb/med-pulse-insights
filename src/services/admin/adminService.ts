import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

export class AdminService {
  async hasNationalUsers(): Promise<boolean> {
    const { data, error } = await supabase.rpc('has_national_users');
    if (error) {
      throw new Error(`Failed to check admin status: ${error.message}`);
    }
    return data as boolean;
  }

  async getAdminUsers(): Promise<AdminUser[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, is_active, created_at')
      .in('role', ['national', 'regional', 'zonal'])
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch admin users: ${error.message}`);
    }
    return (data || []) as AdminUser[];
  }

  async createFirstAdmin(userId: string, email: string, fullName: string): Promise<void> {
    const { error } = await supabase.rpc('create_first_admin', {
      _user_id: userId,
      _email: email,
      _full_name: fullName,
    });
    if (error) {
      throw new Error(`Failed to create first admin: ${error.message}`);
    }
  }
}

export const adminService = new AdminService();
