
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useHasNationalUsers = () => {
  return useQuery({
    queryKey: ['has-national-users'],
    queryFn: async () => {
      console.log('🔍 Checking for national users...');
      
      const { data, error } = await supabase.rpc('has_national_users');
      
      if (error) {
        console.error('❌ Error checking national users:', error);
        throw new Error(`Failed to check for national users: ${error.message}`);
      }
      
      console.log('✅ Has national users result:', data);
      return data as boolean;
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCreateFirstAdmin = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      userId,
      email,
      fullName
    }: {
      userId: string;
      email: string;
      fullName: string;
    }) => {
      console.log('🚀 Starting first admin creation...');
      console.log('📋 Parameters:', { userId, email, fullName });
      
      // First verify user exists in auth.users
      const { data: { user }, error: getUserError } = await supabase.auth.getUser();
      console.log('👤 Current auth user:', user?.id);
      
      if (getUserError) {
        console.error('❌ Auth user error:', getUserError);
        throw new Error(`Authentication error: ${getUserError.message}`);
      }
      
      if (!user || user.id !== userId) {
        console.error('❌ User ID mismatch:', { expected: userId, actual: user?.id });
        throw new Error('User authentication mismatch');
      }
      
      // Check if profile already exists
      console.log('🔍 Checking existing profile...');
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (profileError) {
        console.error('❌ Profile check error:', profileError);
        throw new Error(`Profile check failed: ${profileError.message}`);
      }
      
      console.log('📋 Existing profile:', existingProfile);
      
      // Double-check no national users exist
      console.log('🔍 Double-checking national users...');
      const { data: hasNational, error: hasNationalError } = await supabase.rpc('has_national_users');
      
      if (hasNationalError) {
        console.error('❌ National users check error:', hasNationalError);
        throw new Error(`National users check failed: ${hasNationalError.message}`);
      }
      
      if (hasNational) {
        console.error('❌ National users already exist');
        throw new Error('National administrators already exist in the system');
      }
      
      console.log('✅ No national users found, proceeding...');
      
      // Call the create_first_admin function
      console.log('🔧 Calling create_first_admin function...');
      const { data, error } = await supabase.rpc('create_first_admin', {
        _user_id: userId,
        _email: email,
        _full_name: fullName
      });

      if (error) {
        console.error('❌ create_first_admin error:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw new Error(`Failed to create first admin: ${error.message}`);
      }

      console.log('✅ create_first_admin response:', data);
      
      // Verify the changes were applied
      console.log('🔍 Verifying profile update...');
      const { data: updatedProfile, error: verifyError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (verifyError) {
        console.error('❌ Profile verification error:', verifyError);
        throw new Error(`Profile verification failed: ${verifyError.message}`);
      }
      
      console.log('✅ Updated profile:', updatedProfile);
      
      if (updatedProfile.role !== 'national') {
        console.error('❌ Role not updated correctly:', updatedProfile.role);
        throw new Error('Profile role was not updated to national');
      }
      
      console.log('🎉 First admin creation completed successfully!');
      return data;
    },
    onSuccess: () => {
      console.log('✅ First admin mutation successful');
      toast({
        title: "Success",
        description: "First admin account created successfully!",
      });
    },
    onError: (error: Error) => {
      console.error('❌ First admin mutation error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
