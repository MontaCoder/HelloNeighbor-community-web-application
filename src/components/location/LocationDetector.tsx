import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from '@/hooks/useLocation';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function LocationDetector() {
  const { loading, detectLocation } = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const initLocation = async () => {
      try {
        console.log("LocationDetector: Initializing location detection");
        await detectLocation();
      } catch (error) {
        console.error('LocationDetector: Error detecting location:', error);
        toast({
          title: 'Location Error',
          description: 'Could not automatically detect your location. Please try manually.',
          variant: 'destructive'
        });
      }
    };

    initLocation();
  }, [detectLocation, toast]);

  return (
    <Button 
      onClick={() => detectLocation()} 
      disabled={loading}
      variant="outline"
      className="w-full"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Detecting location...
        </>
      ) : (
        "Update Current Location"
      )}
    </Button>
  );
}