
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NavigationProvider } from "@/contexts/NavigationContext";

console.log('🔧 App.tsx loading...');

// Test if basic imports work
try {
  console.log('✅ UI components imported successfully');
} catch (error) {
  console.error('❌ Error importing UI components:', error);
}

try {
  console.log('✅ React Query imported successfully');
} catch (error) {
  console.error('❌ Error importing React Query:', error);
}

try {
  console.log('✅ React Router imported successfully');
} catch (error) {
  console.error('❌ Error importing React Router:', error);
}

// Dynamic imports for pages to isolate potential issues
const Dashboard = React.lazy(() => {
  console.log('🔧 Loading Dashboard...');
  return import('./pages/Dashboard').catch(error => {
    console.error('❌ Error loading Dashboard:', error);
    throw error;
  });
});

const Analytics = React.lazy(() => {
  console.log('🔧 Loading Analytics...');
  return import('./pages/Analytics').catch(error => {
    console.error('❌ Error loading Analytics:', error);
    throw error;
  });
});

const Import = React.lazy(() => {
  console.log('🔧 Loading Import...');
  return import('./pages/Import').catch(error => {
    console.error('❌ Error loading Import:', error);
    throw error;
  });
});

const DataEntry = React.lazy(() => {
  console.log('🔧 Loading DataEntry...');
  return import('./pages/DataEntry').catch(error => {
    console.error('❌ Error loading DataEntry:', error);
    throw error;
  });
});

const DataManagement = React.lazy(() => {
  console.log('🔧 Loading DataManagement...');
  return import('./pages/DataManagement').catch(error => {
    console.error('❌ Error loading DataManagement:', error);
    throw error;
  });
});

const Auth = React.lazy(() => {
  console.log('🔧 Loading Auth...');
  return import('./pages/Auth').catch(error => {
    console.error('❌ Error loading Auth:', error);
    throw error;
  });
});

const Facilities = React.lazy(() => {
  console.log('🔧 Loading Facilities...');
  return import('./pages/Facilities').catch(error => {
    console.error('❌ Error loading Facilities:', error);
    throw error;
  });
});

const Products = React.lazy(() => {
  console.log('🔧 Loading Products...');
  return import('./pages/Products').catch(error => {
    console.error('❌ Error loading Products:', error);
    throw error;
  });
});

const Profile = React.lazy(() => {
  console.log('🔧 Loading Profile...');
  return import('./pages/Profile').catch(error => {
    console.error('❌ Error loading Profile:', error);
    throw error;
  });
});

const NotFound = React.lazy(() => {
  console.log('🔧 Loading NotFound...');
  return import('./pages/NotFound').catch(error => {
    console.error('❌ Error loading NotFound:', error);
    throw error;
  });
});

const UserManagement = React.lazy(() => {
  console.log('🔧 Loading UserManagement...');
  return import('@/pages/UserManagement').catch(error => {
    console.error('❌ Error loading UserManagement:', error);
    throw error;
  });
});

// Dynamic import for components
const MainNavigation = React.lazy(() => {
  console.log('🔧 Loading MainNavigation...');
  return import('@/components/layout/MainNavigation').catch(error => {
    console.error('❌ Error loading MainNavigation:', error);
    throw error;
  });
});

const Footer = React.lazy(() => {
  console.log('🔧 Loading Footer...');
  return import('@/components/layout/Footer').catch(error => {
    console.error('❌ Error loading Footer:', error);
    throw error;
  });
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Disable retries for debugging
      refetchOnWindowFocus: false,
    },
  },
});

console.log('✅ QueryClient created');

function App() {
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
                  <React.Suspense fallback={
                    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-center">
                      <div className="text-sm text-gray-600">Loading navigation...</div>
                    </div>
                  }>
                    <MainNavigation />
                  </React.Suspense>
                  <main className="flex-1">
                    <React.Suspense fallback={
                      <div className="min-h-[50vh] flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                          <p className="mt-4 text-gray-600">Loading page...</p>
                        </div>
                      </div>
                    }>
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
                    </React.Suspense>
                  </main>
                  <React.Suspense fallback={
                    <div className="h-8 bg-gray-100 flex items-center justify-center">
                      <div className="text-xs text-gray-500">Loading footer...</div>
                    </div>
                  }>
                    <Footer />
                  </React.Suspense>
                </div>
              </TooltipProvider>
            </NavigationProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error('❌ Error in App component:', error);
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-xl font-bold text-red-600 mb-4">Application Error</h1>
          <p className="text-gray-700 mb-4">
            The application failed to load. Please check the browser console for detailed error information.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
}

console.log('✅ App component defined');

export default App;
