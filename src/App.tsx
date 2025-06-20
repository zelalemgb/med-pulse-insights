
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import DataEntry from './pages/DataEntry';
import Analytics from './pages/Analytics';
import DataManagement from './pages/DataManagement';
import Facilities from './pages/Facilities';
import UserManagement from './pages/UserManagement';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { AuthProvider } from './contexts/AuthContext';
import { NavigationProvider } from './contexts/NavigationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleGuard from './components/auth/RoleGuard';
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster as Sonner } from './components/ui/sonner';

import PharmaceuticalProducts from '@/pages/PharmaceuticalProducts';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <NavigationProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
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
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <Analytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/data-management"
                  element={
                    <ProtectedRoute>
                      <DataManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pharmaceutical-products"
                  element={
                    <ProtectedRoute>
                      <PharmaceuticalProducts />
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
                <Route
                  path="/user-management"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['national', 'regional', 'zonal']}>
                        <UserManagement />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </NavigationProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
