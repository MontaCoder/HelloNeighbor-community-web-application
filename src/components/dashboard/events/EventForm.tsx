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
    <DialogContent className="sm:max-w-[425px] md:max-w-[600px] h-[90vh] md:h-auto overflow-y-auto">
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
                  <Input placeholder="Event title" {...field} className="text-sm md:text-base" />
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
                  <Input placeholder="Event description" {...field} className="text-sm md:text-base" />
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
                  <Input placeholder="Event location" {...field} className="text-sm md:text-base" />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} className="text-sm md:text-base" />
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
                    <Input type="datetime-local" {...field} className="text-sm md:text-base" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
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