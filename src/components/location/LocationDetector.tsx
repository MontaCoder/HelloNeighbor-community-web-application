import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export function LocationDetector() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const updateUserLocation = async (latitude: number, longitude: number) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ latitude, longitude })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Location updated",
        description: "Your location has been updated successfully."
      });
    } catch (error) {
      console.error('Error updating location:', error);
      toast({
        title: "Error updating location",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const detectLocation = () => {
    setIsLoading(true);
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support location detection.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateUserLocation(position.coords.latitude, position.coords.longitude);
        setIsLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast({
          title: "Location detection failed",
          description: "Please enable location access or try again later.",
          variant: "destructive"
        });
        setIsLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    // Attempt to detect location on component mount
    detectLocation();
  }, []);

  return (
    <Button 
      onClick={detectLocation} 
      disabled={isLoading}
      variant="outline"
      className="w-full"
    >
      {isLoading ? "Detecting location..." : "Update Current Location"}
    </Button>
  );
}