import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MessageItemProps {
  message: any;
  currentUserId: string;
  onMessageUpdate: () => void;
}

export function MessageItem({ message, currentUserId, onMessageUpdate }: MessageItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      content: message.content
    }
  });

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", message.id);

      if (error) throw error;

      toast({
        title: "Message deleted",
        description: "Your message has been removed."
      });
      onMessageUpdate();
    } catch (error) {
      toast({
        title: "Error deleting message",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const onSubmit = async (values: any) => {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ content: values.content })
        .eq("id", message.id);

      if (error) throw error;

      toast({
        title: "Message updated",
        description: "Your message has been updated successfully."
      });
      setIsEditing(false);
      onMessageUpdate();
    } catch (error) {
      toast({
        title: "Error updating message",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className={`${message.sender_id === currentUserId ? 'ml-auto bg-primary/5' : ''} max-w-[80%]`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={message.sender.avatar_url || ''} />
            <AvatarFallback>
              {message.sender.full_name?.charAt(0) || 'N'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-sm">
                {message.sender.full_name || message.sender.username}
              </p>
              <span className="text-xs text-gray-500">
                {new Date(message.created_at).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-gray-600">{message.content}</p>
            {message.sender_id === currentUserId && (
              <div className="flex gap-2 mt-2 justify-end">
                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Message</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full">Update Message</Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}