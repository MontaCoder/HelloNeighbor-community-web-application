import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { ImagePlus, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MessageInputProps {
  onSendMessage: (content: string, imageUrl?: string) => Promise<boolean>;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !imageUrl) return;

    try {
      const sent = await onSendMessage(message, imageUrl);
      if (sent) {
        setMessage("");
        setImageUrl("");
      }
    } catch {
      toast({
        title: "Error sending message",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
      <div className="flex-1 space-y-2">
        {imageUrl && (
          <div className="relative w-24 h-24 rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt="Upload preview"
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute top-1 right-1 h-6 w-6 bg-background/80 hover:bg-background"
              onClick={() => setImageUrl("")}
            >
              ×
            </Button>
          </div>
        )}
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-muted/50"
        />
      </div>
      {!imageUrl && (
        <ImageUpload onImageUploaded={setImageUrl} existingUrl={imageUrl}>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="flex-shrink-0"
          >
            <ImagePlus className="h-4 w-4" />
          </Button>
        </ImageUpload>
      )}
      <Button
        type="submit"
        size="icon"
        disabled={!message.trim() && !imageUrl}
        className="flex-shrink-0 btn-lift"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
