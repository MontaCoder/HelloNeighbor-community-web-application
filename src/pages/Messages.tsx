import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MessageItem } from "@/components/messages/MessageItem";
import { MessageInput } from "@/components/messages/MessageInput";
import { ActiveUsersSidebar } from "@/components/messages/ActiveUsersSidebar";

export default function Messages() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: messages, refetch } = useQuery({
    queryKey: ["public-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(
            full_name,
            avatar_url,
            username
          )
        `)
        .is('receiver_id', null)
        .order("created_at", { ascending: true })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: 'receiver_id=null'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const handleSendMessage = async (content: string, imageUrl?: string) => {
    try {
      const { error } = await supabase
        .from("messages")
        .insert({
          content,
          sender_id: user?.id,
          receiver_id: null,
          image_url: imageUrl
        });

      if (error) throw error;
      await refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: "Please try again later."
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#FAF9F6]">
        <AppSidebar />
        <main className="flex-1 flex">
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-primary">Community Chat</h1>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    {messages?.length || 0} messages
                  </span>
                </div>
              </div>

              <div className="flex flex-col space-y-4 mb-6 h-[calc(100vh-250px)] overflow-y-auto">
                {messages?.map((message) => (
                  <MessageItem
                    key={message.id}
                    message={message}
                    currentUserId={user?.id}
                    onMessageUpdate={refetch}
                  />
                ))}
              </div>

              <MessageInput onSendMessage={handleSendMessage} />
            </div>
          </div>
          <ActiveUsersSidebar />
        </main>
      </div>
    </SidebarProvider>
  );
}