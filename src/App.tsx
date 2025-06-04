
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NavigationProvider } from "@/contexts/NavigationContext";
import MainNavigation from "@/components/layout/MainNavigation";
import Index from "./pages/Index";
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
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={
                    <div className="min-h-screen bg-gray-50 flex flex-col">
                      <MainNavigation />
                      <main className="flex-1">
                        <Dashboard />
                      </main>
                      <Footer />
                    </div>
                  } />
                  <Route path="/analytics" element={
                    <div className="min-h-screen bg-gray-50 flex flex-col">
                      <MainNavigation />
                      <main className="flex-1">
                        <Analytics />
                      </main>
                      <Footer />
                    </div>
                  } />
                  <Route path="/import" element={
                    <div className="min-h-screen bg-gray-50 flex flex-col">
                      <MainNavigation />
                      <main className="flex-1">
                        <Import />
                      </main>
                      <Footer />
                    </div>
                  } />
                  <Route path="/data-entry" element={
                    <div className="min-h-screen bg-gray-50 flex flex-col">
                      <MainNavigation />
                      <main className="flex-1">
                        <DataEntry />
                      </main>
                      <Footer />
                    </div>
                  } />
                  <Route path="/data-management" element={
                    <div className="min-h-screen bg-gray-50 flex flex-col">
                      <MainNavigation />
                      <main className="flex-1">
                        <DataManagement />
                      </main>
                      <Footer />
                    </div>
                  } />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/facilities" element={
                    <div className="min-h-screen bg-gray-50 flex flex-col">
                      <MainNavigation />
                      <main className="flex-1">
                        <Facilities />
                      </main>
                      <Footer />
                    </div>
                  } />
                  <Route path="/products" element={
                    <div className="min-h-screen bg-gray-50 flex flex-col">
                      <MainNavigation />
                      <main className="flex-1">
                        <Products />
                      </main>
                      <Footer />
                    </div>
                  } />
                  <Route path="/profile" element={
                    <div className="min-h-screen bg-gray-50 flex flex-col">
                      <MainNavigation />
                      <main className="flex-1">
                        <Profile />
                      </main>
                      <Footer />
                    </div>
                  } />
                  <Route path="/user-management" element={
                    <div className="min-h-screen bg-gray-50 flex flex-col">
                      <MainNavigation />
                      <main className="flex-1">
                        <UserManagement />
                      </main>
                      <Footer />
                    </div>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </TooltipProvider>
          </NavigationProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
