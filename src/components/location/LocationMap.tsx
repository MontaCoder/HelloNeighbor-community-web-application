import { useEffect, useRef, useState } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Circle, Fill, Stroke } from 'ol/style';
import 'ol/ol.css';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface LocationMapProps {
  events?: any[];
  alerts?: any[];
  items?: any[];
}

export function LocationMap({ events = [], alerts = [], items = [] }: LocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const vectorSource = useRef<VectorSource | null>(null);
  const { profile } = useAuth();
  const [mapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      // Create vector source for markers
      vectorSource.current = new VectorSource();

      // Create vector layer for markers
      const vectorLayer = new VectorLayer({
        source: vectorSource.current,
      });

      // Initialize map
      map.current = new Map({
        target: mapContainer.current,
        layers: [
          // OpenStreetMap layer
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayer,
        ],
        view: new View({
          center: fromLonLat([profile?.longitude || -98, profile?.latitude || 39]),
          zoom: profile?.latitude ? 12 : 3,
        }),
      });

      setMapLoaded(true);

      return () => {
        if (map.current) {
          map.current.dispose();
          map.current = null;
        }
        if (vectorSource.current) {
          vectorSource.current.clear();
          vectorSource.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: 'Map Error',
        description: 'There was an error initializing the map. Please try refreshing the page.',
        variant: 'destructive',
      });
    }
  }, []);

  // Add markers when map is loaded and data is available
  useEffect(() => {
    if (!mapLoaded || !map.current || !vectorSource.current) return;

    try {
      // Clear existing markers
      vectorSource.current.clear();

      // Style functions for different marker types
      const createMarkerStyle = (color: string) => {
        return new Style({
          image: new Circle({
            radius: 6,
            fill: new Fill({ color }),
            stroke: new Stroke({
              color: '#fff',
              width: 2,
            }),
          }),
        });
      };

      // Add event markers
      events.forEach(event => {
        if (event.latitude && event.longitude) {
          const feature = new Feature({
            geometry: new Point(fromLonLat([event.longitude, event.latitude])),
            name: event.title,
            description: event.description || '',
          });
          feature.setStyle(createMarkerStyle('#2F5233'));
          vectorSource.current?.addFeature(feature);
        }
      });

      // Add alert markers
      alerts.forEach(alert => {
        if (alert.latitude && alert.longitude) {
          const feature = new Feature({
            geometry: new Point(fromLonLat([alert.longitude, alert.latitude])),
            name: alert.title,
            description: alert.message || '',
          });
          feature.setStyle(createMarkerStyle('#DC2626'));
          vectorSource.current?.addFeature(feature);
        }
      });

      // Add marketplace item markers
      items.forEach(item => {
        if (item.latitude && item.longitude) {
          const feature = new Feature({
            geometry: new Point(fromLonLat([item.longitude, item.latitude])),
            name: item.title,
            description: `${item.description || ''}\n${item.price ? `$${item.price}` : 'Free'}`,
          });
          feature.setStyle(createMarkerStyle('#2563EB'));
          vectorSource.current?.addFeature(feature);
        }
      });

    } catch (error) {
      console.error('Error adding markers:', error);
      toast({
        title: 'Map Error',
        description: 'There was an error adding markers to the map.',
        variant: 'destructive',
      });
    }
  }, [mapLoaded, events, alerts, items]);

  return (
    <Card className="w-full h-[400px] overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </Card>
  );
}