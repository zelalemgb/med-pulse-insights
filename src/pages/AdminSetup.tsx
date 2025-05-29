import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useHasNationalUsers, useCreateFirstAdmin } from '@/hooks/useFirstAdmin';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Crown } from 'lucide-react';
import { toast } from 'sonner';

const AdminSetup = () => {
  const { user, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const { data: hasNationalUsers, isLoading: checkingNationalUsers } = useHasNationalUsers();
  const createFirstAdmin = useCreateFirstAdmin();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // If national users already exist, redirect to normal auth
  if (!checkingNationalUsers && hasNationalUsers) {
    return <Navigate to="/auth" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Create the user account first
      const { error: signUpError } = await signUp(
        formData.email,
        formData.password,
        formData.fullName
      );
      
      if (signUpError) {
        toast.error(signUpError.message || 'Failed to create account');
        return;
      }

      // Wait a moment for the user to be created and triggers to run
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get the current user after signup
      const { data: { user: newUser } } = await supabase.auth.getUser();
      
      if (!newUser) {
        toast.error('Failed to get user information after signup');
        return;
      }

      // Now create the first admin using the mutation
      await createFirstAdmin.mutateAsync({
        userId: newUser.id,
        email: formData.email,
        fullName: formData.fullName
      });

      toast.success('First admin account created successfully! Please sign in to continue.');
      navigate('/auth');
    } catch (error) {
      console.error('Admin setup error:', error);
      toast.error('An unexpected error occurred during admin setup');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || checkingNationalUsers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Setup First Admin</CardTitle>
          <CardDescription>
            Create the first national administrator account for your pharmaceutical analytics system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-name">Full Name</Label>
              <Input
                id="admin-name"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="admin-confirm">Confirm Password</Label>
              <Input
                id="admin-confirm"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <div className="bg-blue-50 p-3 rounded-md">
              <div className="flex items-start space-x-2">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">First Admin Account</p>
                  <p>This will create your account and immediately grant you national administrator privileges.</p>
                </div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || createFirstAdmin.isPending}
            >
              {isLoading || createFirstAdmin.isPending ? 'Creating Admin Account...' : 'Create First Admin'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;
