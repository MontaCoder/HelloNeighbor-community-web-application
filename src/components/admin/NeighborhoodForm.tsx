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

type NeighborhoodFormData = {
  name: string;
  description: string;
};

export default function NeighborhoodForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [draw, setDraw] = useState<Draw | null>(null);
  const [boundaries, setBoundaries] = useState<number[][][] | null>(null);
  const vectorSourceRef = useRef<VectorSource>(new VectorSource());
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NeighborhoodFormData>();

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
        center: fromLonLat([-98, 39]), // Center on US
        zoom: 4
      })
    });

    const drawInteraction = new Draw({
      source: vectorSourceRef.current,
      type: 'Polygon'
    });

    drawInteraction.on('drawend', (event) => {
      // Clear previous drawings
      vectorSourceRef.current.clear();
      
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
        ]);

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

          <div className="h-[400px] w-full border rounded-md overflow-hidden">
            <div ref={mapRef} className="w-full h-full" />
          </div>
          <p className="text-sm text-muted-foreground">
            Draw the neighborhood boundaries on the map
          </p>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Neighborhood"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}