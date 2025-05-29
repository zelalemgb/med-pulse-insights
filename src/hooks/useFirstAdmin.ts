
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useHasNationalUsers = () => {
  return useQuery({
    queryKey: ['has-national-users'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('has_national_users');
      
      if (error) {
        throw new Error(`Failed to check for national users: ${error.message}`);
      }
      
      return data as boolean;
    },
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
      console.log('Creating first admin with params:', { userId, email, fullName });
      
      const { data, error } = await supabase.rpc('create_first_admin', {
        _user_id: userId,
        _email: email,
        _full_name: fullName
      });

      if (error) {
        console.error('create_first_admin error:', error);
        throw new Error(`Failed to create first admin: ${error.message}`);
      }

      console.log('create_first_admin response:', data);
      return data;
    },
    onSuccess: () => {
      console.log('First admin mutation successful');
      toast({
        title: "Success",
        description: "First admin account created successfully!",
      });
    },
    onError: (error: Error) => {
      console.error('First admin mutation error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
