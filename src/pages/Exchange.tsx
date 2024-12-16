import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Exchange() {
  const { data: items, isLoading } = useQuery({
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#FAF9F6]">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-primary">Community Exchange</h1>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> List Item
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <p>Loading items...</p>
              ) : items?.length === 0 ? (
                <p>No items available</p>
              ) : (
                items?.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </CardHeader>
                    <CardContent>
                      <p>{item.description}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="font-bold">
                          {item.price ? `$${item.price}` : "Free"}
                        </span>
                        <Button variant="outline">Contact Seller</Button>
                      </div>
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