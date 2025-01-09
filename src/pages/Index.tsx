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
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { user, loading, profile } = useAuth();
  const { toast } = useToast();

  const { data: neighborhood, isLoading: neighborhoodLoading } = useQuery({
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

  const { data: nearbyEvents, isLoading: eventsLoading } = useQuery({
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

  const { data: nearbyAlerts, isLoading: alertsLoading } = useQuery({
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

  const { data: nearbyItems, isLoading: itemsLoading } = useQuery({
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

  // Set up realtime subscriptions
  useEffect(() => {
    if (!profile?.neighborhood_id) return;

    const channel = supabase.channel('dashboard-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'events',
        filter: `neighborhood_id=eq.${profile.neighborhood_id}`
      }, () => {
        // Refetch events when changes occur
        queryClient.invalidateQueries(["nearby-events"]);
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'alerts',
        filter: `neighborhood_id=eq.${profile.neighborhood_id}`
      }, (payload) => {
        // Show notification for new alerts
        if (payload.eventType === 'INSERT') {
          toast({
            title: "New Alert",
            description: "A new alert has been posted in your neighborhood",
          });
        }
        queryClient.invalidateQueries(["nearby-alerts"]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.neighborhood_id]);

  if (loading) return null;

  // If user is logged in, show the dashboard
  if (user) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-[#FAF9F6]">
          <AppSidebar />
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto space-y-8">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    {loading ? (
                      <Skeleton className="h-8 w-64 mb-2" />
                    ) : (
                      <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Welcome back, {profile?.full_name || user?.email?.split('@')[0] || "Neighbor"}
                      </h1>
                    )}
                    {neighborhoodLoading ? (
                      <Skeleton className="h-6 w-48" />
                    ) : neighborhood && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-5 w-5 mr-2" />
                        <p className="text-lg">
                          {neighborhood.name}
                        </p>
                      </div>
                    )}
                  </div>
                  <LocationDetector />
                </div>
              </div>
              
              <div className="space-y-6">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-0">
                    <LocationMap 
                      events={nearbyEvents} 
                      alerts={nearbyAlerts}
                      items={nearbyItems}
                    />
                  </CardContent>
                </Card>

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