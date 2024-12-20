import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventCard } from "./events/EventCard";
import { useEvents } from "./events/useEvents";

export function EventsPreview() {
  const { events, handleDelete, handleEdit } = useEvents();

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">Upcoming Events</CardTitle>
        <Calendar className="h-5 w-5 text-accent" />
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
  );
}