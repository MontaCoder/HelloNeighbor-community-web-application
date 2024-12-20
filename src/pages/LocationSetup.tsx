import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MapPin, Navigation, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { LocationMap } from "@/components/location/LocationMap";

const popularCities = [
  { id: "tunis", name: "Tunis", lat: 36.8065, lon: 10.1815 },
  { id: "sfax", name: "Sfax", lat: 34.7398, lon: 10.7600 },
  { id: "sousse", name: "Sousse", lat: 35.8333, lon: 10.6333 },
  { id: "kairouan", name: "Kairouan", lat: 35.6781, lon: 10.0964 },
];

export default function LocationSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [manualLocation, setManualLocation] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
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
        description: "Your location has been set successfully."
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error('Error updating location:', error);
      toast({
        title: "Error updating location",
        description: "Please try again or select a city from the list.",
        variant: "destructive"
      });
    }
  };

  const detectLocation = () => {
    setIsLoading(true);
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Please select a city from the list or enter your location manually.",
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
          description: "Please enable location access or select a city from the list.",
          variant: "destructive"
        });
        setIsLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleCitySelect = (cityId: string) => {
    const city = popularCities.find(c => c.id === cityId);
    if (city) {
      updateUserLocation(city.lat, city.lon);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">Set Your Location</CardTitle>
          <CardDescription>
            Choose how you'd like to set your location to see relevant content in your area
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button 
            onClick={detectLocation} 
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2"
          >
            <Navigation className="h-4 w-4" />
            {isLoading ? "Detecting location..." : "Use Current Location"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or choose a city
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <Select onValueChange={handleCitySelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a popular city" />
              </SelectTrigger>
              <SelectContent>
                {popularCities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Separator className="my-4" />

            <div className="space-y-2">
              <Label htmlFor="manual-location">Enter location manually</Label>
              <div className="flex gap-2">
                <Input
                  id="manual-location"
                  placeholder="Enter city or address"
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                />
                <Button 
                  variant="secondary"
                  onClick={() => {
                    // Here you would typically implement geocoding
                    toast({
                      title: "Manual location",
                      description: "Geocoding service will be implemented soon.",
                    });
                  }}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-6">
              <LocationMap />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}