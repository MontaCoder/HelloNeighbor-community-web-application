import { useAuth } from "@/components/auth/AuthProvider";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AlertsPreview } from "@/components/dashboard/AlertsPreview";
import { EventsPreview } from "@/components/dashboard/EventsPreview";
import { LandingPage } from "@/components/landing/LandingPage";
import { LocationDetector } from "@/components/location/LocationDetector";
import { LocationMap } from "@/components/location/LocationMap";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Bell, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const Index = () => {
  const { user, loading, profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const neighborhoodId = profile?.neighborhood_id;

  const { data: neighborhood, isLoading: neighborhoodLoading } = useQuery({
    queryKey: ["neighborhood", neighborhoodId],
    queryFn: async () => {
      if (!neighborhoodId) return null;
      const { data, error } = await supabase
        .from("neighborhoods")
        .select("name")
        .eq("id", neighborhoodId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!neighborhoodId,
  });

  const { data: nearbyEvents } = useQuery({
    queryKey: ["nearby-events", neighborhoodId],
    queryFn: async () => {
      if (!neighborhoodId) return [];
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("neighborhood_id", neighborhoodId)
        .order("start_time", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!neighborhoodId,
  });

  const { data: nearbyAlerts } = useQuery({
    queryKey: ["nearby-alerts", neighborhoodId],
    queryFn: async () => {
      if (!neighborhoodId) return [];
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .eq("neighborhood_id", neighborhoodId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!neighborhoodId,
  });

  const { data: nearbyItems } = useQuery({
    queryKey: ["nearby-items", neighborhoodId],
    queryFn: async () => {
      if (!neighborhoodId) return [];
      const { data, error } = await supabase
        .from("marketplace_items")
        .select("*")
        .eq("neighborhood_id", neighborhoodId)
        .eq("status", "available")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!neighborhoodId,
  });

  useEffect(() => {
    if (!neighborhoodId) return;

    const channel = supabase
      .channel("dashboard-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
          filter: `neighborhood_id=eq.${neighborhoodId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["nearby-events"] });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "alerts",
          filter: `neighborhood_id=eq.${neighborhoodId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            toast({
              title: "New Alert",
              description: "A new alert has been posted in your neighborhood",
            });
          }
          queryClient.invalidateQueries({ queryKey: ["nearby-alerts"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [neighborhoodId, queryClient, toast]);

  if (loading) return null;

  if (user) {
    return (
      <div className="min-h-screen flex flex-col w-full bg-muted/20">
        <AppSidebar />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
                <div>
                  {loading ? (
                    <Skeleton className="h-10 w-72 mb-3" />
                  ) : (
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                      Welcome back,{" "}
                      <span className="text-gradient">
                        {profile?.full_name?.split(" ")[0] ||
                          user?.email?.split("@")[0] ||
                          "Neighbor"}
                      </span>
                    </h1>
                  )}
                  {neighborhoodLoading ? (
                    <Skeleton className="h-6 w-48" />
                  ) : (
                    neighborhood && (
                      <div className="flex items-center text-muted-foreground mt-2">
                        <MapPin className="h-4 w-4 mr-2 text-accent" />
                        <span className="text-base">{neighborhood.name}</span>
                      </div>
                    )
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <LocationDetector />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/alerts")}
                    className="gap-2"
                  >
                    <Bell className="h-4 w-4" />
                    View Alerts
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/events")}
                    className="gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    All Events
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <LocationMap
                    events={nearbyEvents}
                    alerts={nearbyAlerts}
                    items={nearbyItems}
                  />
                </CardContent>
              </Card>

              <div className="grid lg:grid-cols-2 gap-6">
                <EventsPreview />
                <AlertsPreview />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return <LandingPage />;
};

export default Index;
