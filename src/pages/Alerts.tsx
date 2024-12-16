import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Alerts() {
  const { data: alerts, isLoading } = useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("*, profiles(full_name)")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#FAF9F6]">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-primary">Community Alerts</h1>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Alert
              </Button>
            </div>

            <div className="grid gap-4">
              {isLoading ? (
                <p>Loading alerts...</p>
              ) : alerts?.length === 0 ? (
                <p>No alerts</p>
              ) : (
                alerts?.map((alert) => (
                  <Card key={alert.id} className={`border-l-4 ${
                    alert.urgency === 'high' ? 'border-l-red-500' :
                    alert.urgency === 'medium' ? 'border-l-yellow-500' :
                    'border-l-blue-500'
                  }`}>
                    <CardHeader>
                      <CardTitle className="flex justify-between">
                        <span>{alert.title}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(alert.created_at).toLocaleDateString()}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{alert.message}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Posted by {alert.profiles?.full_name}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}