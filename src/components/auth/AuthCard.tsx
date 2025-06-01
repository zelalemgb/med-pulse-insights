
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield } from 'lucide-react';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';

export const AuthCard = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl">Pharmaceutical Analytics</CardTitle>
        <CardDescription>
          Access your pharmaceutical supply chain analytics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <SignInForm isLoading={isLoading} setIsLoading={setIsLoading} />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignUpForm isLoading={isLoading} setIsLoading={setIsLoading} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
