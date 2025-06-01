
import React from 'react';
import MainNavigation from '@/components/layout/MainNavigation';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-gray-900">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
            <p className="text-lg text-gray-600">
              The page you are looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="default">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button asChild variant="outline" onClick={() => window.history.back()}>
              <span>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
