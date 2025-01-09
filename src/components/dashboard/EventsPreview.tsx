import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventCard } from "./events/EventCard";
import { useEvents } from "./events/useEvents";
import { Skeleton } from "@/components/ui/skeleton";

export function EventsPreview() {
  const { events, isLoading, handleDelete, handleEdit, handleCreate } = useEvents();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.length === 0 ? (
          <p className="text-center text-muted-foreground">No upcoming events</p>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}