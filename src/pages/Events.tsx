import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EventForm } from "@/components/dashboard/events/EventForm";
import { EventCard } from "@/components/dashboard/events/EventCard";
import { useQuery } from "@tanstack/react-query";

export default function Events() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const { data: events, refetch } = useQuery({
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

  const handleCreate = async (values: any) => {
    try {
      const { error } = await supabase
        .from("events")
        .insert({
          title: values.title,
          description: values.description,
          location: values.location,
          start_time: values.start_time,
          end_time: values.end_time,
          image_url: values.image_url,
          created_by: user?.id,
          city: profile?.city // Add the city field from the user's profile
        });

      if (error) throw error;

      toast({
        title: "Event created successfully",
        description: "Your event has been added to the calendar."
      });

      refetch();
    } catch (error) {
      toast({
        title: "Error creating event",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (eventId: string) => {
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId);

    if (error) {
      toast({
        title: "Error deleting event",
        description: "Please try again later.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Event deleted",
      description: "The event has been removed successfully."
    });
    refetch();
  };

  const handleEdit = async (eventId: string, values: any) => {
    try {
      const { error } = await supabase
        .from("events")
        .update({
          title: values.title,
          description: values.description,
          location: values.location,
          start_time: values.start_time,
          end_time: values.end_time,
          image_url: values.image_url,
        })
        .eq("id", eventId);

      if (error) throw error;

      toast({
        title: "Event updated",
        description: "Your event has been updated successfully."
      });

      refetch();
    } catch (error) {
      toast({
        title: "Error updating event",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#FAF9F6]">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-primary">Community Events</h1>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create Event
                  </Button>
                </DialogTrigger>
                <EventForm onSubmit={handleCreate} mode="create" />
              </Dialog>
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
                  <div className="space-y-4">
                    {events?.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
