import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

export function AlertList() {
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const { data: alerts, refetch } = useQuery({
    queryKey: ["alerts", profile?.neighborhood_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("*, profiles:created_by(full_name), neighborhoods:neighborhood_id(name)")
        .eq("neighborhood_id", profile?.neighborhood_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.neighborhood_id,
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("alerts").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Alert deleted",
        description: "The alert has been removed successfully.",
      });

      refetch();
    } catch (error) {
      console.error("Error deleting alert:", error);
      toast({
        title: "Error",
        description: "There was a problem deleting the alert.",
        variant: "destructive",
      });
    }
  };

  const urgencyStyles = {
    high: {
      bg: "bg-destructive/5 border-destructive/20",
      badge: "bg-destructive/10 text-destructive",
    },
    medium: {
      bg: "bg-amber-500/5 border-amber-500/20",
      badge: "bg-amber-500/10 text-amber-600",
    },
    low: {
      bg: "bg-blue-500/5 border-blue-500/20",
      badge: "bg-blue-500/10 text-blue-600",
    },
  };

  const typeLabels: Record<string, string> = {
    general: "General",
    safety: "Safety",
    maintenance: "Maintenance",
    event: "Event",
  };

  if (!alerts?.length) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No alerts</h3>
        <p className="text-muted-foreground text-sm">
          Your neighborhood is safe. No alerts have been posted.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts?.map((alert) => {
        const style = urgencyStyles[alert.urgency as keyof typeof urgencyStyles] || urgencyStyles.low;
        return (
          <div
            key={alert.id}
            className={`group rounded-xl p-4 border ${style.bg} transition-all duration-300 hover:shadow-soft-sm`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {typeLabels[alert.type] || alert.type}
                  </Badge>
                  <Badge className={`${style.badge} text-xs`}>
                    {alert.urgency}
                  </Badge>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{alert.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>By {alert.profiles?.full_name || "Unknown"}</span>
                  <span>in {alert.neighborhoods?.name || "Unknown Neighborhood"}</span>
                  <span>{new Date(alert.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              {user?.id === alert.created_by && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDelete(alert.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}