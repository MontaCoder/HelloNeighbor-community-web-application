import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { NeighborhoodForm } from "@/components/admin/NeighborhoodForm";
import { NeighborhoodList } from "@/components/admin/NeighborhoodList";

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: isAdmin } = useQuery({
    queryKey: ["is-admin", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('is_admin', { user_id: user?.id });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#FAF9F6]">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-primary mb-6">Admin Panel</h1>
            
            <Tabs defaultValue="neighborhoods" className="space-y-4">
              <TabsList>
                <TabsTrigger value="neighborhoods">Neighborhoods</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
              </TabsList>

              <TabsContent value="neighborhoods" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Create Neighborhood</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <NeighborhoodForm />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Manage Neighborhoods</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <NeighborhoodList />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>User management features coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}