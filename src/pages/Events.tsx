import { AppSidebar } from "@/components/layout/AppSidebar";
import { EventForm } from "@/components/events/EventForm";
import { EventList } from "@/components/events/EventList";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Events() {
  const queryClient = useQueryClient();

  const handleEventCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["events"] });
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-muted/20">
      <AppSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Community Events
                </h1>
                <p className="text-muted-foreground text-sm">
                  Discover and create neighborhood events
                </p>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="btn-lift">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </DialogTrigger>
              <EventForm onSubmit={handleEventCreated} mode="create" />
            </Dialog>
          </div>

          <Card className="animate-scale-in">
            <div className="p-6">
              <EventList />
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}