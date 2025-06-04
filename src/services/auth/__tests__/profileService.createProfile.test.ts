import { vi, describe, it, expect } from 'vitest';
import { ProfileService } from '../profileService';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client');

describe('ProfileService.createProfile', () => {
  it('inserts new profile record', async () => {
    const insert = vi.fn().mockReturnThis();
    const select = vi.fn().mockReturnThis();
    const single = vi.fn().mockResolvedValue({ data: { id: '1', email: 'test@test.com' }, error: null });

    (supabase.from as any) = vi.fn(() => ({ insert, select, single }));

    const { error, data } = await ProfileService.createProfile('1', 'test@test.com', 'Test');

    expect(error).toBeNull();
    expect(data).toEqual({ id: '1', email: 'test@test.com' });
    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(insert).toHaveBeenCalled();
  });
});
