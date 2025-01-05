import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EventCard } from "@/components/dashboard/events/EventCard";
import { useAuth } from "@/components/auth/AuthProvider";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function EventsPreview() {
  const { toast } = useToast();
  const { profile } = useAuth();

  const { data: events, isLoading, error, refetch } = useQuery({
    queryKey: ["events-preview", profile?.neighborhood_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*, profiles:created_by(full_name)")
        .eq('neighborhood_id', profile?.neighborhood_id)
        .gte('end_time', new Date().toISOString())
        .order("start_time", { ascending: true })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.neighborhood_id,
    staleTime: 30 * 1000, // Cache for 30 seconds
    retry: 2
  });

  const handleDelete = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (error) throw error;

      toast({
        title: "Event deleted",
        description: "The event has been removed successfully."
      });

      refetch();
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: error.message || "There was a problem deleting the event.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = async (eventId: string, values: any) => {
    try {
      const { error } = await supabase
        .from("events")
        .update({
          title: values.title,
          description: values.description,
          location: values.location,
          start_time: values.start_time,
          end_time: values.end_time,
          image_url: values.image_url,
          updated_at: new Date().toISOString()
        })
        .eq("id", eventId);

      if (error) throw error;

      toast({
        title: "Event updated",
        description: "The event has been updated successfully."
      });

      refetch();
    } catch (error: any) {
      console.error('Error updating event:', error);
      toast({
        title: "Error",
        description: error.message || "There was a problem updating the event.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">Upcoming Events</CardTitle>
        <Calendar className="h-5 w-5 text-accent" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>
              {error.message || "Failed to load events"}
            </AlertDescription>
          </Alert>
        ) : events?.length === 0 ? (
          <p className="text-center text-gray-500 p-4">
            No upcoming events in your neighborhood
          </p>
        ) : (
          <div className="space-y-4">
            {events?.map((event) => (
              <EventCard 
                key={event.id}
                event={event}
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