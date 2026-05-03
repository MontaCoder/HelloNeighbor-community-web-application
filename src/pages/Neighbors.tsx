import { AppSidebar } from "@/components/layout/AppSidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type NeighborProfile = Database["public"]["Tables"]["profiles"]["Row"];

export default function Neighbors() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [selectedNeighbor, setSelectedNeighbor] = useState<NeighborProfile | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const neighborhoodId = profile?.neighborhood_id;
  const userId = user?.id;

  const { data: neighbors, isLoading } = useQuery({
    queryKey: ["neighbors", neighborhoodId],
    queryFn: async () => {
      if (!neighborhoodId || !userId) return [];
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("neighborhood_id", neighborhoodId)
        .neq("id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!neighborhoodId && !!userId,
  });

  const { data: messages, refetch: refetchMessages } = useQuery({
    queryKey: ["private-messages", selectedNeighbor?.id],
    enabled: !!selectedNeighbor && !!userId,
    queryFn: async () => {
      if (!selectedNeighbor || !userId) return [];
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          sender:profiles!messages_sender_id_fkey(full_name, avatar_url),
          receiver:profiles!messages_receiver_id_fkey(full_name, avatar_url)
        `
        )
        .or(
          `and(sender_id.eq.${userId},receiver_id.eq.${selectedNeighbor.id}),and(sender_id.eq.${selectedNeighbor.id},receiver_id.eq.${userId})`
        )
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!selectedNeighbor || !neighborhoodId || !userId) return;

    const channel = supabase
      .channel(`private-messages-${neighborhoodId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `neighborhood_id=eq.${neighborhoodId}`,
        },
        (payload) => {
          const message = payload.new as Database["public"]["Tables"]["messages"]["Row"];
          const isCurrentConversation =
            (message.sender_id === userId && message.receiver_id === selectedNeighbor.id) ||
            (message.sender_id === selectedNeighbor.id && message.receiver_id === userId);

          if (isCurrentConversation) {
            refetchMessages();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [neighborhoodId, selectedNeighbor, userId, refetchMessages]);

  const handleSendPrivateMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim() || !selectedNeighbor || !userId || !neighborhoodId) return;

    try {
      const { error } = await supabase.from("messages").insert({
        content: messageContent.trim(),
        sender_id: userId,
        receiver_id: selectedNeighbor.id,
        neighborhood_id: neighborhoodId,
      });

      if (error) throw error;
      setMessageContent("");
      await refetchMessages();
      toast({
        title: "Message sent",
        description: `Message sent to ${selectedNeighbor.full_name || selectedNeighbor.username}`,
      });
    } catch {
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
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Your Neighbors
              </h1>
              <p className="text-muted-foreground text-sm">
                Connect with people in your community
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading neighbors...
            </div>
          ) : neighbors?.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No neighbors yet</h3>
              <p className="text-muted-foreground">
                As more people join your neighborhood, they will appear here.
              </p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {neighbors?.map((neighbor) => (
                <Card
                  key={neighbor.id}
                  className="group overflow-hidden hover:shadow-soft-md transition-all duration-300 hover:-translate-y-0.5"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-14 w-14 ring-4 ring-primary/10">
                        <AvatarImage src={neighbor.avatar_url || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                          {neighbor.full_name?.charAt(0) ||
                            neighbor.username?.charAt(0) ||
                            "N"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">
                          {neighbor.full_name || neighbor.username}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Neighbor
                        </p>
                      </div>
                    </div>
                    {user?.id !== neighbor.id && (
                      <Dialog
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full gap-2 btn-lift"
                            onClick={() => setSelectedNeighbor(neighbor)}
                          >
                            <MessageSquare className="h-4 w-4" />
                            Send Message
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>
                              Chat with{" "}
                              {neighbor.full_name || neighbor.username}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="flex flex-col space-y-4 max-h-[300px] overflow-y-auto p-4">
                            {messages?.map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${
                                  message.sender_id === user?.id
                                    ? "justify-end"
                                    : "justify-start"
                                }`}
                              >
                                <div
                                  className={`max-w-[80%] p-3 rounded-xl text-sm ${
                                    message.sender_id === user?.id
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted"
                                  }`}
                                >
                                  <p>{message.content}</p>
                                  <span
                                    className={`text-xs ${
                                      message.sender_id === user?.id
                                        ? "text-white/70"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    {new Date(
                                      message.created_at
                                    ).toLocaleTimeString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <form
                            onSubmit={handleSendPrivateMessage}
                            className="flex gap-2"
                          >
                            <Input
                              value={messageContent}
                              onChange={(e) =>
                                setMessageContent(e.target.value)
                              }
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
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
