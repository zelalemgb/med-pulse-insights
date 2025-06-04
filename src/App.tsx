
import React, { useState, useEffect, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

console.log('🔧 App.tsx loading...');

// Simple loading component
const LoadingScreen = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
      <p className="text-gray-600">Loading application...</p>
    </div>
  </div>
);

// Simple error component
const ErrorScreen = ({ error }: { error: string }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center max-w-md">
      <h1 className="text-xl font-bold text-red-600 mb-2">Loading Error</h1>
      <p className="text-gray-600 mb-4">{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Reload Page
      </button>
    </div>
  </div>
);

// Import contexts and components with proper ES6 imports
import { AuthProvider } from "@/contexts/AuthContext";
import { NavigationProvider } from "@/contexts/NavigationContext";
import MainNavigation from "@/components/layout/MainNavigation";
import Footer from "@/components/layout/Footer";

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Analytics = React.lazy(() => import("./pages/Analytics"));
const Import = React.lazy(() => import("./pages/Import"));
const DataEntry = React.lazy(() => import("./pages/DataEntry"));
const DataManagement = React.lazy(() => import("./pages/DataManagement"));
const Auth = React.lazy(() => import("./pages/Auth"));
const Facilities = React.lazy(() => import("./pages/Facilities"));
const Products = React.lazy(() => import("./pages/Products"));
const Profile = React.lazy(() => import("./pages/Profile"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const UserManagement = React.lazy(() => import("./pages/UserManagement"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App: React.FC = () => {
  console.log('🔧 App component rendering...');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    console.log('✅ All core modules loaded successfully');
  }, []);

  if (error) {
    return <ErrorScreen error={error} />;
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <NavigationProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <div className="min-h-screen bg-gray-50 flex flex-col">
                <MainNavigation />
                <main className="flex-1">
                  <Suspense fallback={<LoadingScreen />}>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/import" element={<Import />} />
                      <Route path="/data-entry" element={<DataEntry />} />
                      <Route path="/data-management" element={<DataManagement />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/facilities" element={<Facilities />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/user-management" element={<UserManagement />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </div>
            </TooltipProvider>
          </NavigationProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
