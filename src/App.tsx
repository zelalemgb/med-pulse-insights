
import React, { useState, useEffect } from 'react';
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

// Import contexts and components with error handling
let AuthProvider, NavigationProvider, MainNavigation, Footer;
let Dashboard, Analytics, Import, DataEntry, DataManagement, Auth, Facilities, Products, Profile, NotFound, UserManagement;

try {
  console.log('📦 Importing AuthContext...');
  const authModule = require("@/contexts/AuthContext");
  AuthProvider = authModule.AuthProvider;
  console.log('✅ AuthContext imported successfully');
} catch (error) {
  console.error('💥 Failed to import AuthContext:', error);
}

try {
  console.log('📦 Importing NavigationContext...');
  const navModule = require("@/contexts/NavigationContext");
  NavigationProvider = navModule.NavigationProvider;
  console.log('✅ NavigationContext imported successfully');
} catch (error) {
  console.error('💥 Failed to import NavigationContext:', error);
}

try {
  console.log('📦 Importing MainNavigation...');
  MainNavigation = require("@/components/layout/MainNavigation").default;
  console.log('✅ MainNavigation imported successfully');
} catch (error) {
  console.error('💥 Failed to import MainNavigation:', error);
}

try {
  console.log('📦 Importing Footer...');
  Footer = require("@/components/layout/Footer").default;
  console.log('✅ Footer imported successfully');
} catch (error) {
  console.error('💥 Failed to import Footer:', error);
}

// Import pages with error handling
try {
  console.log('📦 Importing Dashboard...');
  Dashboard = require("./pages/Dashboard").default;
  console.log('✅ Dashboard imported successfully');
} catch (error) {
  console.error('💥 Failed to import Dashboard:', error);
  Dashboard = () => <div>Dashboard failed to load</div>;
}

try {
  console.log('📦 Importing Analytics...');
  Analytics = require("./pages/Analytics").default;
  console.log('✅ Analytics imported successfully');
} catch (error) {
  console.error('💥 Failed to import Analytics:', error);
  Analytics = () => <div>Analytics failed to load</div>;
}

try {
  console.log('📦 Importing Import...');
  Import = require("./pages/Import").default;
  console.log('✅ Import imported successfully');
} catch (error) {
  console.error('💥 Failed to import Import:', error);
  Import = () => <div>Import failed to load</div>;
}

try {
  console.log('📦 Importing DataEntry...');
  DataEntry = require("./pages/DataEntry").default;
  console.log('✅ DataEntry imported successfully');
} catch (error) {
  console.error('💥 Failed to import DataEntry:', error);
  DataEntry = () => <div>DataEntry failed to load</div>;
}

try {
  console.log('📦 Importing DataManagement...');
  DataManagement = require("./pages/DataManagement").default;
  console.log('✅ DataManagement imported successfully');
} catch (error) {
  console.error('💥 Failed to import DataManagement:', error);
  DataManagement = () => <div>DataManagement failed to load</div>;
}

try {
  console.log('📦 Importing Auth...');
  Auth = require("./pages/Auth").default;
  console.log('✅ Auth imported successfully');
} catch (error) {
  console.error('💥 Failed to import Auth:', error);
  Auth = () => <div>Auth failed to load</div>;
}

try {
  console.log('📦 Importing Facilities...');
  Facilities = require("./pages/Facilities").default;
  console.log('✅ Facilities imported successfully');
} catch (error) {
  console.error('💥 Failed to import Facilities:', error);
  Facilities = () => <div>Facilities failed to load</div>;
}

try {
  console.log('📦 Importing Products...');
  Products = require("./pages/Products").default;
  console.log('✅ Products imported successfully');
} catch (error) {
  console.error('💥 Failed to import Products:', error);
  Products = () => <div>Products failed to load</div>;
}

try {
  console.log('📦 Importing Profile...');
  Profile = require("./pages/Profile").default;
  console.log('✅ Profile imported successfully');
} catch (error) {
  console.error('💥 Failed to import Profile:', error);
  Profile = () => <div>Profile failed to load</div>;
}

try {
  console.log('📦 Importing NotFound...');
  NotFound = require("./pages/NotFound").default;
  console.log('✅ NotFound imported successfully');
} catch (error) {
  console.error('💥 Failed to import NotFound:', error);
  NotFound = () => <div>Page Not Found</div>;
}

try {
  console.log('📦 Importing UserManagement...');
  UserManagement = require("@/pages/UserManagement").default;
  console.log('✅ UserManagement imported successfully');
} catch (error) {
  console.error('💥 Failed to import UserManagement:', error);
  UserManagement = () => <div>UserManagement failed to load</div>;
}

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
    // Check if critical components loaded
    if (!AuthProvider || !NavigationProvider) {
      setError('Failed to load core application modules');
      return;
    }
    console.log('✅ All core modules loaded successfully');
  }, []);

  if (error) {
    return <ErrorScreen error={error} />;
  }

  if (!AuthProvider || !NavigationProvider) {
    return <LoadingScreen />;
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
                {MainNavigation && <MainNavigation />}
                <main className="flex-1">
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
                </main>
                {Footer && <Footer />}
              </div>
            </TooltipProvider>
          </NavigationProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
