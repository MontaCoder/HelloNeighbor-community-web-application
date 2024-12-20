import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AlertsPreview } from "@/components/dashboard/AlertsPreview";
import { EventsPreview } from "@/components/dashboard/EventsPreview";
import { LandingPage } from "@/components/landing/LandingPage";
import { LocationDetector } from "@/components/location/LocationDetector";
import { LocationMap } from "@/components/location/LocationMap";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user, loading, profile } = useAuth();

  const { data: nearbyEvents } = useQuery({
    queryKey: ["nearby-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("start_time", { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const { data: nearbyAlerts } = useQuery({
    queryKey: ["nearby-alerts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const { data: nearbyItems } = useQuery({
    queryKey: ["nearby-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketplace_items")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  if (loading) return null;

  // If user is logged in, show the dashboard
  if (user) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-[#FAF9F6]">
          <AppSidebar />
          <main className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              <header className="mb-8">
                <h1 className="text-4xl font-bold text-primary mb-2">
                  Welcome, {profile?.full_name || user?.email || "Neighbor"}
                </h1>
                <p className="text-lg text-gray-600 mb-4">Stay connected with your community</p>
                <LocationDetector />
              </header>
              
              <div className="space-y-6">
                <LocationMap 
                  events={nearbyEvents} 
                  alerts={nearbyAlerts}
                  items={nearbyItems}
                />
                <div className="grid gap-6 md:grid-cols-2">
                  <AlertsPreview />
                  <EventsPreview />
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  // Landing page for non-authenticated users
  return <LandingPage />;
};

export default Index;