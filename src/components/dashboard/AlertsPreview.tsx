import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AlertCard } from "./AlertCard";

export function AlertsPreview() {
  const { toast } = useToast();

  const { data: alerts, refetch } = useQuery({
    queryKey: ["alerts-preview"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

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
        <Bell className="h-5 w-5 text-accent" />
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}