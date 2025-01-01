import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, profile } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/auth" />;
  
  // Redirect to location setup if user has no location set
  if (!profile?.latitude || !profile?.longitude) {
    return <Navigate to="/location-setup" />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return null;

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
    </Routes>
  );
}

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