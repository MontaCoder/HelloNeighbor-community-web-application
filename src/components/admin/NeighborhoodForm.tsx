import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";
import Map from "ol/Map";
import View from "ol/View";
import Feature from "ol/Feature";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import Draw from "ol/interaction/Draw";
import Modify from "ol/interaction/Modify";
import Snap from "ol/interaction/Snap";
import Geometry from "ol/geom/Geometry";
import GeoJSON from "ol/format/GeoJSON";
import { fromLonLat } from "ol/proj";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, Loader2 } from "lucide-react";
import {
  type BoundaryGeometry,
  type CityBoundarySuggestion,
  searchCityBoundaries,
} from "@/lib/cityBoundarySearch";
import type { Json } from "@/integrations/supabase/types";

type NeighborhoodFormData = {
  name: string;
  description: string;
};

const DEFAULT_CENTER: [number, number] = [0, 20];
const DEFAULT_ZOOM = 2;

const getBoundaryFromFeature = (
  feature: Feature<Geometry>,
  format: GeoJSON
): BoundaryGeometry | null => {
  const geometry = feature.getGeometry();
  if (!geometry) {
    return null;
  }

  const geometryObject = format.writeGeometryObject(geometry, {
    featureProjection: "EPSG:3857",
    dataProjection: "EPSG:4326",
  }) as { type?: string; coordinates?: unknown };

  if (geometryObject.type === "Polygon") {
    return {
      type: "Polygon",
      coordinates: geometryObject.coordinates as number[][][],
    };
  }

  if (geometryObject.type === "MultiPolygon") {
    return {
      type: "MultiPolygon",
      coordinates: geometryObject.coordinates as number[][][][],
    };
  }

  return null;
};

const getSearchErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message.includes("429")) {
    return "City search is temporarily rate-limited. Please wait and try again.";
  }

  return "Could not search for city boundaries right now. Please try again.";
};

export default function NeighborhoodForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapState, setMapState] = useState<"idle" | "drawing" | "ready">("idle");
  const [cityQuery, setCityQuery] = useState("");
  const [debouncedCityQuery, setDebouncedCityQuery] = useState("");
  const [isSearchingCities, setIsSearchingCities] = useState(false);
  const [citySearchError, setCitySearchError] = useState<string | null>(null);
  const [citySelectionNotice, setCitySelectionNotice] = useState<string | null>(null);
  const [citySuggestions, setCitySuggestions] = useState<CityBoundarySuggestion[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityBoundarySuggestion | null>(null);
  const [boundaryGeometry, setBoundaryGeometry] = useState<BoundaryGeometry | null>(null);

  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const geoJsonFormatRef = useRef(new GeoJSON());
  const vectorSourceRef = useRef<VectorSource<Feature<Geometry>>>(
    new VectorSource<Feature<Geometry>>()
  );

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<NeighborhoodFormData>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const syncBoundaryFromSource = useCallback(() => {
    const [firstFeature] = vectorSourceRef.current.getFeatures();

    if (!firstFeature) {
      setBoundaryGeometry(null);
      setMapState("idle");
      return;
    }

    const parsedGeometry = getBoundaryFromFeature(firstFeature, geoJsonFormatRef.current);
    setBoundaryGeometry(parsedGeometry);
    setMapState(parsedGeometry ? "ready" : "idle");
  }, []);

  const clearBoundary = useCallback((clearSelectedCity = false) => {
    vectorSourceRef.current.clear();
    setBoundaryGeometry(null);
    setMapState("idle");
    setCitySelectionNotice(null);

    if (clearSelectedCity) {
      setSelectedCity(null);
    }
  }, []);

  const resetMapView = useCallback(() => {
    if (!mapRef.current) {
      return;
    }

    mapRef.current.getView().animate({
      center: fromLonLat(DEFAULT_CENTER),
      zoom: DEFAULT_ZOOM,
      duration: 350,
    });
  }, []);

  const applyCityBoundary = useCallback(
    (city: CityBoundarySuggestion) => {
      if (!mapRef.current) {
        return;
      }

      setSelectedCity(city);
      setCityQuery(city.label);
      setDebouncedCityQuery(city.label);
      setCitySuggestions([]);
      setCitySearchError(null);
      setValue("name", city.city, { shouldDirty: true, shouldValidate: true });

      if (!city.geometry) {
        clearBoundary(false);
        setCitySelectionNotice(
          "This city result does not include a polygon boundary. Please draw the boundary manually on the map."
        );

        mapRef.current.getView().animate({
          center: fromLonLat([city.longitude, city.latitude]),
          zoom: 8,
          duration: 450,
        });
        return;
      }

      const feature = geoJsonFormatRef.current.readFeature(
        {
          type: "Feature",
          geometry: city.geometry,
          properties: {},
        },
        {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        }
      ) as Feature<Geometry>;

      vectorSourceRef.current.clear();
      vectorSourceRef.current.addFeature(feature as Feature<Geometry>);
      setCitySelectionNotice(null);
      syncBoundaryFromSource();

      const geometry = feature.getGeometry();
      if (geometry) {
        mapRef.current.getView().fit(geometry.getExtent(), {
          padding: [40, 40, 40, 40],
          duration: 500,
          maxZoom: 13,
        });
      }
    },
    [clearBoundary, setValue, syncBoundaryFromSource]
  );

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    const vectorLayer = new VectorLayer({
      source: vectorSourceRef.current,
    });

    const initialMap = new Map({
      target: mapContainerRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat(DEFAULT_CENTER),
        zoom: DEFAULT_ZOOM,
      }),
    });

    const drawInteraction = new Draw({
      source: vectorSourceRef.current,
      type: "Polygon",
    });

    const modifyInteraction = new Modify({
      source: vectorSourceRef.current,
    });

    const snapInteraction = new Snap({
      source: vectorSourceRef.current,
    });

    drawInteraction.on("drawstart", () => {
      vectorSourceRef.current.clear();
      setSelectedCity(null);
      setCitySelectionNotice(null);
      setMapState("drawing");
    });

    drawInteraction.on("drawend", () => {
      syncBoundaryFromSource();
    });

    modifyInteraction.on("modifyend", () => {
      syncBoundaryFromSource();
    });

    initialMap.addInteraction(drawInteraction);
    initialMap.addInteraction(modifyInteraction);
    initialMap.addInteraction(snapInteraction);

    mapRef.current = initialMap;

    return () => {
      initialMap.dispose();
      mapRef.current = null;
    };
  }, [syncBoundaryFromSource]);

  const handleSearchCity = () => {
    setDebouncedCityQuery(cityQuery.trim());
  };

  useEffect(() => {
    if (selectedCity && debouncedCityQuery === selectedCity.label) {
      setCitySuggestions([]);
      setCitySearchError(null);
      setIsSearchingCities(false);
      return;
    }

    if (debouncedCityQuery.length < 3) {
      setCitySuggestions([]);
      setCitySearchError(null);
      setIsSearchingCities(false);
      return;
    }

    const controller = new AbortController();

    const runLookup = async () => {
      setIsSearchingCities(true);
      setCitySearchError(null);

      try {
        const suggestions = await searchCityBoundaries(
          debouncedCityQuery,
          controller.signal
        );
        setCitySuggestions(suggestions);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setCitySuggestions([]);
        setCitySearchError(getSearchErrorMessage(error));
      } finally {
        if (!controller.signal.aborted) {
          setIsSearchingCities(false);
        }
      }
    };

    runLookup();

    return () => {
      controller.abort();
    };
  }, [debouncedCityQuery, selectedCity]);

  const handleClearBoundary = () => {
    clearBoundary(true);
    resetMapView();
  };

  const onSubmit = async (data: NeighborhoodFormData) => {
    if (!boundaryGeometry) {
      toast({
        title: "Error",
        description: "Please select a city boundary or draw the neighborhood boundaries on the map.",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create a neighborhood.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    let newNeighborhoodId: string | null = null;

    const boundaryProperties: Record<string, Json> = {
      source: selectedCity ? "nominatim" : "manual",
    };

    if (selectedCity) {
      boundaryProperties.place_id = selectedCity.placeId;
      boundaryProperties.label = selectedCity.label;
      boundaryProperties.display_name = selectedCity.displayName;
    }

    const boundaryFeature: Json = {
      type: "Feature",
      geometry: boundaryGeometry as unknown as Json,
      properties: boundaryProperties,
    };

    try {
      const { data: newNeighborhood, error } = await supabase
        .from("neighborhoods")
        .insert({
          name: data.name,
          description: data.description,
          boundaries: boundaryFeature,
          created_by: user.id,
        })
        .select("id")
        .single();

      if (error) {
        throw error;
      }

      newNeighborhoodId = newNeighborhood.id;

      const { error: updateError } = await supabase.rpc("admin_set_user_neighborhood", {
        target_user_id: user.id,
        target_neighborhood_id: newNeighborhoodId,
      });

      if (updateError) {
        console.error("Failed to auto-assign neighborhood:", updateError);
      }

      toast({
        title: "Success",
        description: "Neighborhood created and assigned to you!",
      });

      queryClient.invalidateQueries({ queryKey: ["neighborhoods"] });
      queryClient.invalidateQueries({ queryKey: ["profile", user.id] });

      reset();
      setCityQuery("");
      setDebouncedCityQuery("");
      setCitySuggestions([]);
      setCitySearchError(null);
      setCitySelectionNotice(null);
      clearBoundary(true);
      resetMapView();
    } catch (error) {
      console.error("Error creating neighborhood:", error);
      toast({
        title: "Error",
        description: "Could not create neighborhood. Please try again.",
        variant: "destructive",
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
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Search for any city worldwide"
                value={cityQuery}
                onChange={(event) => {
                  setCityQuery(event.target.value);
                  setCitySelectionNotice(null);
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleSearchCity}
                disabled={cityQuery.trim().length < 3 || isSearchingCities}
              >
                Search
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Type at least 3 characters, search, then choose a city suggestion to load its boundary.
            </p>

            {isSearchingCities && (
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching cities...
              </div>
            )}

            {citySearchError && (
              <p className="text-sm text-red-500">{citySearchError}</p>
            )}

            {!isSearchingCities &&
              !citySearchError &&
              debouncedCityQuery.length >= 3 &&
              (!selectedCity || debouncedCityQuery !== selectedCity.label) &&
              citySuggestions.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No matching city boundaries found. Try a more specific query.
                </p>
              )}

            {citySuggestions.length > 0 && (
              <div className="rounded-md border max-h-56 overflow-y-auto">
                {citySuggestions.map((city) => (
                  <button
                    key={city.id}
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors border-b last:border-b-0"
                    onClick={() => applyCityBoundary(city)}
                  >
                    <div className="font-medium">{city.label}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {city.displayName}
                    </div>
                    {!city.geometry && (
                      <div className="text-xs text-amber-600 mt-1">
                        Boundary polygon unavailable. Manual drawing will be required.
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {selectedCity && (
              <p className="text-sm text-muted-foreground">
                Selected city: {selectedCity.label}
              </p>
            )}
          </div>

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
            <Textarea placeholder="Description" {...register("description")} />
          </div>

          {citySelectionNotice && (
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>{citySelectionNotice}</AlertDescription>
            </Alert>
          )}

          {mapState === "idle" && (
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                Select a city from search to load boundaries, or click the map to draw manually.
              </AlertDescription>
            </Alert>
          )}

          <div className="h-[400px] w-full border rounded-md overflow-hidden">
            <div ref={mapContainerRef} className="w-full h-full" />
          </div>

          {mapState === "drawing" && (
            <p className="text-sm text-muted-foreground">
              Continue clicking to draw boundaries. Double-click to complete the polygon.
            </p>
          )}

          {boundaryGeometry && (
            <p className="text-sm text-muted-foreground">
              Boundary loaded. You can drag points to refine it or draw again to replace it.
            </p>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClearBoundary}
              disabled={!boundaryGeometry}
            >
              Clear Boundary
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Neighborhood"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
