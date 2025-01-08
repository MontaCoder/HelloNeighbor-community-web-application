import { Calendar, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventCard } from "./events/EventCard";
import { useEvents } from "./events/useEvents";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { EventForm } from "./events/EventForm";
import { useNavigate } from "react-router-dom";

export function EventsPreview() {
  const { events, handleDelete, handleEdit, handleCreate } = useEvents();
  const navigate = useNavigate();

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">Upcoming Events</CardTitle>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-accent" />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Create
              </Button>
            </DialogTrigger>
            <EventForm mode="create" onSubmit={handleCreate} />
          </Dialog>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/events')}
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events?.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No upcoming events
            </p>
          )}
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
  );
}