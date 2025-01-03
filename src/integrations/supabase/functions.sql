CREATE OR REPLACE FUNCTION public.find_neighborhood(lat double precision, lon double precision)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
    neighborhood_id uuid;
BEGIN
    -- Find the neighborhood that contains the given point
    SELECT id INTO neighborhood_id
    FROM neighborhoods
    WHERE ST_Contains(
        ST_SetSRID(ST_GeomFromGeoJSON(boundaries->>'geometry'), 4326),
        ST_SetSRID(ST_MakePoint(lon, lat), 4326)
    )
    LIMIT 1;
    
    RETURN neighborhood_id;
END;
$$;