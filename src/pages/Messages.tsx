import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";

export default function Messages() {
  const { user } = useAuth();

  const { data: messages, isLoading } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(full_name),
          receiver:profiles!messages_receiver_id_fkey(full_name)
        `)
        .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#FAF9F6]">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-primary mb-6">Messages</h1>

            <div className="space-y-4">
              {isLoading ? (
                <p>Loading messages...</p>
              ) : messages?.length === 0 ? (
                <p>No messages</p>
              ) : (
                messages?.map((message) => (
                  <Card key={message.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">
                            {message.sender_id === user?.id
                              ? `To: ${message.receiver.full_name}`
                              : `From: ${message.sender.full_name}`}
                          </p>
                          <p className="text-gray-600">{message.content}</p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(message.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}