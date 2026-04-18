type NominatimAddress = {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state?: string;
  region?: string;
  province?: string;
  state_district?: string;
  country?: string;
};

type NominatimGeometry =
  | {
      type: "Polygon";
      coordinates: unknown;
    }
  | {
      type: "MultiPolygon";
      coordinates: unknown;
    };

type NominatimSearchResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: NominatimAddress;
  geojson?: NominatimGeometry;
};

export type BoundaryPolygonGeometry = {
  type: "Polygon";
  coordinates: number[][][];
};

export type BoundaryMultiPolygonGeometry = {
  type: "MultiPolygon";
  coordinates: number[][][][];
};

export type BoundaryGeometry = BoundaryPolygonGeometry | BoundaryMultiPolygonGeometry;

export type CityBoundarySuggestion = {
  id: string;
  placeId: number;
  city: string;
  region: string | null;
  country: string | null;
  label: string;
  displayName: string;
  latitude: number;
  longitude: number;
  geometry: BoundaryGeometry | null;
};

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search";
const MAX_RESULTS = 8;

const isCoordinatePair = (value: unknown): value is [number, number] => {
  if (!Array.isArray(value) || value.length < 2) {
    return false;
  }

  const [lon, lat] = value;
  return (
    typeof lon === "number" &&
    Number.isFinite(lon) &&
    typeof lat === "number" &&
    Number.isFinite(lat)
  );
};

const isPolygonCoordinates = (value: unknown): value is number[][][] => {
  if (!Array.isArray(value) || value.length === 0) {
    return false;
  }

  return value.every(
    (ring) =>
      Array.isArray(ring) &&
      ring.length >= 4 &&
      ring.every((point) => isCoordinatePair(point))
  );
};

const isMultiPolygonCoordinates = (value: unknown): value is number[][][][] => {
  if (!Array.isArray(value) || value.length === 0) {
    return false;
  }

  return value.every((polygon) => isPolygonCoordinates(polygon));
};

const parseGeometry = (geojson?: NominatimGeometry): BoundaryGeometry | null => {
  if (!geojson) {
    return null;
  }

  if (geojson.type === "Polygon" && isPolygonCoordinates(geojson.coordinates)) {
    return {
      type: "Polygon",
      coordinates: geojson.coordinates,
    };
  }

  if (
    geojson.type === "MultiPolygon" &&
    isMultiPolygonCoordinates(geojson.coordinates)
  ) {
    return {
      type: "MultiPolygon",
      coordinates: geojson.coordinates,
    };
  }

  return null;
};

const toLabelPart = (value?: string) => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const getCityLabel = (address: NominatimAddress | undefined, displayName: string) => {
  const fromAddress =
    toLabelPart(address?.city) ??
    toLabelPart(address?.town) ??
    toLabelPart(address?.village) ??
    toLabelPart(address?.municipality) ??
    toLabelPart(address?.county);

  if (fromAddress) {
    return fromAddress;
  }

  const firstSegment = displayName.split(",")[0];
  return toLabelPart(firstSegment) ?? "Unknown City";
};

const buildSuggestionLabel = (city: string, region: string | null, country: string | null) => {
  const unique = new Set<string>();
  [city, region, country].forEach((part) => {
    if (part) {
      unique.add(part);
    }
  });
  return [...unique].join(", ");
};

export const searchCityBoundaries = async (
  query: string,
  signal?: AbortSignal
): Promise<CityBoundarySuggestion[]> => {
  const trimmed = query.trim();
  if (trimmed.length < 3) {
    return [];
  }

  const params = new URLSearchParams({
    q: trimmed,
    format: "jsonv2",
    addressdetails: "1",
    polygon_geojson: "1",
    limit: String(MAX_RESULTS),
  });

  const response = await fetch(`${NOMINATIM_BASE_URL}?${params.toString()}`, {
    method: "GET",
    signal,
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`City boundary lookup failed with status ${response.status}`);
  }

  const payload = (await response.json()) as NominatimSearchResult[];
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.map((item) => {
    const city = getCityLabel(item.address, item.display_name);
    const region =
      toLabelPart(item.address?.state) ??
      toLabelPart(item.address?.region) ??
      toLabelPart(item.address?.province) ??
      toLabelPart(item.address?.state_district) ??
      toLabelPart(item.address?.county);
    const country = toLabelPart(item.address?.country);
    const label = buildSuggestionLabel(city, region, country);

    return {
      id: String(item.place_id),
      placeId: item.place_id,
      city,
      region,
      country,
      label,
      displayName: item.display_name,
      latitude: Number(item.lat),
      longitude: Number(item.lon),
      geometry: parseGeometry(item.geojson),
    };
  });
};
