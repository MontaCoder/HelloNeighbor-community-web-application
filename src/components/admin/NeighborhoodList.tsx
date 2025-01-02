import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Loader } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function NeighborhoodList() {
  const { toast } = useToast();

  const { data: neighborhoods, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["neighborhoods"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('neighborhoods')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('neighborhoods')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Neighborhood deleted",
        description: "The neighborhood has been removed successfully."
      });

      refetch();
    } catch (error) {
      console.error('Error deleting neighborhood:', error);
      toast({
        title: "Error",
        description: "Could not delete the neighborhood. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading neighborhoods: {(error as Error).message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Neighborhoods</CardTitle>
      </CardHeader>
      <CardContent>
        {neighborhoods && neighborhoods.length > 0 ? (
          <div className="space-y-4">
            {neighborhoods.map((neighborhood) => (
              <div
                key={neighborhood.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{neighborhood.name}</h3>
                  <p className="text-sm text-gray-500">{neighborhood.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      toast({
                        description: "Edit functionality coming soon"
                      });
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(neighborhood.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No neighborhoods found</p>
        )}
      </CardContent>
    </Card>
  );
}