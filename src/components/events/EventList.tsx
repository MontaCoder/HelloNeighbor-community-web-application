import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function EventList() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const neighborhoodId = profile?.neighborhood_id;

  const { data: events, refetch } = useQuery({
    queryKey: ["events", profile?.neighborhood_id],
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

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("events").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Event deleted",
        description: "The event has been removed successfully.",
      });

      refetch();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "There was a problem deleting the event.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (!events?.length) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No events yet</h3>
        <p className="text-muted-foreground text-sm">
          Create your first community event to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events?.map((event) => (
        <div
          key={event.id}
          className="group rounded-xl bg-card border border-border/40 p-4 shadow-soft-sm hover:shadow-soft-md transition-all duration-300"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <Badge variant="soft-primary" className="mb-2">
                <Calendar className="h-3 w-3 mr-1" />
                Event
              </Badge>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {event.title}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(event.start_time)} at {formatTime(event.start_time)}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {event.location}
                </span>
              </div>
              {event.description && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {event.description}
                </p>
              )}
            </div>
            {user?.id === event.created_by && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDelete(event.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          {event.image_url && (
            <img
              src={event.image_url}
              alt={event.title}
              className="mt-4 rounded-lg w-full h-40 object-cover"
            />
          )}
        </div>
      ))}
    </div>
  );
}
