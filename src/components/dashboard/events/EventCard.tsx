import { Calendar, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { EventForm } from "./EventForm";
import { useAuth } from "@/components/auth/AuthProvider";

interface EventCardProps {
  event: any;
  onDelete: (eventId: string) => void;
  onEdit: (eventId: string, values: any) => void;
}

export function EventCard({ event, onDelete, onEdit }: EventCardProps) {
  const { user } = useAuth();

  return (
    <div key={event.id} className="rounded-lg bg-secondary/10 p-3 space-y-3">
      <div className="flex flex-col md:flex-row justify-between items-start gap-2">
        <div className="space-y-1 flex-1">
          <h3 className="font-semibold text-sm md:text-base">{event.title}</h3>
          <p className="text-xs md:text-sm text-gray-600">
            {new Date(event.start_time).toLocaleDateString()} at{" "}
            {new Date(event.start_time).toLocaleTimeString()}
          </p>
          <p className="text-xs md:text-sm text-gray-600">{event.location}</p>
        </div>
        {user && event.created_by === user.id && (
          <div className="flex gap-2 w-full md:w-auto justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9">
                  <Pencil className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <EventForm
                mode="edit"
                defaultValues={event}
                onSubmit={(values) => onEdit(event.id, values)}
              />
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(event.id)}
              className="h-8 w-8 md:h-9 md:w-9"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      {event.image_url && (
        <img
          src={event.image_url}
          alt={event.title}
          className="mt-2 rounded-lg w-full h-32 md:h-48 object-cover"
        />
      )}
    </div>
  );
}