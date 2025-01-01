import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function EventList() {
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const { data: events, refetch } = useQuery({
    queryKey: ["events", profile?.city],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("start_time", { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.city
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Event deleted",
        description: "The event has been removed successfully."
      });

      refetch();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "There was a problem deleting the event.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      {events?.map((event) => (
        <Card key={event.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">{event.title}</CardTitle>
            {user?.id === event.created_by && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(event.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {event.image_url && (
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            )}
            <p className="text-gray-600">{event.description}</p>
            <div className="mt-4 space-y-2">
              <p className="text-sm">
                <strong>Location:</strong> {event.location}
              </p>
              <p className="text-sm">
                <strong>Start:</strong>{" "}
                {new Date(event.start_time).toLocaleString()}
              </p>
              <p className="text-sm">
                <strong>End:</strong>{" "}
                {new Date(event.end_time).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}