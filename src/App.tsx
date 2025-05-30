import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import FacilityManagement from "./pages/FacilityManagement";
import { AuthProvider } from "./contexts/AuthContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import RoleTestingPage from "./pages/RoleTestingPage";

function App() {
  console.log('App component rendering');
  
  const queryClient = new QueryClient();

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/facilities" element={<FacilityManagement />} />
              <Route path="/role-testing" element={<RoleTestingPage />} />
            </Routes>
            <Toaster />
          </QueryClientProvider>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
