import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function NeighborhoodList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: neighborhoods, isLoading, error } = useQuery({
    queryKey: ["neighborhoods"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("neighborhoods")
        .select("*");
      
      if (error) throw error;
      return data;
    }
  });

  const handleDelete = async (id: string) => {
    try {
      // First check if there are any profiles in this neighborhood
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .eq('neighborhood_id', id);

      if (profilesError) throw profilesError;

      if (profiles && profiles.length > 0) {
        toast({
          title: "Cannot delete neighborhood",
          description: "There are still users living in this neighborhood. Please remove or reassign them first.",
          variant: "destructive"
        });
        return;
      }

      // If no profiles found, proceed with deletion
      const { error } = await supabase
        .from('neighborhoods')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Neighborhood deleted successfully"
      });

      queryClient.invalidateQueries({ queryKey: ["neighborhoods"] });
    } catch (error) {
      console.error('Error deleting neighborhood:', error);
      toast({
        title: "Error",
        description: "Could not delete neighborhood. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Neighborhoods</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading neighborhoods...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Neighborhoods</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error loading neighborhoods</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Neighborhoods</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {neighborhoods?.map((neighborhood) => (
            <div
              key={neighborhood.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h3 className="font-medium">{neighborhood.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {neighborhood.description}
                </p>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(neighborhood.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {neighborhoods?.length === 0 && (
            <p className="text-muted-foreground">No neighborhoods found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}