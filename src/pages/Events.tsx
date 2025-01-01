import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { EventForm } from "@/components/events/EventForm";
import { EventList } from "@/components/events/EventList";
import { useQueryClient } from "@tanstack/react-query";

export default function Events() {
  const queryClient = useQueryClient();

  const handleEventCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["events"] });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#FAF9F6]">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-primary mb-6">
              Community Events
            </h1>
            <div className="space-y-6">
              <EventForm onSuccess={handleEventCreated} />
              <EventList />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}