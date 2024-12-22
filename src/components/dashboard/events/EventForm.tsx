import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { useForm } from "react-hook-form";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface EventFormProps {
  onSubmit: (values: any) => void;
  defaultValues?: any;
  mode?: 'create' | 'edit';
}

export function EventForm({ onSubmit, defaultValues = {}, mode = 'create' }: EventFormProps) {
  const form = useForm({
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

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{mode === 'create' ? 'Create New Event' : 'Edit Event'}</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Event title" {...field} />
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
                  <Input placeholder="Event description" {...field} />
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
                  <Input placeholder="Event location" {...field} />
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
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    existingUrl={field.value}
                    onImageUploaded={(url) => field.onChange(url)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {mode === 'create' ? 'Create Event' : 'Update Event'}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
}