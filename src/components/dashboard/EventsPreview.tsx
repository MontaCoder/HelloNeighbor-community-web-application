import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function EventsPreview() {
  const { data: events } = useQuery({
    queryKey: ["events-preview"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gte("start_time", new Date().toISOString())
        .order("start_time", { ascending: true })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">Upcoming Events</CardTitle>
        <Calendar className="h-5 w-5 text-accent" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events?.map((event) => (
            <div key={event.id} className="rounded-lg bg-secondary/10 p-3">
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-600">
                {new Date(event.start_time).toLocaleDateString()} at{" "}
                {new Date(event.start_time).toLocaleTimeString()}
              </p>
              <p className="text-sm text-gray-600">{event.location}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}