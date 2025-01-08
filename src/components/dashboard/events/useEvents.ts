import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";

export function useEvents() {
  const { toast } = useToast();
  const { profile } = useAuth();

  const { data: events, refetch } = useQuery({
    queryKey: ["events-preview", profile?.neighborhood_id],
    queryFn: async () => {
      // Only fetch events from the user's neighborhood
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq('neighborhood_id', profile?.neighborhood_id)
        .gte("start_time", new Date().toISOString())
        .order("start_time", { ascending: true })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.neighborhood_id // Only run query if user has a neighborhood set
  });

  const handleDelete = async (eventId: string) => {
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId);

    if (error) {
      toast({
        title: "Error deleting event",
        description: "Please try again later.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Event deleted",
      description: "The event has been removed successfully."
    });
    refetch();
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
          neighborhood_id: profile?.neighborhood_id
        })
        .eq("id", eventId);

      if (error) throw error;

      toast({
        title: "Event updated",
        description: "Your event has been updated successfully."
      });

      refetch();
    } catch (error) {
      toast({
        title: "Error updating event",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  return {
    events,
    handleDelete,
    handleEdit
  };
}