import { Calendar, Pencil, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { EventForm } from "@/components/events/EventForm";
import { useAuth } from "@/components/auth/AuthProvider";
import { Badge } from "@/components/ui/badge";
import type { Database } from "@/integrations/supabase/types";
import type { EventFormValues } from "@/components/events/EventForm";

interface EventCardProps {
  event: Database["public"]["Tables"]["events"]["Row"];
  onDelete: (eventId: string) => void;
  onEdit: (eventId: string, values: EventFormValues) => void;
}

export function EventCard({ event, onDelete, onEdit }: EventCardProps) {
  const { user } = useAuth();

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="group rounded-xl bg-card border border-border/40 p-4 shadow-soft-sm hover:shadow-soft-md hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="soft-primary" className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              Event
            </Badge>
          </div>
          <h3 className="font-semibold text-foreground truncate mb-1">
            {event.title}
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {formatDate(event.start_time)} at {formatTime(event.start_time)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
        {user && event.created_by === user.id && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="h-8 w-8">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </DialogTrigger>
              <EventForm
                mode="edit"
                defaultValues={{
                  title: event.title,
                  description: event.description || "",
                  location: event.location || "",
                  start_time: event.start_time,
                  end_time: event.end_time,
                  image_url: event.image_url || "",
                }}
                onSubmit={(values) => onEdit(event.id, values)}
              />
            </Dialog>
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onDelete(event.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
      {event.image_url && (
        <img
          src={event.image_url}
          alt={event.title}
          className="mt-4 rounded-lg w-full h-32 object-cover"
        />
      )}
    </div>
  );
}
