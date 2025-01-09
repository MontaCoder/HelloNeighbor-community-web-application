import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";

export function useEvents() {
  const { toast } = useToast();
  const { profile, user } = useAuth();

  const { data: events = [], isLoading, refetch } = useQuery({
    queryKey: ["events-preview", profile?.neighborhood_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("neighborhood_id", profile?.neighborhood_id)
        .order("start_time", { ascending: true })
        .limit(5);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch events",
          variant: "destructive",
        });
        throw error;
      }

      return data || [];
    },
    enabled: !!profile?.neighborhood_id,
  });

  const handleDelete = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId)
        .eq("created_by", user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event deleted successfully",
      });

      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (eventId: string, values: any) => {
    try {
      const { error } = await supabase
        .from("events")
        .update(values)
        .eq("id", eventId)
        .eq("created_by", user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event updated successfully",
      });

      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
      });
    }
  };

  const handleCreate = async (values: any) => {
    try {
      const { error } = await supabase.from("events").insert([
        {
          ...values,
          created_by: user?.id,
          neighborhood_id: profile?.neighborhood_id,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event created successfully",
      });

      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    }
  };

  return {
    events,
    isLoading,
    handleDelete,
    handleEdit,
    handleCreate,
  };
}