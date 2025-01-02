import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Shield } from "lucide-react";
import NeighborhoodList from "@/components/admin/NeighborhoodList";
import NeighborhoodForm from "@/components/admin/NeighborhoodForm";

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if user is admin
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["is-admin", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('is_admin', { user_id: user?.id });
      
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

  if (isLoading || !isAdmin) return null;

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