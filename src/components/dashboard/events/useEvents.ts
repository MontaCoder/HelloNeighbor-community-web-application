import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import type { EventFormValues } from "@/components/events/EventForm";

export function useEvents() {
  const { toast } = useToast();
  const { profile, user } = useAuth();
  const neighborhoodId = profile?.neighborhood_id;

  const { data: events, isLoading, refetch } = useQuery({
    queryKey: ["events-preview", profile?.neighborhood_id],
    queryFn: async () => {
      if (!neighborhoodId) return [];
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq('neighborhood_id', neighborhoodId)
        .gte("start_time", new Date().toISOString())
        .order("start_time", { ascending: true })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
    enabled: !!neighborhoodId
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

  const handleEdit = async (eventId: string, values: EventFormValues) => {
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
          neighborhood_id: neighborhoodId
        })
        .eq("id", eventId);

      if (error) throw error;

      toast({
        title: "Event updated",
        description: "Your event has been updated successfully."
      });

      refetch();
    } catch {
      toast({
        title: "Error updating event",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleCreate = async (values: EventFormValues) => {
    try {
      const { error } = await supabase
        .from("events")
        .insert({
          title: values.title,
          description: values.description,
          location: values.location,
          start_time: values.start_time,
          end_time: values.end_time,
          image_url: values.image_url,
          created_by: user?.id,
          neighborhood_id: neighborhoodId
        });

      if (error) throw error;

      toast({
        title: "Event created",
        description: "Your event has been created successfully."
      });

      refetch();
    } catch {
      toast({
        title: "Error creating event",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  return {
    events,
    isLoading,
    handleDelete,
    handleEdit,
    handleCreate
  };
}
