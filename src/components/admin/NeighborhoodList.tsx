import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowRight, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router";

export default function NeighborhoodList() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [managingNeighborhood, setManagingNeighborhood] = useState<string | null>(null);

  const handleGoTo = async (neighborhoodId: string) => {
    if (!user?.id) return;

    const { error } = await supabase.rpc("admin_set_user_neighborhood", {
      target_user_id: user.id,
      target_neighborhood_id: neighborhoodId,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to access neighborhood.",
        variant: "destructive"
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
    navigate('/dashboard');
  };

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

  const { data: usersInNeighborhood } = useQuery({
    queryKey: ["users-in-neighborhood", managingNeighborhood],
    queryFn: async () => {
      if (!managingNeighborhood) return [];
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username')
        .eq('neighborhood_id', managingNeighborhood);

      if (error) throw error;
      return data;
    },
    enabled: !!managingNeighborhood
  });

  const handleRemoveUser = async (userId: string) => {
    const { error } = await supabase.rpc("admin_set_user_neighborhood", {
      target_user_id: userId,
      target_neighborhood_id: null,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove user.",
        variant: "destructive"
      });
      return;
    }

    toast({ title: "User removed" });
    queryClient.invalidateQueries({ queryKey: ["users-in-neighborhood", managingNeighborhood] });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('neighborhoods')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Could not delete neighborhood. Remove all users first.",
        variant: "destructive"
      });
      return;
    }

    toast({ title: "Success", description: "Neighborhood deleted" });
    queryClient.invalidateQueries({ queryKey: ["neighborhoods"] });
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
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleGoTo(neighborhood.id)}
                  title="Go to neighborhood"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Dialog onOpenChange={(open) => {
                  if (open) setManagingNeighborhood(neighborhood.id);
                }}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" title="Manage users">
                      <Users className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Manage Users — {neighborhood.name}</DialogTitle>
                      <DialogDescription>
                        Remove or reassign users before deleting this neighborhood.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {usersInNeighborhood?.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No users in this neighborhood. Safe to delete.</p>
                      ) : (
                        usersInNeighborhood?.map((profile) => (
                          <div key={profile.id} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {profile.full_name || profile.username || profile.id}
                              </p>
                            </div>
                            <div className="flex gap-2 ml-auto">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveUser(profile.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
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
          {neighborhoods?.length === 0 && (
            <p className="text-muted-foreground">No neighborhoods found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
