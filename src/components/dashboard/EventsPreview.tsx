import { Calendar, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventCard } from "./events/EventCard";
import { useEvents } from "./events/useEvents";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { EventForm } from "./events/EventForm";
import { useNavigate } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";

export function EventsPreview() {
  const { events, isLoading, handleDelete, handleEdit, handleCreate } = useEvents();
  const navigate = useNavigate();

  return (
    <Card className="animate-scale-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-accent" />
            </div>
            Upcoming Events
          </CardTitle>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 btn-lift">
                  <Plus className="h-3.5 w-3.5" />
                  Create
                </Button>
              </DialogTrigger>
              <EventForm mode="create" onSubmit={handleCreate} />
            </Dialog>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/events")}
              className="text-muted-foreground"
            >
              View All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            Array(2)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))
          ) : events?.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">No upcoming events</p>
            </div>
          ) : (
            events?.slice(0, 3).map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
