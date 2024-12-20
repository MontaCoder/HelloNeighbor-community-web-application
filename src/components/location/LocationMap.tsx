import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card } from '@/components/ui/card';

interface LocationMapProps {
  events?: any[];
  alerts?: any[];
  items?: any[];
}

export function LocationMap({ events = [], alerts = [], items = [] }: LocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { profile } = useAuth();
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHRwOWZjYnUwMXBqMmlvNjZ5ZWV2OTlwIn0.Fk7eIMGD9-ZL-N_3qnuVxg';
    
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

    return () => {
      map.current?.remove();
    };
  }, []);

  // Add markers when map is loaded and data is available
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Clear existing markers
    const markers = document.getElementsByClassName('mapboxgl-marker');
    while(markers[0]) {
      markers[0].remove();
    }

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
      }
    });
  }, [mapLoaded, events, alerts, items]);

  return (
    <Card className="w-full h-[400px] overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </Card>
  );
}