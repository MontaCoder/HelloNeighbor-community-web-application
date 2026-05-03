import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export type EventFormValues = {
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
  image_url: string;
};

interface EventFormProps {
  onSubmit: (values: EventFormValues) => Promise<void> | void;
  defaultValues?: Partial<EventFormValues>;
  mode?: 'create' | 'edit';
}

export function EventForm({ onSubmit, defaultValues = {}, mode = 'create' }: EventFormProps) {
  const { toast } = useToast();
  const form = useForm<EventFormValues>({
    defaultValues: {
      title: "",
      description: "",
      location: "",
      start_time: "",
      end_time: "",
      image_url: "",
      ...defaultValues
    }
  });
  const imageUrl = useWatch({ control: form.control, name: "image_url" });

  const handleSubmit = async (values: EventFormValues) => {
    try {
      if (!values.start_time || !values.end_time) {
        toast({
          title: "Error",
          description: "Start time and end time are required",
          variant: "destructive"
        });
        return;
      }

      const startTime = new Date(values.start_time).toISOString();
      const endTime = new Date(values.end_time).toISOString();

      if (new Date(endTime) <= new Date(startTime)) {
        toast({
          title: "Error",
          description: "End time must be after start time",
          variant: "destructive"
        });
        return;
      }

      await onSubmit({
        ...values,
        start_time: startTime,
        end_time: endTime,
      });

      form.reset();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: `There was a problem ${mode === "create" ? "creating" : "updating"} your event.`,
        variant: "destructive"
      });
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{mode === 'create' ? 'Create New Event' : 'Edit Event'}</DialogTitle>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            {...form.register("title")}
            placeholder="Event title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...form.register("description")}
            placeholder="Event description"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            {...form.register("location")}
            placeholder="Event location"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start_time">Start Time</Label>
            <Input
              id="start_time"
              type="datetime-local"
              {...form.register("start_time")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end_time">End Time</Label>
            <Input
              id="end_time"
              type="datetime-local"
              {...form.register("end_time")}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Event Image</Label>
          <ImageUpload
            existingUrl={imageUrl}
            onImageUploaded={(url) => form.setValue("image_url", url)}
          />
        </div>

        <Button type="submit" className="w-full">
          {mode === 'create' ? 'Create Event' : 'Update Event'}
        </Button>
      </form>
    </DialogContent>
  );
}
