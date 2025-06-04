import { vi, describe, it, expect } from 'vitest';
import { AuthValidationService } from '../authValidationService';
import { supabase } from '@/integrations/supabase/client';
import { ProfileService } from '@/services/auth/profileService';

vi.mock('@/integrations/supabase/client');
vi.mock('@/services/auth/profileService');

describe('AuthValidationService.validateAuthUsers', () => {
  it('creates missing profiles and returns true', async () => {
    const listUsers = vi.fn().mockResolvedValue({
      data: { users: [
        { id: '1', email: 'a@test.com', user_metadata: { full_name: 'A' } },
        { id: '2', email: 'b@test.com', user_metadata: { full_name: 'B' } }
      ] },
      error: null
    });
    (supabase.auth as any) = { admin: { listUsers } };

    const createProfile = vi.fn().mockResolvedValue({ data: {}, error: null });
    (ProfileService.createProfile as any) = createProfile;

    const result = await AuthValidationService.validateAuthUsers(['1']);

    expect(result).toBe(true);
    expect(listUsers).toHaveBeenCalled();
    expect(createProfile).toHaveBeenCalledWith('2', 'b@test.com', 'B');
  });
});
