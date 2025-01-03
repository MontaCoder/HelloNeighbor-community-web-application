import { useForm } from "react-hook-form";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AlertFormProps {
  onSuccess: () => void;
}

export function AlertForm({ onSuccess }: AlertFormProps) {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      title: "",
      message: "",
      type: "general",
      urgency: "low"
    }
  });

  const onSubmit = async (values: any) => {
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              {...form.register("message")}
              placeholder="Alert message"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                onValueChange={(value) => form.setValue("type", value)}
                defaultValue={form.getValues("type")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="weather">Weather</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency</Label>
              <Select
                onValueChange={(value) => form.setValue("urgency", value)}
                defaultValue={form.getValues("urgency")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
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