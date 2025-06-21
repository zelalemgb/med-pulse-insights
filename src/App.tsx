
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { NavigationProvider } from '@/contexts/NavigationContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RoleGuard from '@/components/auth/RoleGuard';
import ErrorBoundary from '@/components/ErrorBoundary';
import AppLayout from '@/components/layout/AppLayout';

// Pages
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import PharmaceuticalProducts from '@/pages/PharmaceuticalProducts';
import PharmaceuticalDashboardPage from '@/pages/PharmaceuticalDashboard';
import DataManagement from '@/pages/DataManagement';
import DataEntry from '@/pages/DataEntry';
import Analytics from '@/pages/Analytics';
import Facilities from '@/pages/Facilities';
import UserManagement from '@/pages/UserManagement';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <NavigationProvider>
              <div className="min-h-screen bg-gray-50">
                <Toaster />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Dashboard />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/pharmaceutical-products" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <PharmaceuticalProducts />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/pharmaceutical-dashboard" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <PharmaceuticalDashboardPage />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/data-management" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <DataManagement />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/data-entry" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <DataEntry />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/analytics" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Analytics />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/facilities" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Facilities />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/user-management" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <RoleGuard allowedRoles={['national', 'regional', 'zonal']}>
                          <UserManagement />
                        </RoleGuard>
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Profile />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </NavigationProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
