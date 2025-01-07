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
    <div key={event.id} className="rounded-lg bg-secondary/10 p-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{event.title}</h3>
          <p className="text-sm text-gray-600">
            {new Date(event.start_time).toLocaleDateString()} at{" "}
            {new Date(event.start_time).toLocaleTimeString()}
          </p>
          <p className="text-sm text-gray-600">{event.location}</p>
        </div>
        {user && event.created_by === user.id && (
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
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
          className="mt-3 rounded-lg w-full h-48 object-cover"
        />
      )}
    </div>
  );
}