import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { LocationMap } from "@/components/location/LocationMap";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLocation } from "@/hooks/useLocation";
import { Button } from "@/components/ui/button";
import { LocationDetector } from "@/components/location/LocationDetector";

export default function LocationSetup() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { detectLocation, loading: locationLoading } = useLocation();
  const [noAccess, setNoAccess] = useState(false);

  // Check if user is admin
  const { data: isAdmin, isLoading: isAdminLoading, isError: isAdminError } = useQuery({
    queryKey: ["is-admin", user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      const { data, error } = await supabase
        .rpc('is_admin', { user_id: user?.id });
      
      if (error) {
        console.error("Error checking admin status:", error);
        throw error;
      }
      return data;
    },
    enabled: !!user
  });

  // Redirect admin users to admin panel
  useEffect(() => {
    if (isAdmin === true) {
      navigate("/admin");
    }
  }, [isAdmin, navigate]);

  // Auto-detect location on component mount
  useEffect(() => {
    const checkLocation = async () => {
      try {
        const success = await detectLocation();
        if (!success) {
          setNoAccess(true);
        }
      } catch (error) {
        console.error('Error detecting location:', error);
        setNoAccess(true);
        toast({
          title: "Error",
          description: "Failed to detect location. Please try again.",
          variant: "destructive",
        });
      }
    };

    if (isAdminLoading || isAdminError) {
      return;
    }

    if (isAdmin === false && user) {
      checkLocation();
    }
  }, [detectLocation, isAdmin, isAdminError, isAdminLoading, user, toast]);

  const handleRetryLocation = async () => {
    setNoAccess(false);
    const success = await detectLocation();
    if (!success) {
      setNoAccess(true);
    }
  };

  // Show loading state while checking admin status
  if (isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAdminError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                There was an error checking admin permissions. Please try again later.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAdmin) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl text-primary">
            <MapPin className="h-6 w-6" />
            Location Verification
          </CardTitle>
          <CardDescription>
            We need to verify your location to provide neighborhood access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {noAccess ? (
            <>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>
                  Sorry, we couldn't verify your location within any of our registered neighborhoods. 
                  This app is currently only available to residents within specific neighborhoods.
                </AlertDescription>
              </Alert>
              <Button 
                onClick={handleRetryLocation}
                className="w-full"
                disabled={locationLoading}
              >
                {locationLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  'Retry Location Detection'
                )}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                {locationLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p>Detecting your location...</p>
                  </div>
                ) : (
                  <p>Please wait while we verify your location...</p>
                )}
              </div>
              <LocationDetector />
              <div className="mt-6">
                <LocationMap />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
