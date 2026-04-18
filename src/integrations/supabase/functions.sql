CREATE OR REPLACE FUNCTION public.find_neighborhood(lat double precision, lon double precision)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
    neighborhood_id uuid;
BEGIN
    SELECT id INTO neighborhood_id
    FROM neighborhoods
    WHERE ST_Contains(
        ST_SetSRID(
            ST_GeomFromGeoJSON(
                CASE
                    WHEN boundaries->>'type' = 'Polygon' THEN boundaries::text
                    WHEN boundaries->>'type' = 'MultiPolygon' THEN boundaries::text
                    WHEN boundaries->>'type' = 'Feature' AND boundaries->'geometry' IS NOT NULL THEN (boundaries->'geometry')::text
                    WHEN boundaries->>'geometry' IS NOT NULL THEN boundaries->>'geometry'
                    ELSE NULL
                END
            ),
            4326
        ),
        ST_SetSRID(ST_MakePoint(lon, lat), 4326)
    )
    LIMIT 1;
    
    RETURN neighborhood_id;
END;
$$;
