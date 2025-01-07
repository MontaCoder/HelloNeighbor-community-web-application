import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertCard } from "./AlertCard";
import { useAuth } from "@/components/auth/AuthProvider";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function AlertsPreview() {
  const { toast } = useToast();
  const { profile } = useAuth();

  const { data: alerts, isLoading, error, refetch } = useQuery({
    queryKey: ["alerts-preview", profile?.neighborhood_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("*, profiles:created_by(full_name)")
        .eq('neighborhood_id', profile?.neighborhood_id)
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.neighborhood_id,
    staleTime: 30 * 1000, // Cache for 30 seconds
    retry: 2
  });

  const handleDelete = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from("alerts")
        .delete()
        .eq("id", alertId);

      if (error) throw error;

      toast({
        title: "Alert deleted",
        description: "The alert has been removed successfully."
      });

      refetch();
    } catch (error: any) {
      console.error('Error deleting alert:', error);
      toast({
        title: "Error",
        description: error.message || "There was a problem deleting the alert.",
        variant: "destructive"
      });
    }
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
          updated_at: new Date().toISOString()
        })
        .eq("id", alertId);

      if (error) throw error;

      toast({
        title: "Alert updated",
        description: "The alert has been updated successfully."
      });

      refetch();
    } catch (error: any) {
      console.error('Error updating alert:', error);
      toast({
        title: "Error",
        description: error.message || "There was a problem updating the alert.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">Recent Alerts</CardTitle>
        <Bell className="h-5 w-5 text-accent" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>
              {error.message || "Failed to load alerts"}
            </AlertDescription>
          </Alert>
        ) : alerts?.length === 0 ? (
          <p className="text-center text-gray-500 p-4">
            No recent alerts in your neighborhood
          </p>
        ) : (
          <div className="space-y-4">
            {alerts?.map((alert) => (
              <AlertCard 
                key={alert.id}
                alert={alert}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}