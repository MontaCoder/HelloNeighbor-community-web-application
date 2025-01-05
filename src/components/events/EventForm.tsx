import { useForm } from "react-hook-form";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EventFormProps {
  onSuccess: () => void;
}

export function EventForm({ onSuccess }: EventFormProps) {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      location: "",
      start_time: "",
      end_time: "",
      image_url: ""
    }
  });

  const onSubmit = async (values: any) => {
    try {
      // Validate timestamps
      if (!values.start_time || !values.end_time) {
        toast({
          title: "Error",
          description: "Start time and end time are required",
          variant: "destructive"
        });
        return;
      }

      // Ensure the timestamps are valid
      const startTime = new Date(values.start_time).toISOString();
      const endTime = new Date(values.end_time).toISOString();

      // Validate end time is after start time
      if (new Date(endTime) <= new Date(startTime)) {
        toast({
          title: "Error",
          description: "End time must be after start time",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from("events")
        .insert({
          title: values.title,
          description: values.description,
          location: values.location,
          start_time: startTime,
          end_time: endTime,
          image_url: values.image_url,
          created_by: user?.id,
          neighborhood_id: profile?.neighborhood_id
        });

      if (error) throw error;

      toast({
        title: "Event created",
        description: "Your event has been posted successfully."
      });

      form.reset();
      onSuccess();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "There was a problem creating your event.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Event</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              existingUrl={form.watch("image_url")}
              onImageUploaded={(url) => form.setValue("image_url", url)}
            />
          </div>

          <Button type="submit" className="w-full">
            Create Event
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}