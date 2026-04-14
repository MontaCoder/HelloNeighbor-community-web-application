import { useForm } from "react-hook-form";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const selectClassName =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

type AlertFormValues = {
  title: string;
  message: string;
  type: string;
  urgency: string;
};

interface AlertFormProps {
  onSuccess: () => void;
}

export function AlertForm({ onSuccess }: AlertFormProps) {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const form = useForm<AlertFormValues>({
    defaultValues: {
      title: "",
      message: "",
      type: "general",
      urgency: "low"
    }
  });

  const onSubmit = async (values: AlertFormValues) => {
    try {
      const { error } = await supabase
        .from("alerts")
        .insert({
          title: values.title,
          message: values.message,
          type: values.type,
          urgency: values.urgency,
          created_by: user?.id,
          neighborhood_id: profile?.neighborhood_id
        });

      if (error) throw error;

      toast({
        title: "Alert created",
        description: "Your alert has been posted successfully."
      });

      form.reset();
      onSuccess();
    } catch (error) {
      console.error('Error creating alert:', error);
      toast({
        title: "Error",
        description: "There was a problem creating your alert.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Alert</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...form.register("title")}
              placeholder="Alert title"
              aria-label="Alert title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              {...form.register("message")}
              placeholder="Alert message"
              aria-label="Alert message"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                {...form.register("type")}
                className={selectClassName}
              >
                <option value="general">General</option>
                <option value="emergency">Emergency</option>
                <option value="weather">Weather</option>
                <option value="safety">Safety</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency</Label>
              <select
                id="urgency"
                {...form.register("urgency")}
                className={selectClassName}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Create Alert
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
