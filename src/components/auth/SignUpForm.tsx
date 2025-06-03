
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

    setIsLoading(true);

    try {
      console.log('🚀 Starting signup process for:', signUpData.email);
      const { error } = await signUp(
        signUpData.email,
        signUpData.password,
        signUpData.fullName
      );
      
      if (error) {
        console.error('❌ Signup error:', error);
        toast.error(error.message || 'Failed to sign up');
      } else {
        console.log('✅ Signup successful for:', signUpData.email);
        toast.success('Account created successfully! Please check your email for verification.');
        // Clear form after successful signup
        setSignUpData({
          email: '',
          password: '',
          confirmPassword: '',
          fullName: '',
        });
      }
    } catch (error) {
      console.error('❌ Unexpected signup error:', error);
      toast.error('An unexpected error occurred');
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
          placeholder="Enter your password"
          value={signUpData.password}
          onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
          disabled={isLoading}
          required
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
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Sign Up'}
      </Button>
    </form>
  );
};
