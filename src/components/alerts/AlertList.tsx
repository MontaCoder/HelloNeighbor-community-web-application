import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function AlertList() {
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const { data: alerts, refetch } = useQuery({
    queryKey: ["alerts", profile?.city],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.city
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("alerts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Alert deleted",
        description: "The alert has been removed successfully."
      });

      refetch();
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast({
        title: "Error",
        description: "There was a problem deleting the alert.",
        variant: "destructive"
      });
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="space-y-4">
      {alerts?.map((alert) => (
        <Card key={alert.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">{alert.title}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{alert.type}</Badge>
              <Badge className={getUrgencyColor(alert.urgency)}>
                {alert.urgency}
              </Badge>
              {user?.id === alert.created_by && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(alert.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{alert.message}</p>
            <p className="text-sm text-gray-400 mt-2">
              Posted on {new Date(alert.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}