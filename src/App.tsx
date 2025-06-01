
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NavigationProvider } from "@/contexts/NavigationContext";
import MainNavigation from "@/components/layout/MainNavigation";
import { useServiceWorker } from "@/hooks/useServiceWorker";

// Import components directly instead of lazy loading to identify the problematic import
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Facilities from "@/pages/Facilities";
import Analytics from "@/pages/Analytics";
import RoleTestingPage from "@/pages/RoleTestingPage";
import ComprehensiveTestingPage from "@/pages/ComprehensiveTestingPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  console.log("App component rendering");
  
  // Register service worker
  useServiceWorker();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <NavigationProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-background">
                <MainNavigation />
                <Suspense 
                  fallback={
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                      </div>
                    </div>
                  }
                >
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/facilities" element={<Facilities />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/role-testing" element={<RoleTestingPage />} />
                    <Route path="/comprehensive-testing" element={<ComprehensiveTestingPage />} />
                  </Routes>
                </Suspense>
              </div>
              <Toaster />
            </BrowserRouter>
          </NavigationProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
