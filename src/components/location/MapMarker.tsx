import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Style, Circle, Fill, Stroke } from 'ol/style';
import { fromLonLat } from 'ol/proj';

interface MapMarkerProps {
  longitude: number;
  latitude: number;
  color: string;
  title: string;
  description?: string;
}

export function createMapMarker({
  longitude,
  latitude,
  color,
  title,
  description
}: MapMarkerProps): Feature {
  const feature = new Feature({
    geometry: new Point(fromLonLat([longitude, latitude])),
    name: title,
    description: description || ''
  });

  feature.setStyle(new Style({
    image: new Circle({
      radius: 6,
      fill: new Fill({ color }),
      stroke: new Stroke({
        color: '#fff',
        width: 2
      })
    })
  }));

  return feature;
}