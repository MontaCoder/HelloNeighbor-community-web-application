-- Test for find_neighborhood function

-- Create a temporary table for neighborhoods
CREATE TEMP TABLE temp_neighborhoods AS
SELECT * FROM neighborhoods LIMIT 0;

-- Insert test data into the temporary table
INSERT INTO temp_neighborhoods (id, name, description, boundaries)
VALUES
  ('test-neighborhood-1', 'Test Neighborhood 1', 'A test neighborhood', '{"type": "Polygon", "coordinates": [[[-73.9819, 40.7681], [-73.9819, 40.7681], [-73.9819, 40.7681], [-73.9819, 40.7681], [-73.9819, 40.7681]]]}');

-- Test the find_neighborhood function
DO $$
DECLARE
  neighborhood_id uuid;
BEGIN
  -- Call the function with a point inside the test neighborhood
  SELECT find_neighborhood(40.7681, -73.9819) INTO neighborhood_id;
  
  -- Check if the function returns the correct neighborhood ID
  IF neighborhood_id != 'test-neighborhood-1' THEN
    RAISE EXCEPTION 'Test failed: Expected neighborhood ID % but got %', 'test-neighborhood-1', neighborhood_id;
  END IF;
  
  -- Call the function with a point outside the test neighborhood
  SELECT find_neighborhood(40.7690, -73.9820) INTO neighborhood_id;
  
  -- Check if the function returns NULL for a point outside the neighborhood
  IF neighborhood_id IS NOT NULL THEN
    RAISE EXCEPTION 'Test failed: Expected NULL but got %', neighborhood_id;
  END IF;
  
  RAISE NOTICE 'All tests passed';
END $$;
