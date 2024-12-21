import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export const useLocation = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const updateUserLocation = useCallback(async (latitude: number, longitude: number) => {
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

      return true;
    } catch (error) {
      console.error('Error updating location:', error);
      toast({
        title: "Error updating location",
        description: "Please try again later.",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, toast]);

  const detectLocation = useCallback(async () => {
    setLoading(true);

    if (!navigator.geolocation) {
      setLoading(false);
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support location detection.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      const success = await updateUserLocation(
        position.coords.latitude,
        position.coords.longitude
      );

      setLoading(false);
      return success;
    } catch (error) {
      console.error('Geolocation error:', error);
      let errorMessage = "Failed to detect location";
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location services.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
      }

      setLoading(false);
      toast({
        title: "Location detection failed",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  }, [toast, updateUserLocation]);

  return {
    loading,
    detectLocation,
    updateUserLocation
  };
};