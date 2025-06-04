
import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

console.log('🔧 App.tsx starting to load...');

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

// Minimal test component to verify basic React is working
const TestComponent = () => {
  console.log('✅ TestComponent rendered successfully');
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">App is Working!</h1>
        <p className="text-gray-600">Basic React app is functioning correctly.</p>
        <div className="mt-4 p-4 bg-green-100 rounded-lg">
          <p className="text-green-800">✅ React components are rendering</p>
          <p className="text-green-800">✅ Tailwind CSS is working</p>
          <p className="text-green-800">✅ TypeScript compilation successful</p>
        </div>
      </div>
    </div>
  );
};

console.log('🔧 Creating QueryClient...');
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});
console.log('✅ QueryClient created successfully');

const App: React.FC = () => {
  console.log('🔧 App component rendering...');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    console.log('✅ App component mounted and useEffect triggered');
  }, []);

  if (error) {
    console.log('❌ App has error:', error);
    return <ErrorScreen error={error} />;
  }
  
  try {
    console.log('🔧 Rendering app structure...');
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<TestComponent />} />
              <Route path="/dashboard" element={<TestComponent />} />
              <Route path="*" element={<TestComponent />} />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    );
  } catch (err) {
    console.error('💥 Error in App render:', err);
    setError(err instanceof Error ? err.message : 'Unknown error occurred');
    return <ErrorScreen error="Failed to render application" />;
  }
};

console.log('✅ App component defined successfully');
export default App;
