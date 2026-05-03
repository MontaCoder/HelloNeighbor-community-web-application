import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import type { ExchangeFormValues } from "./ExchangeForm";

export function useExchange() {
  const { toast } = useToast();
  const { profile } = useAuth();
  const neighborhoodId = profile?.neighborhood_id;

  const { data: items, refetch } = useQuery({
    queryKey: ["marketplace", profile?.neighborhood_id],
    queryFn: async () => {
      if (!neighborhoodId) return [];
      const { data, error } = await supabase
        .from("marketplace_items")
        .select("*, profiles(full_name)")
        .eq("status", "available")
        .eq('neighborhood_id', neighborhoodId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!neighborhoodId
  });

  const handleDelete = async (itemId: string) => {
    const { error } = await supabase
      .from("marketplace_items")
      .delete()
      .eq("id", itemId);

    if (error) {
      toast({
        title: "Error deleting item",
        description: "Please try again later.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Item deleted",
      description: "The item has been removed successfully."
    });
    refetch();
  };

  const handleCreate = async (values: ExchangeFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("marketplace_items")
        .insert({
          title: values.title,
          description: values.description,
          price: values.price ? parseFloat(values.price) : null,
          category: values.category,
          image_urls: values.image_urls,
          created_by: user?.id,
          neighborhood_id: neighborhoodId
        });

      if (error) throw error;

      toast({
        title: "Item listed successfully",
        description: "Your item has been added to the marketplace."
      });

      refetch();
    } catch {
      toast({
        title: "Error creating item",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = async (itemId: string, values: ExchangeFormValues) => {
    try {
      const { error } = await supabase
        .from("marketplace_items")
        .update({
          title: values.title,
          description: values.description,
          price: values.price ? parseFloat(values.price) : null,
          category: values.category,
          image_urls: values.image_urls,
          neighborhood_id: neighborhoodId
        })
        .eq("id", itemId);

      if (error) throw error;

      toast({
        title: "Item updated",
        description: "Your item has been updated successfully."
      });

      refetch();
    } catch {
      toast({
        title: "Error updating item",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  return {
    items,
    handleDelete,
    handleCreate,
    handleEdit
  };
}
