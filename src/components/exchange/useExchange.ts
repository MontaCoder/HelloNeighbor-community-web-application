import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useExchange() {
  const { toast } = useToast();

  const { data: items, refetch } = useQuery({
    queryKey: ["marketplace"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketplace_items")
        .select("*, profiles(full_name)")
        .eq("status", "available")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
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

  const handleCreate = async (values: any) => {
    try {
      const { error } = await supabase
        .from("marketplace_items")
        .insert({
          title: values.title,
          description: values.description,
          price: values.price ? parseFloat(values.price) : null,
          category: values.category,
          image_urls: values.image_urls,
          created_by: supabase.auth.getUser()?.data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Item listed successfully",
        description: "Your item has been added to the marketplace."
      });

      refetch();
    } catch (error) {
      toast({
        title: "Error creating item",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = async (itemId: string, values: any) => {
    try {
      const { error } = await supabase
        .from("marketplace_items")
        .update({
          title: values.title,
          description: values.description,
          price: values.price ? parseFloat(values.price) : null,
          category: values.category,
          image_urls: values.image_urls,
        })
        .eq("id", itemId);

      if (error) throw error;

      toast({
        title: "Item updated",
        description: "Your item has been updated successfully."
      });

      refetch();
    } catch (error) {
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