import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Shield, Loader } from "lucide-react";
import NeighborhoodList from "@/components/admin/NeighborhoodList";
import NeighborhoodForm from "@/components/admin/NeighborhoodForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if user is admin
  const { data: isAdmin, isLoading, isError } = useQuery({
    queryKey: ["is-admin", user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      const { data, error } = await supabase
        .rpc('is_admin', { user_id: user.id });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Redirect non-admin users
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center">
        <Loader className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error checking admin permissions. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle>Admin Panel</CardTitle>
          </div>
          <CardDescription>
            Manage neighborhoods and system settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="neighborhoods" className="space-y-4">
            <TabsList>
              <TabsTrigger value="neighborhoods">Neighborhoods</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="neighborhoods" className="space-y-4">
              <NeighborhoodForm />
              <NeighborhoodList />
            </TabsContent>
            
            <TabsContent value="settings">
              <p>System settings will be implemented here.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}