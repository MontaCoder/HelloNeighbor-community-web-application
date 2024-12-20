import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

// Set access token once for the entire application
mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHRwOWZjYnUwMXBqMmlvNjZ5ZWV2OTlwIn0.Fk7eIMGD9-ZL-N_3qnuVxg';

interface LocationMapProps {
  events?: any[];
  alerts?: any[];
  items?: any[];
}

export function LocationMap({ events = [], alerts = [], items = [] }: LocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const { profile } = useAuth();
  const [mapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [profile?.longitude || -98, profile?.latitude || 39],
        zoom: profile?.latitude ? 12 : 3
      });

      map.current.on('load', () => {
        setMapLoaded(true);
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Error handling for map
      map.current.on('error', (e) => {
        console.error('Map error:', e);
        toast({
          title: 'Map Error',
          description: 'There was an error loading the map. Please try refreshing the page.',
          variant: 'destructive'
        });
      });

      // Cleanup function
      return () => {
        // Clear all markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        
        // Remove map
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: 'Map Error',
        description: 'There was an error initializing the map. Please try refreshing the page.',
        variant: 'destructive'
      });
    }
  }, []);

  // Add markers when map is loaded and data is available
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    try {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Add event markers
      events.forEach(event => {
        if (event.latitude && event.longitude) {
          const marker = new mapboxgl.Marker({ color: '#2F5233' })
            .setLngLat([event.longitude, event.latitude])
            .setPopup(new mapboxgl.Popup().setHTML(`
              <h3 class="font-bold">${event.title}</h3>
              <p>${event.description || ''}</p>
            `))
            .addTo(map.current!);
          markersRef.current.push(marker);
        }
      });

      // Add alert markers
      alerts.forEach(alert => {
        if (alert.latitude && alert.longitude) {
          const marker = new mapboxgl.Marker({ color: '#DC2626' })
            .setLngLat([alert.longitude, alert.latitude])
            .setPopup(new mapboxgl.Popup().setHTML(`
              <h3 class="font-bold">${alert.title}</h3>
              <p>${alert.message || ''}</p>
            `))
            .addTo(map.current!);
          markersRef.current.push(marker);
        }
      });

      // Add marketplace item markers
      items.forEach(item => {
        if (item.latitude && item.longitude) {
          const marker = new mapboxgl.Marker({ color: '#2563EB' })
            .setLngLat([item.longitude, item.latitude])
            .setPopup(new mapboxgl.Popup().setHTML(`
              <h3 class="font-bold">${item.title}</h3>
              <p>${item.description || ''}</p>
              <p class="font-bold">${item.price ? `$${item.price}` : 'Free'}</p>
            `))
            .addTo(map.current!);
          markersRef.current.push(marker);
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
  }, [mapLoaded, events, alerts, items]);

  return (
    <Card className="w-full h-[400px] overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </Card>
  );
}