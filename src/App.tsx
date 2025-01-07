import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/auth/AuthProvider";
import AuthPage from "./components/auth/AuthPage";
import LocationSetup from "./pages/LocationSetup";
import Index from "./pages/Index";
import Events from "./pages/Events";
import Alerts from "./pages/Alerts";
import Exchange from "./pages/Exchange";
import Messages from "./pages/Messages";
import Neighbors from "./pages/Neighbors";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";

// Configure query client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevent unnecessary refetches
      retry: 1, // Limit retries to reduce network load
      staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
      gcTime: 1000 * 60 * 30, // Keep unused data in cache for 30 minutes (renamed from cacheTime)
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, profile } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    console.log("User not authenticated, redirecting to auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Skip location check for admin route
  if (location.pathname === '/admin') {
    return <>{children}</>;
  }
  
  // Redirect to location setup if user has no verified neighborhood
  if (!profile?.neighborhood_id) {
    console.log("No neighborhood set, redirecting to location setup");
    return <Navigate to="/location-setup" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
}

// Memoize routes component to prevent unnecessary rerenders
const AppRoutes = React.memo(function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <Routes>
      {/* Public routes - accessible without authentication */}
      <Route path="/auth" element={<AuthPage />} />
      
      {/* Location setup route - requires auth but no location */}
      <Route path="/location-setup" element={
        user ? <LocationSetup /> : <Navigate to="/auth" />
      } />
      
      {/* Root route - redirect based on auth status */}
      <Route path="/" element={
        user ? <Navigate to="/dashboard" /> : <Index />
      } />
      
      {/* Protected routes - require authentication and location */}
      <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
      <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
      <Route path="/exchange" element={<ProtectedRoute><Exchange /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      <Route path="/neighbors" element={<ProtectedRoute><Neighbors /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
    </Routes>
  );
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
          <Sonner />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;