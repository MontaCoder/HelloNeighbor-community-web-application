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
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const DashboardContent = () => {
  const { profile } = useAuth();
  const { toast } = useToast();

  const { data: neighborhood, isLoading: neighborhoodLoading, error: neighborhoodError } = useQuery({
    queryKey: ['neighborhood', profile?.neighborhood_id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('neighborhoods')
          .select('name')
          .eq('id', profile?.neighborhood_id)
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching neighborhood:', error);
        toast({
          title: "Error fetching neighborhood",
          description: "Please try again later",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!profile?.neighborhood_id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data: nearbyData, isLoading: nearbyLoading, error: nearbyError } = useQuery({
    queryKey: ["nearby-data", profile?.neighborhood_id],
    queryFn: async () => {
      try {
        const [eventsRes, alertsRes, itemsRes] = await Promise.all([
          supabase
            .from("events")
            .select("*")
            .eq('neighborhood_id', profile?.neighborhood_id)
            .order("start_time", { ascending: true })
            .limit(5),
          supabase
            .from("alerts")
            .select("*")
            .eq('neighborhood_id', profile?.neighborhood_id)
            .order("created_at", { ascending: false })
            .limit(5),
          supabase
            .from("marketplace_items")
            .select("*")
            .eq('neighborhood_id', profile?.neighborhood_id)
            .eq("status", "available")
            .order("created_at", { ascending: false })
            .limit(5)
        ]);

        if (eventsRes.error) throw eventsRes.error;
        if (alertsRes.error) throw alertsRes.error;
        if (itemsRes.error) throw itemsRes.error;

        return {
          events: eventsRes.data,
          alerts: alertsRes.data,
          items: itemsRes.data
        };
      } catch (error) {
        console.error('Error fetching nearby data:', error);
        toast({
          title: "Error fetching neighborhood data",
          description: "Please try again later",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!profile?.neighborhood_id,
    staleTime: 30 * 1000, // Cache for 30 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  if (neighborhoodError || nearbyError) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {neighborhoodError?.message || nearbyError?.message || 'Failed to load dashboard data'}
        </AlertDescription>
      </Alert>
    );
  }

  const isLoading = neighborhoodLoading || nearbyLoading;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
          Welcome, {profile?.full_name || "Neighbor"}
        </h1>
        {neighborhood && (
          <p className="text-base md:text-lg text-gray-600 mb-4">
            Your Neighborhood: {neighborhood.name}
          </p>
        )}
        <LocationDetector />
      </header>
      
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          <LocationMap 
            events={nearbyData?.events} 
            alerts={nearbyData?.alerts}
            items={nearbyData?.items}
          />
          <div className="grid gap-6 md:grid-cols-2">
            <AlertsPreview />
            <EventsPreview />
          </div>
        </div>
      )}
    </div>
  );
};

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-[#FAF9F6]">
          <AppSidebar />
          <main className="flex-1 overflow-auto">
            <DashboardContent />
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return <LandingPage />;
};

export default Index;