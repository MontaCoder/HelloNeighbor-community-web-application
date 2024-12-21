import { useEffect, useRef, useState } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import { useToast } from '@/hooks/use-toast';

interface UseMapProps {
  latitude?: number | null;
  longitude?: number | null;
  targetRef: React.RefObject<HTMLDivElement>;
}

export function useMap({ latitude, longitude, targetRef }: UseMapProps) {
  const mapRef = useRef<Map | null>(null);
  const vectorSourceRef = useRef<VectorSource | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!targetRef.current || mapRef.current) return;

    try {
      // Create vector source for markers
      vectorSourceRef.current = new VectorSource();

      // Create vector layer for markers
      const vectorLayer = new VectorLayer({
        source: vectorSourceRef.current
      });

      // Initialize map
      mapRef.current = new Map({
        target: targetRef.current,
        layers: [
          new TileLayer({
            source: new OSM()
          }),
          vectorLayer
        ],
        view: new View({
          center: fromLonLat([longitude || -98, latitude || 39]),
          zoom: latitude && longitude ? 12 : 3
        })
      });

      setMapLoaded(true);
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: 'Map Error',
        description: 'There was an error initializing the map. Please try refreshing the page.',
        variant: 'destructive'
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.dispose();
        mapRef.current = null;
      }
      if (vectorSourceRef.current) {
        vectorSourceRef.current.clear();
        vectorSourceRef.current = null;
      }
    };
  }, [targetRef, latitude, longitude, toast]);

  return {
    map: mapRef.current,
    vectorSource: vectorSourceRef.current,
    mapLoaded
  };
}