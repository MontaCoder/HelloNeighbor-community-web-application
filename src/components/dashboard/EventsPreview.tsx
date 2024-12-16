import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EventsPreview() {
  const events = [
    {
      id: 1,
      title: "Community BBQ",
      date: "2024-03-15",
      time: "12:00 PM",
      location: "Central Park",
    },
    {
      id: 2,
      title: "Garden Club Meeting",
      date: "2024-03-17",
      time: "10:00 AM",
      location: "Community Center",
    },
  ];

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">Upcoming Events</CardTitle>
        <Calendar className="h-5 w-5 text-accent" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="rounded-lg bg-secondary/10 p-3">
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-600">
                {event.date} at {event.time}
              </p>
              <p className="text-sm text-gray-600">{event.location}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}