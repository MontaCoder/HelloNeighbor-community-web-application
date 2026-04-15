import { Button } from "@/components/ui/button";
import { useLocation } from "@/hooks/useLocation";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MapPin } from "lucide-react";

export function LocationDetector() {
  const { loading, detectLocation } = useLocation();
  const { toast } = useToast();

  const handleDetectLocation = async () => {
    try {
      await detectLocation();
    } catch (error) {
      console.error("LocationDetector: Error detecting location:", error);
      toast({
        title: "Location Error",
        description: "Could not automatically detect your location. Please try manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={() => handleDetectLocation()}
      disabled={loading}
      variant="outline"
      size="sm"
      className="gap-2 btn-lift"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Detecting...
        </>
      ) : (
        <>
          <MapPin className="h-4 w-4" />
          Update Location
        </>
      )}
    </Button>
  );
}