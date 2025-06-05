
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SignUpFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const SignUpForm = ({ isLoading, setIsLoading }: SignUpFormProps) => {
  const { signUp } = useAuth();
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    if (signUpData.password !== signUpData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!signUpData.fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (!signUpData.email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    if (signUpData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🚀 Starting signup process for:', signUpData.email);
      const { data, error } = await signUp(
        signUpData.email,
        signUpData.password,
        signUpData.fullName
      );

      if (error) {
        console.error('❌ Signup error:', error);
        
        // Handle specific error types
        if (error.message?.includes('User already registered')) {
          toast.error('This email is already registered. Please try signing in instead.');
        } else if (error.message?.includes('Invalid email')) {
          toast.error('Please enter a valid email address');
        } else if (error.message?.includes('Password')) {
          toast.error('Password requirements not met. Please use at least 6 characters.');
        } else {
          toast.error(error.message || 'Failed to create account');
        }
      } else if (data?.user) {
        console.log('✅ Signup successful for:', signUpData.email);
        console.log('📋 User created with ID:', data.user.id);
        
        // Note: Profile creation is handled by the database trigger
        // No need to manually create profile here
        
        toast.success('Account created successfully! Please check your email for verification.');
        
        // Clear form after successful signup
        setSignUpData({
          email: '',
          password: '',
          confirmPassword: '',
          fullName: '',
        });
      } else {
        console.warn('⚠️ Unexpected signup response:', { data, error });
        toast.error('Something went wrong during account creation');
      }
    } catch (error) {
      console.error('❌ Unexpected signup error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-name">Full Name</Label>
        <Input
          id="signup-name"
          type="text"
          placeholder="Enter your full name"
          value={signUpData.fullName}
          onChange={(e) => setSignUpData(prev => ({ ...prev, fullName: e.target.value }))}
          disabled={isLoading}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="Enter your email"
          value={signUpData.email}
          onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
          disabled={isLoading}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="Enter your password (min 6 characters)"
          value={signUpData.password}
          onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
          disabled={isLoading}
          required
          minLength={6}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-confirm">Confirm Password</Label>
        <Input
          id="signup-confirm"
          type="password"
          placeholder="Confirm your password"
          value={signUpData.confirmPassword}
          onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
          disabled={isLoading}
          required
          minLength={6}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Sign Up'}
      </Button>
    </form>
  );
};
