import { Pencil, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import type { Database } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";

const selectClassName =
  "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

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

const urgencyStyles = {
  high: {
    bg: "bg-destructive/5 border-destructive/20",
    badge: "bg-destructive/10 text-destructive",
    icon: AlertTriangle,
  },
  medium: {
    bg: "bg-amber-500/5 border-amber-500/20",
    badge: "bg-amber-500/10 text-amber-600",
    icon: AlertTriangle,
  },
  low: {
    bg: "bg-blue-500/5 border-blue-500/20",
    badge: "bg-blue-500/10 text-blue-600",
    icon: AlertTriangle,
  },
};

const typeLabels: Record<string, string> = {
  general: "General",
  safety: "Safety",
  maintenance: "Maintenance",
  event: "Event",
};

export function AlertCard({ alert, onDelete, onEdit }: AlertCardProps) {
  const { user } = useAuth();
  const form = useForm<AlertFormValues>({
    defaultValues: {
      title: alert.title,
      message: alert.message,
      type: alert.type,
      urgency: alert.urgency,
    },
  });

  const style = urgencyStyles[alert.urgency as keyof typeof urgencyStyles] || urgencyStyles.low;

  return (
    <div
      className={`group rounded-xl p-4 border ${style.bg} transition-all duration-300 hover:shadow-soft-sm`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs">
              {typeLabels[alert.type] || alert.type}
            </Badge>
            <Badge className={`${style.badge} text-xs`}>{alert.urgency}</Badge>
          </div>
          <h3 className="font-semibold text-foreground text-sm sm:text-base truncate mb-1">
            {alert.title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
            {alert.message}
          </p>
        </div>
        {user && alert.created_by === user.id && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-8 w-8 hover:bg-background"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Alert</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit((values) => onEdit(alert.id, values))}
                    className="space-y-4"
                  >
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
                    <Button type="submit" className="w-full">
                      Update Alert
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onDelete(alert.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}