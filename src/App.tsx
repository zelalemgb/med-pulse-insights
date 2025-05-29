
import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Loader2 } from "lucide-react";

// Lazy load components for code splitting
const Index = React.lazy(() => import("./pages/Index"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const DataEntry = React.lazy(() => import("./pages/DataEntry"));
const Import = React.lazy(() => import("./pages/Import"));
const Auth = React.lazy(() => import("./pages/Auth"));
const AdminSetup = React.lazy(() => import("./pages/AdminSetup"));
const Facilities = React.lazy(() => import("./pages/Facilities"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
  </div>
);

const App = () => {
  console.log('App component rendering');
  
  // Create QueryClient instance inside component to ensure React is properly initialized
  const queryClient = React.useMemo(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          gcTime: 10 * 60 * 1000, // 10 minutes
          retry: 1,
        },
      },
    }),
    []
  );
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin-setup" element={<AdminSetup />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/data-entry" 
                  element={
                    <ProtectedRoute>
                      <DataEntry />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/import" 
                  element={
                    <ProtectedRoute>
                      <Import />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/facilities" 
                  element={
                    <ProtectedRoute>
                      <Facilities />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
