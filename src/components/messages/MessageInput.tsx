import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { ImagePlus, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MessageInputProps {
  onSendMessage: (content: string, imageUrl?: string) => Promise<void>;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !imageUrl) return;

    try {
      await onSendMessage(message, imageUrl);
      setMessage("");
      setImageUrl("");
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <div className="flex-1 space-y-2">
        {imageUrl && (
          <div className="relative w-32 h-32">
            <img 
              src={imageUrl} 
              alt="Upload preview" 
              className="w-full h-full object-cover rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1"
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
          className="flex-1"
        />
      </div>
      {!imageUrl && (
        <ImageUpload
          onImageUploaded={setImageUrl}
          existingUrl={imageUrl}
        >
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={isUploading}
          >
            <ImagePlus className="h-4 w-4" />
          </Button>
        </ImageUpload>
      )}
      <Button type="submit" disabled={(!message.trim() && !imageUrl) || isUploading}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}