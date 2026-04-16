import { useRef, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card } from "@/components/ui/card";
import { useMap } from "@/hooks/useMap";
import { createMapMarker } from "./MapMarker";
import { useToast } from "@/hooks/use-toast";

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
    targetRef: mapContainer,
  });

  useEffect(() => {
    if (!mapLoaded || !vectorSource) return;

    try {
      vectorSource.clear();

      events.forEach((event) => {
        if (event.latitude && event.longitude) {
          vectorSource.addFeature(
            createMapMarker({
              longitude: event.longitude,
              latitude: event.latitude,
              color: "#2F5233",
              title: event.title,
              description: event.description,
            })
          );
        }
      });

      alerts.forEach((alert) => {
        if (alert.latitude && alert.longitude) {
          vectorSource.addFeature(
            createMapMarker({
              longitude: alert.longitude,
              latitude: alert.latitude,
              color: "#DC2626",
              title: alert.title,
              description: alert.message,
            })
          );
        }
      });

      items.forEach((item) => {
        if (item.latitude && item.longitude) {
          vectorSource.addFeature(
            createMapMarker({
              longitude: item.longitude,
              latitude: item.latitude,
              color: "#2563EB",
              title: item.title,
              description: `${item.description || ""}\n${
                item.price ? `$${item.price}` : "Free"
              }`,
            })
          );
        }
      });
    } catch (error) {
      console.error("Error adding markers:", error);
      toast({
        title: "Map Error",
        description: "There was an error adding markers to the map.",
        variant: "destructive",
      });
    }
  }, [mapLoaded, events, alerts, items, vectorSource, toast]);

  return (
    <div className="relative">
      <Card className="w-full h-[400px] overflow-hidden rounded-xl border border-border/40 shadow-soft-sm">
        <div ref={mapContainer} className="w-full h-full" />
      </Card>
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-soft-sm border border-border/40">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#2F5233]" />
            <span>Events</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#DC2626]" />
            <span>Alerts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#2563EB]" />
            <span>Marketplace</span>
          </div>
        </div>
      </div>
    </div>
  );
}
