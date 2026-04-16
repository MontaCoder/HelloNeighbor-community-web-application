import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertCard } from "./AlertCard";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";

export function AlertsPreview() {
  const { toast } = useToast();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const { data: alerts, isLoading, refetch } = useQuery({
    queryKey: ["alerts-preview", profile?.neighborhood_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .eq("neighborhood_id", profile?.neighborhood_id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.neighborhood_id,
  });

  const handleDelete = async (alertId: string) => {
    const { error } = await supabase.from("alerts").delete().eq("id", alertId);

    if (error) {
      toast({
        title: "Error deleting alert",
        description: "Please try again later.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Alert deleted",
      description: "The alert has been removed successfully.",
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
          neighborhood_id: profile?.neighborhood_id,
        })
        .eq("id", alertId);

      if (error) throw error;

      toast({
        title: "Alert updated",
        description: "Your alert has been updated successfully.",
      });

      refetch();
    } catch (error) {
      toast({
        title: "Error updating alert",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="animate-scale-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Bell className="h-4 w-4 text-destructive" />
            </div>
            Recent Alerts
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/alerts")}
            className="text-muted-foreground"
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            Array(2)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))
          ) : alerts?.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">No recent alerts</p>
            </div>
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
