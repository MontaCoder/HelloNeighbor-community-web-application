import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import type { Database } from "@/integrations/supabase/types";

const selectClassName =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

type AlertRow = Database["public"]["Tables"]["alerts"]["Row"];

type AlertFormValues = {
  title: string;
  message: string;
  type: string;
  urgency: string;
};

interface AlertCardProps {
  alert: AlertRow;
  onDelete: (alertId: string) => void;
  onEdit: (alertId: string, values: AlertFormValues) => void;
}

export function AlertCard({ alert, onDelete, onEdit }: AlertCardProps) {
  const { user } = useAuth();
  const form = useForm<AlertFormValues>({
    defaultValues: {
      title: alert.title,
      message: alert.message,
      type: alert.type,
      urgency: alert.urgency
    }
  });

  return (
    <div
      className={`rounded-lg p-3 ${
        alert.urgency === "high"
          ? "bg-red-100"
          : alert.urgency === "medium"
          ? "bg-yellow-100"
          : "bg-blue-100"
      }`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base truncate">{alert.title}</h3>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{alert.message}</p>
        </div>
        {user && alert.created_by === user.id && (
          <div className="flex gap-1 sm:gap-2 flex-shrink-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-gray-200"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Alert</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((values) => onEdit(alert.id, values))} className="space-y-4">
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
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <select {...field} className={selectClassName}>
                            <option value="general">General</option>
                            <option value="safety">Safety</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="event">Event</option>
                          </select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="urgency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Urgency</FormLabel>
                          <select {...field} className={selectClassName}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">Update Alert</Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gray-200"
              onClick={() => onDelete(alert.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
