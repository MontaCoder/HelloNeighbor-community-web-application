import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from '@/hooks/useLocation';
import { useToast } from '@/hooks/use-toast';

export function LocationDetector() {
  const { loading, detectLocation } = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const initLocation = async () => {
      try {
        await detectLocation();
      } catch (error) {
        console.error('Error detecting location:', error);
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
      {loading ? "Detecting location..." : "Update Current Location"}
    </Button>
  );
}