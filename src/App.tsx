import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NavigationProvider } from "@/contexts/NavigationContext";
import MainNavigation from "@/components/layout/MainNavigation";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Import from "./pages/Import";
import DataEntry from "./pages/DataEntry";
import DataManagement from "./pages/DataManagement";
import Auth from "./pages/Auth";
import Facilities from "./pages/Facilities";
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import UserManagement from '@/pages/UserManagement';
import Footer from '@/components/layout/Footer';

const queryClient = new QueryClient();

function App() {
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
}

export default App;
