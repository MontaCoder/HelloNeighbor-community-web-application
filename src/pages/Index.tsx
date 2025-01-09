import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { LandingPage } from "@/components/landing/LandingPage";
import { LocationDetector } from "@/components/location/LocationDetector";
import { LocationMap } from "@/components/location/LocationMap";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const Index = () => {
  const { user, loading, profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: neighborhood, isLoading: neighborhoodLoading } = useQuery({
    queryKey: ['neighborhood', profile?.neighborhood_id],
    queryFn: async () => {
      if (!profile?.neighborhood_id) return null;
      const { data, error } = await supabase
        .from('neighborhoods')
        .select('*')
        .eq('id', profile.neighborhood_id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.neighborhood_id
  });

  useEffect(() => {
    if (!profile?.neighborhood_id) return;

    // Subscribe to real-time updates
    const channel = supabase
      .channel('neighborhood-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'events',
        filter: `neighborhood_id=eq.${profile.neighborhood_id}`
      }, () => {
        // Refetch events when changes occur
        queryClient.invalidateQueries({ queryKey: ["nearby-events"] });
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
        queryClient.invalidateQueries({ queryKey: ["nearby-alerts"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.neighborhood_id, queryClient, toast]);

  if (loading) return null;

  if (!user) {
    return <LandingPage />;
  }

  if (!profile?.neighborhood_id) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-muted-foreground mb-4">
              <MapPin className="h-4 w-4" />
              <p>Select your neighborhood to continue</p>
            </div>
            <LocationDetector />
            <LocationMap />
          </CardContent>
        </Card>
      </div>
    );
  }

  return <Dashboard />;
};

export default Index;