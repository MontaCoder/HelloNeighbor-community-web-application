import { Bell, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertCard } from "./AlertCard";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

export function AlertsPreview() {
  const { toast } = useToast();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: alerts, isLoading, refetch } = useQuery({
    queryKey: ["alerts-preview", profile?.neighborhood_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .eq('neighborhood_id', profile?.neighborhood_id)
        .order("created_at", { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.neighborhood_id
  });

  useEffect(() => {
    if (!profile?.neighborhood_id) return;

    const channel = supabase.channel('alerts-preview')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'alerts',
        filter: `neighborhood_id=eq.${profile.neighborhood_id}`
      }, () => {
        refetch();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.neighborhood_id]);

  const handleDelete = async (alertId: string) => {
    const { error } = await supabase
      .from("alerts")
      .delete()
      .eq("id", alertId);

    if (error) {
      toast({
        title: "Error deleting alert",
        description: "Please try again later.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Alert deleted",
      description: "The alert has been removed successfully."
    });
    refetch();
  };

  const handleEdit = async (alertId: string, values: any) => {
    try {
      const { error } = await supabase
        .from("alerts")
        .update({
          title: values.title,
          message: values.message,
          type: values.type,
          urgency: values.urgency,
          neighborhood_id: profile?.neighborhood_id
        })
        .eq("id", alertId);

      if (error) throw error;

      toast({
        title: "Alert updated",
        description: "Your alert has been updated successfully."
      });

      refetch();
    } catch (error) {
      toast({
        title: "Error updating alert",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">Recent Alerts</CardTitle>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-accent" />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/alerts')}
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))
          ) : alerts?.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent alerts
            </p>
          ) : (
            alerts?.map((alert) => (
              <AlertCard 
                key={alert.id}
                alert={alert}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}