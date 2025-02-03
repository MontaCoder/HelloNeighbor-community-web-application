import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { EventForm } from "@/components/events/EventForm";
import { EventList } from "@/components/events/EventList";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarContent } from "@/components/ui/sidebar";

export default function Events() {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  const handleEventCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["events"] });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#FAF9F6]">
        <AppSidebar />
        {isMobile && <SidebarContent />}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-primary">
                Community Events
              </h1>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Event
                  </Button>
                </DialogTrigger>
                <EventForm onSubmit={handleEventCreated} mode="create" />
              </Dialog>
            </div>
            <div className="space-y-6">
              <EventList />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
