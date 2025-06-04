
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

console.log('🔧 App.tsx loading...');

// Import contexts with error handling
let AuthProvider, NavigationProvider;
try {
  const authModule = await import("@/contexts/AuthContext");
  AuthProvider = authModule.AuthProvider;
  console.log('✅ AuthContext imported successfully');
} catch (error) {
  console.error('❌ Failed to import AuthContext:', error);
  // Fallback AuthProvider
  AuthProvider = ({ children }) => children;
}

try {
  const navModule = await import("@/contexts/NavigationContext");
  NavigationProvider = navModule.NavigationProvider;
  console.log('✅ NavigationContext imported successfully');
} catch (error) {
  console.error('❌ Failed to import NavigationContext:', error);
  // Fallback NavigationProvider
  NavigationProvider = ({ children }) => children;
}

// Import layout components
let MainNavigation, Footer;
try {
  const mainNavModule = await import("@/components/layout/MainNavigation");
  MainNavigation = mainNavModule.default;
  console.log('✅ MainNavigation imported successfully');
} catch (error) {
  console.error('❌ Failed to import MainNavigation:', error);
  MainNavigation = () => <nav>Navigation Error</nav>;
}

try {
  const footerModule = await import("@/components/layout/Footer");
  Footer = footerModule.default;
  console.log('✅ Footer imported successfully');
} catch (error) {
  console.error('❌ Failed to import Footer:', error);
  Footer = () => <footer>Footer Error</footer>;
}

// Import pages with error handling
let Dashboard, Analytics, Import, DataEntry, DataManagement, Auth, Facilities, Products, Profile, NotFound, UserManagement;

try {
  Dashboard = (await import("./pages/Dashboard")).default;
  console.log('✅ Dashboard imported successfully');
} catch (error) {
  console.error('❌ Failed to import Dashboard:', error);
  Dashboard = () => <div>Dashboard Loading Error</div>;
}

try {
  Analytics = (await import("./pages/Analytics")).default;
  console.log('✅ Analytics imported successfully');
} catch (error) {
  console.error('❌ Failed to import Analytics:', error);
  Analytics = () => <div>Analytics Loading Error</div>;
}

try {
  Import = (await import("./pages/Import")).default;
  console.log('✅ Import imported successfully');
} catch (error) {
  console.error('❌ Failed to import Import:', error);
  Import = () => <div>Import Loading Error</div>;
}

try {
  DataEntry = (await import("./pages/DataEntry")).default;
  console.log('✅ DataEntry imported successfully');
} catch (error) {
  console.error('❌ Failed to import DataEntry:', error);
  DataEntry = () => <div>DataEntry Loading Error</div>;
}

try {
  DataManagement = (await import("./pages/DataManagement")).default;
  console.log('✅ DataManagement imported successfully');
} catch (error) {
  console.error('❌ Failed to import DataManagement:', error);
  DataManagement = () => <div>DataManagement Loading Error</div>;
}

try {
  Auth = (await import("./pages/Auth")).default;
  console.log('✅ Auth imported successfully');
} catch (error) {
  console.error('❌ Failed to import Auth:', error);
  Auth = () => <div>Auth Loading Error</div>;
}

try {
  Facilities = (await import("./pages/Facilities")).default;
  console.log('✅ Facilities imported successfully');
} catch (error) {
  console.error('❌ Failed to import Facilities:', error);
  Facilities = () => <div>Facilities Loading Error</div>;
}

try {
  Products = (await import("./pages/Products")).default;
  console.log('✅ Products imported successfully');
} catch (error) {
  console.error('❌ Failed to import Products:', error);
  Products = () => <div>Products Loading Error</div>;
}

try {
  Profile = (await import("./pages/Profile")).default;
  console.log('✅ Profile imported successfully');
} catch (error) {
  console.error('❌ Failed to import Profile:', error);
  Profile = () => <div>Profile Loading Error</div>;
}

try {
  NotFound = (await import("./pages/NotFound")).default;
  console.log('✅ NotFound imported successfully');
} catch (error) {
  console.error('❌ Failed to import NotFound:', error);
  NotFound = () => <div>404 - Page Not Found</div>;
}

try {
  UserManagement = (await import("@/pages/UserManagement")).default;
  console.log('✅ UserManagement imported successfully');
} catch (error) {
  console.error('❌ Failed to import UserManagement:', error);
  UserManagement = () => <div>UserManagement Loading Error</div>;
}

const queryClient = new QueryClient();

const App: React.FC = () => {
  console.log('🔧 App component rendering...');
  
  try {
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
                  <Footer />
                </div>
              </TooltipProvider>
            </NavigationProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error('💥 Error in App component:', error);
    return <div>Error loading application</div>;
  }
};

export default App;
