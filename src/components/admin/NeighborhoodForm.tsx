import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import Draw from 'ol/interaction/Draw';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Polygon } from 'ol/geom';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

// Define the form data type
type NeighborhoodFormData = {
  name: string;
  description: string;
};

export default function NeighborhoodForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [drawingInstructions, setDrawingInstructions] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [draw, setDraw] = useState<Draw | null>(null);
  const [boundaries, setBoundaries] = useState<number[][][] | null>(null);
  const vectorSourceRef = useRef<VectorSource>(new VectorSource());
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NeighborhoodFormData>();

  // Initialize the map and drawing interaction
  useEffect(() => {
    if (!mapRef.current || map) return;

    const vectorLayer = new VectorLayer({
      source: vectorSourceRef.current
    });

    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer
      ],
      view: new View({
        center: fromLonLat([10.2819465, 36.7590275]), // Center on Tunisia
        zoom: 12
      })
    });

    const drawInteraction = new Draw({
      source: vectorSourceRef.current,
      type: 'Polygon'
    });

    drawInteraction.on('drawstart', () => {
      // Clear previous drawings
      vectorSourceRef.current.clear();
      setDrawingInstructions(false);
    });

    drawInteraction.on('drawend', (event) => {
      // Get the drawn polygon
      const polygon = event.feature.getGeometry() as Polygon;
      
      // Convert coordinates to lon/lat
      const coordinates = polygon.getCoordinates()[0].map(coord => 
        toLonLat(coord)
      );
      
      setBoundaries([coordinates]);
    });

    initialMap.addInteraction(drawInteraction);
    setMap(initialMap);
    setDraw(drawInteraction);

    return () => {
      if (initialMap) {
        initialMap.dispose();
      }
    };
  }, []);

  // Handle form submission
  const onSubmit = async (data: NeighborhoodFormData) => {
    if (!boundaries) {
      toast({
        title: "Error",
        description: "Please draw the neighborhood boundaries on the map",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('neighborhoods')
        .insert([
          {
            name: data.name,
            description: data.description,
            boundaries: {
              type: "Polygon",
              coordinates: boundaries
            }
          }
        ], { returning: 'minimal' }); // Use parameterized query

      if (error) throw error;

      toast({
        title: "Success",
        description: "Neighborhood created successfully"
      });

      // Reset form and map
      queryClient.invalidateQueries({ queryKey: ["neighborhoods"] });
      reset();
      vectorSourceRef.current.clear();
      setBoundaries(null);
      setDrawingInstructions(true);
      
    } catch (error) {
      console.error('Error creating neighborhood:', error);
      toast({
        title: "Error",
        description: "Could not create neighborhood. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Neighborhood</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              placeholder="Neighborhood name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Textarea
              placeholder="Description"
              {...register("description")}
            />
          </div>

          {drawingInstructions && (
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                Click on the map to start drawing the neighborhood boundaries. 
                Click to add points and double-click to complete the polygon.
              </AlertDescription>
            </Alert>
          )}

          <div className="h-[400px] w-full border rounded-md overflow-hidden">
            <div ref={mapRef} className="w-full h-full" />
          </div>
          
          {!boundaries && !drawingInstructions && (
            <p className="text-sm text-muted-foreground">
              Continue clicking to draw the neighborhood boundaries. Double-click to finish.
            </p>
          )}

          {boundaries && (
            <p className="text-sm text-muted-foreground">
              Boundaries drawn successfully. Click the map again to redraw if needed.
            </p>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Neighborhood"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
