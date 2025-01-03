import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';

export const useLocation = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const findNeighborhood = async (latitude: number, longitude: number) => {
    try {
      console.log('Checking neighborhood for coordinates:', { latitude, longitude });
      
      const { data: neighborhood, error } = await supabase
        .rpc('find_neighborhood', { lat: latitude, lon: longitude });

      if (error) {
        console.error('Error in findNeighborhood:', error);
        throw error;
      }
      
      console.log('Found neighborhood:', neighborhood);
      return neighborhood;
    } catch (error) {
      console.error('Error finding neighborhood:', error);
      return null;
    }
  };

  const updateUserLocation = useCallback(async (latitude: number, longitude: number) => {
    try {
      console.log('Updating user location:', { latitude, longitude });
      
      // First find the neighborhood for this location
      const neighborhood_id = await findNeighborhood(latitude, longitude);
      console.log('Resolved neighborhood_id:', neighborhood_id);

      if (!neighborhood_id) {
        console.log('No neighborhood found for location');
        toast({
          title: "Location not in service area",
          description: "Sorry, we don't currently serve your area.",
          variant: "destructive"
        });
        return false;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ 
          latitude, 
          longitude,
          neighborhood_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      console.log('Successfully updated user location with neighborhood:', neighborhood_id);
      
      toast({
        title: "Location verified",
        description: "Welcome to your neighborhood!"
      });

      navigate('/dashboard');
      return true;
    } catch (error) {
      console.error('Error updating location:', error);
      toast({
        title: "Error verifying location",
        description: "Please try again later.",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, toast, navigate]);

  const detectLocation = useCallback(async () => {
    setLoading(true);
    console.log('Starting location detection...');

    if (!navigator.geolocation) {
      setLoading(false);
      console.error('Geolocation not supported by browser');
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support location detection.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      });

      console.log('Got position:', {
        lat: position.coords.latitude,
        lon: position.coords.longitude
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
            errorMessage = "Location access denied. Please enable location services in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable. Please try again.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please check your connection and try again.";
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