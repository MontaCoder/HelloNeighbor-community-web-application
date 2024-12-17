import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/ui/use-toast";

export default function Neighbors() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedNeighbor, setSelectedNeighbor] = useState<any>(null);
  const [messageContent, setMessageContent] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: neighbors, isLoading } = useQuery({
    queryKey: ["neighbors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: messages, refetch: refetchMessages } = useQuery({
    queryKey: ["private-messages", selectedNeighbor?.id],
    enabled: !!selectedNeighbor,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(full_name, avatar_url),
          receiver:profiles!messages_receiver_id_fkey(full_name, avatar_url)
        `)
        .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${selectedNeighbor.id}),and(sender_id.eq.${selectedNeighbor.id},receiver_id.eq.${user?.id})`)
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!selectedNeighbor) return;

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(and(sender_id.eq.${user?.id},receiver_id.eq.${selectedNeighbor.id}),and(sender_id.eq.${selectedNeighbor.id},receiver_id.eq.${user?.id}))`
        },
        () => {
          refetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedNeighbor, user?.id, refetchMessages]);

  const handleSendPrivateMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim() || !selectedNeighbor) return;

    try {
      const { error } = await supabase
        .from("messages")
        .insert({
          content: messageContent.trim(),
          sender_id: user?.id,
          receiver_id: selectedNeighbor.id
        });

      if (error) throw error;
      setMessageContent("");
      await refetchMessages();
      toast({
        title: "Message sent",
        description: `Message sent to ${selectedNeighbor.full_name || selectedNeighbor.username}`,
      });
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
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-primary mb-6">Your Neighbors</h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <p>Loading neighbors...</p>
              ) : neighbors?.length === 0 ? (
                <p>No neighbors found</p>
              ) : (
                neighbors?.map((neighbor) => (
                  <Card key={neighbor.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={neighbor.avatar_url || ''} />
                          <AvatarFallback>
                            {neighbor.full_name?.charAt(0) || neighbor.username?.charAt(0) || 'N'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {neighbor.full_name || neighbor.username}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {neighbor.neighborhood || "Neighborhood not specified"}
                          </p>
                        </div>
                      </div>
                      {user?.id !== neighbor.id && (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => setSelectedNeighbor(neighbor)}
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Send Message
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Chat with {neighbor.full_name || neighbor.username}</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col space-y-4 max-h-[400px] overflow-y-auto p-4">
                              {messages?.map((message) => (
                                <div
                                  key={message.id}
                                  className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                                >
                                  <div className={`max-w-[80%] p-3 rounded-lg ${
                                    message.sender_id === user?.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                  }`}>
                                    <p className="text-sm">{message.content}</p>
                                    <span className="text-xs opacity-70">
                                      {new Date(message.created_at).toLocaleTimeString()}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <form onSubmit={handleSendPrivateMessage} className="flex gap-2">
                              <Input
                                value={messageContent}
                                onChange={(e) => setMessageContent(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1"
                              />
                              <Button type="submit">Send</Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      )}
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