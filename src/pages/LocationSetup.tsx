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
import { useQuery } from "@tanstack/react-query";

export default function LocationSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("");
  const [manualLocation, setManualLocation] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if user is admin
  const { data: isAdmin } = useQuery({
    queryKey: ["is-admin", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('is_admin', { user_id: user?.id });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Fetch neighborhoods
  const { data: neighborhoods } = useQuery({
    queryKey: ["neighborhoods"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('neighborhoods')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  // If user is admin, skip location setup
  if (isAdmin) {
    navigate("/admin");
    return null;
  }

  const updateUserLocation = async (neighborhoodId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          neighborhood_id: neighborhoodId,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Location updated",
        description: "Your neighborhood has been set successfully."
      });

      navigate("/dashboard");
    } catch (error) {
      console.error('Error updating location:', error);
      toast({
        title: "Error updating location",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleNeighborhoodSelect = (neighborhoodId: string) => {
    setSelectedNeighborhood(neighborhoodId);
    updateUserLocation(neighborhoodId);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">Set Your Location</CardTitle>
          <CardDescription>
            Choose your neighborhood to see relevant content in your area
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Select onValueChange={handleNeighborhoodSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select your neighborhood" />
              </SelectTrigger>
              <SelectContent>
                {neighborhoods?.map((neighborhood) => (
                  <SelectItem key={neighborhood.id} value={neighborhood.id}>
                    {neighborhood.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="mt-6">
              <LocationMap />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}