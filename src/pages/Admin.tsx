import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Shield, Loader, LogOut } from "lucide-react";
import NeighborhoodList from "@/components/admin/NeighborhoodList";
import NeighborhoodForm from "@/components/admin/NeighborhoodForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AppSidebar } from "@/components/layout/AppSidebar";

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"neighborhoods" | "settings">("neighborhoods");

  const { data: isAdmin, isLoading, isError } = useQuery({
    queryKey: ["is-admin", user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      const { data, error } = await supabase.rpc("is_admin", { user_id: user.id });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, isLoading, navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate("/auth");
    } catch {
      toast({
        title: "Error logging out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col w-full bg-muted/20">
        <AppSidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col w-full bg-muted/20">
        <AppSidebar />
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                There was an error checking admin permissions. Please try again later.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col w-full bg-muted/20">
      <AppSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Admin Panel
              </h1>
              <p className="text-muted-foreground text-sm">
                Manage neighborhoods and system settings
              </p>
            </div>
          </div>

          <Card className="animate-scale-in">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>Admin Panel</CardTitle>
                </div>
                <Button variant="outline" onClick={handleLogout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
              <CardDescription>
                Manage neighborhoods and system settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex gap-2">
                <Button
                  size="sm"
                  variant={activeTab === "neighborhoods" ? "default" : "outline"}
                  onClick={() => setActiveTab("neighborhoods")}
                >
                  Neighborhoods
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === "settings" ? "default" : "outline"}
                  onClick={() => setActiveTab("settings")}
                >
                  Settings
                </Button>
              </div>

              {activeTab === "neighborhoods" ? (
                <div className="space-y-6">
                  <NeighborhoodForm />
                  <NeighborhoodList />
                </div>
              ) : (
                <p className="text-muted-foreground">System settings will be implemented here.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
