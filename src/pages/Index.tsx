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

  const { data: neighborhood } = useQuery({
    queryKey: ['neighborhood', profile?.neighborhood_id],
    queryFn: async () => {
      if (!profile?.neighborhood_id) return null;
      const { data, error } = await supabase
        .from('neighborhoods')
        .select('name')
        .eq('id', profile.neighborhood_id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.neighborhood_id
  });

  const { data: nearbyEvents } = useQuery({
    queryKey: ["nearby-events", profile?.neighborhood_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq('neighborhood_id', profile?.neighborhood_id)
        .order("start_time", { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.neighborhood_id
  });

  const { data: nearbyAlerts } = useQuery({
    queryKey: ["nearby-alerts", profile?.neighborhood_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .eq('neighborhood_id', profile?.neighborhood_id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.neighborhood_id
  });

  const { data: nearbyItems } = useQuery({
    queryKey: ["nearby-items", profile?.neighborhood_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketplace_items")
        .select("*")
        .eq('neighborhood_id', profile?.neighborhood_id)
        .eq("status", "available")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.neighborhood_id
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
                {neighborhood && (
                  <p className="text-lg text-gray-600 mb-4">
                    Your Neighborhood: {neighborhood.name}
                  </p>
                )}
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