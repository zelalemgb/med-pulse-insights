
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useHasNationalUsers, useCreateFirstAdmin } from '@/hooks/useFirstAdmin';
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
      // First, create the user account
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.fullName
      );
      
      if (error) {
        toast.error(error.message || 'Failed to create account');
        return;
      }

      // Since signUp doesn't return user data directly, we'll need to wait for auth state change
      // For now, let's show a success message and redirect to auth page
      toast.success('Account created successfully! Please check your email and then sign in to complete the admin setup.');
      navigate('/auth');
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Admin setup error:', error);
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
                  <p className="font-medium">Admin Account</p>
                  <p>After creating your account, you'll need to sign in and complete the admin setup process.</p>
                </div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;
