import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export default function Neighbors() {
  const { data: neighbors, isLoading } = useQuery({
    queryKey: ["neighbors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
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
            <h1 className="text-3xl font-bold text-primary mb-6">Your Neighbors</h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <p>Loading neighbors...</p>
              ) : neighbors?.length === 0 ? (
                <p>No neighbors found</p>
              ) : (
                neighbors?.map((neighbor) => (
                  <Card key={neighbor.id}>
                    <CardHeader>
                      <CardTitle>{neighbor.full_name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        {neighbor.neighborhood || "Neighborhood not specified"}
                      </p>
                      <Button variant="outline" className="w-full">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
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