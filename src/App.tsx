
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RoleGuard from '@/components/auth/RoleGuard';

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

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Toaster />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/pharmaceutical-products" element={
                <ProtectedRoute>
                  <PharmaceuticalProducts />
                </ProtectedRoute>
              } />
              <Route path="/pharmaceutical-dashboard" element={
                <ProtectedRoute>
                  <PharmaceuticalDashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/data-management" element={
                <ProtectedRoute>
                  <DataManagement />
                </ProtectedRoute>
              } />
              <Route path="/data-entry" element={
                <ProtectedRoute>
                  <DataEntry />
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } />
              <Route path="/facilities" element={
                <ProtectedRoute>
                  <Facilities />
                </ProtectedRoute>
              } />
              <Route path="/user-management" element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['national', 'regional', 'zonal']}>
                    <UserManagement />
                  </RoleGuard>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
