import { useRef, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card } from '@/components/ui/card';
import { useMap } from '@/hooks/useMap';
import { createMapMarker } from './MapMarker';
import { useToast } from '@/hooks/use-toast';

interface LocationMapProps {
  events?: any[];
  alerts?: any[];
  items?: any[];
}

export function LocationMap({ events = [], alerts = [], items = [] }: LocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { profile } = useAuth();
  const { toast } = useToast();
  
  const { vectorSource, mapLoaded } = useMap({
    latitude: profile?.latitude,
    longitude: profile?.longitude,
    targetRef: mapContainer
  });

  // Add markers when map is loaded and data is available
  useEffect(() => {
    if (!mapLoaded || !vectorSource) return;

    try {
      // Clear existing markers
      vectorSource.clear();

      // Add event markers
      events.forEach(event => {
        if (event.latitude && event.longitude) {
          vectorSource.addFeature(createMapMarker({
            longitude: event.longitude,
            latitude: event.latitude,
            color: '#2F5233',
            title: event.title,
            description: event.description
          }));
        }
      });

      // Add alert markers
      alerts.forEach(alert => {
        if (alert.latitude && alert.longitude) {
          vectorSource.addFeature(createMapMarker({
            longitude: alert.longitude,
            latitude: alert.latitude,
            color: '#DC2626',
            title: alert.title,
            description: alert.message
          }));
        }
      });

      // Add marketplace item markers
      items.forEach(item => {
        if (item.latitude && item.longitude) {
          vectorSource.addFeature(createMapMarker({
            longitude: item.longitude,
            latitude: item.latitude,
            color: '#2563EB',
            title: item.title,
            description: `${item.description || ''}\n${item.price ? `$${item.price}` : 'Free'}`
          }));
        }
      });

    } catch (error) {
      console.error('Error adding markers:', error);
      toast({
        title: 'Map Error',
        description: 'There was an error adding markers to the map.',
        variant: 'destructive'
      });
    }
  }, [mapLoaded, events, alerts, items, vectorSource, toast]);

  return (
    <Card className="w-full h-[400px] overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </Card>
  );
}