import { Calendar, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useAuth } from "@/components/auth/AuthProvider";

interface EventCardProps {
  event: any;
  onDelete: (eventId: string) => void;
  onEdit: (eventId: string, values: any) => void;
}

export function EventCard({ event, onDelete, onEdit }: EventCardProps) {
  const { user } = useAuth();
  const form = useForm({
    defaultValues: {
      title: event.title,
      description: event.description || "",
      location: event.location || "",
      start_time: new Date(event.start_time).toISOString().slice(0, 16),
      end_time: event.end_time ? new Date(event.end_time).toISOString().slice(0, 16) : ""
    }
  });

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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    form.reset({
                      title: event.title,
                      description: event.description || "",
                      location: event.location || "",
                      start_time: new Date(event.start_time).toISOString().slice(0, 16),
                      end_time: event.end_time ? new Date(event.end_time).toISOString().slice(0, 16) : ""
                    });
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Event</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((values) => onEdit(event.id, values))} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="start_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="end_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">Update Event</Button>
                  </form>
                </Form>
              </DialogContent>
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
    </div>
  );
}