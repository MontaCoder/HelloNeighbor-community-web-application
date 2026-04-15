import { AppSidebar } from "@/components/layout/AppSidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useEffect, useState } from "react";
import { MessageSquare, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MessageItem } from "@/components/messages/MessageItem";
import { MessageInput } from "@/components/messages/MessageInput";
import { ActiveUsersSidebar } from "@/components/messages/ActiveUsersSidebar";
import { Card } from "@/components/ui/card";

export default function Messages() {
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const { data: messages, refetch } = useQuery({
    queryKey: ["public-messages", profile?.neighborhood_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          sender:profiles!messages_sender_id_fkey(
            full_name,
            avatar_url,
            username
          )
        `
        )
        .eq("neighborhood_id", profile?.neighborhood_id)
        .is("receiver_id", null)
        .order("created_at", { ascending: true })
        .limit(50);

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.neighborhood_id,
  });

  useEffect(() => {
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `neighborhood_id=eq.${profile?.neighborhood_id}`,
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch, profile?.neighborhood_id]);

  const handleSendMessage = async (content: string, imageUrl?: string) => {
    try {
      const { error } = await supabase.from("messages").insert({
        content,
        sender_id: user?.id,
        receiver_id: null,
        image_url: imageUrl,
        neighborhood_id: profile?.neighborhood_id,
      });

      if (error) throw error;
      await refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: "Please try again later.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-muted/20">
      <AppSidebar />
      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Card className="max-w-4xl mx-auto h-full flex flex-col animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">
                    Community Chat
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {messages?.length || 0} messages
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages?.map((message) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  currentUserId={user?.id}
                  onMessageUpdate={refetch}
                />
              ))}
            </div>

            <div className="p-6 border-t border-border/40">
              <MessageInput onSendMessage={handleSendMessage} />
            </div>
          </Card>
        </main>

        <div className="lg:w-72 border-t lg:border-t-0 lg:border-l border-border/40 bg-white">
          <ActiveUsersSidebar />
        </div>
      </div>
    </div>
  );
}