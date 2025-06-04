import { vi, describe, it, expect } from 'vitest';
import { ProfileService } from '../profileService';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client');

describe('ProfileService.updateProfile', () => {
  it('updates user profile fields', async () => {
    const update = vi.fn().mockReturnThis();
    const eq = vi.fn().mockReturnThis();
    const select = vi.fn().mockReturnThis();
    const single = vi.fn().mockResolvedValue({ data: { id: '1', full_name: 'John', department: 'IT' }, error: null });

    (supabase.from as any) = vi.fn(() => ({ update, eq, select, single }));

    const { error, data } = await ProfileService.updateProfile('1', { full_name: 'John', department: 'IT' });

    expect(error).toBeNull();
    expect(data).toEqual({ id: '1', full_name: 'John', department: 'IT' });
    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(update).toHaveBeenCalled();
    expect(eq).toHaveBeenCalledWith('id', '1');
  });
});
