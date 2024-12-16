import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Events() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*, profiles(full_name)")
        .order("start_time", { ascending: true });
      
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
              <h1 className="text-3xl font-bold text-primary">Community Events</h1>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Event
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p>Loading events...</p>
                  ) : events?.length === 0 ? (
                    <p>No events scheduled</p>
                  ) : (
                    <div className="space-y-4">
                      {events?.map((event) => (
                        <div
                          key={event.id}
                          className="p-4 rounded-lg bg-white border"
                        >
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(event.start_time).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">{event.location}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}