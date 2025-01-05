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
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

function LoadingSpinner() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, profile } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    console.log("User not authenticated, redirecting to auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Skip location check for admin route
  if (location.pathname === '/admin') {
    return <>{children}</>;
  }
  
  // Show loading state while profile is being fetched
  if (!profile && location.pathname !== '/location-setup') {
    return <LoadingSpinner />;
  }
  
  // Redirect to location setup if user has no verified neighborhood
  if (!profile?.neighborhood_id && location.pathname !== '/location-setup') {
    console.log("No neighborhood set, redirecting to location setup");
    return <Navigate to="/location-setup" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
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
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <AppRoutes />
            <Toaster />
            <Sonner />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;