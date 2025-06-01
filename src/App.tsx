
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Facilities from "./pages/Facilities";
import { AuthProvider } from "./contexts/AuthContext";
import { NavigationProvider } from "./contexts/NavigationContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import MainNavigation from "./components/layout/MainNavigation";
import Footer from "./components/layout/Footer";

import RoleTestingPage from "./pages/RoleTestingPage";

function App() {
  console.log('App component rendering');
  
  const queryClient = new QueryClient();

  return (
    <Router>
      <div className="min-h-screen bg-background flex flex-col">
        <AuthProvider>
          <NavigationProvider>
            <QueryClientProvider client={queryClient}>
              <MainNavigation />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/facilities" element={<Facilities />} />
                  <Route path="/role-testing" element={<RoleTestingPage />} />
                </Routes>
              </div>
              <Footer />
              <Toaster />
            </QueryClientProvider>
          </NavigationProvider>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
