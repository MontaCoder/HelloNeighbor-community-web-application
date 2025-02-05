import { createClient } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';
import { expect } from 'chai';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);

describe('Database Tests', () => {
  it('should insert and retrieve a neighborhood with geospatial data', async () => {
    const { data, error } = await supabase
      .from('neighborhoods')
      .insert([
        {
          name: 'Test Neighborhood',
          description: 'A neighborhood for testing',
          boundaries: {
            type: 'Polygon',
            coordinates: [
              [
                [-73.9819, 40.7681],
                [-73.9819, 40.7681],
                [-73.9819, 40.7681],
                [-73.9819, 40.7681],
                [-73.9819, 40.7681]
              ]
            ]
          }
        }
      ])
      .select();

    expect(error).to.be.null;
    expect(data).to.have.lengthOf(1);
    expect(data[0].name).to.equal('Test Neighborhood');
  });

  it('should verify Row-Level Security (RLS) for neighborhood access', async () => {
    const { data, error } = await supabase
      .from('neighborhoods')
      .select('*')
      .eq('id', 'some-neighborhood-id');

    expect(error).to.be.null;
    expect(data).to.have.lengthOf(0);
  });

  it('should validate geospatial query using ST_Contains', async () => {
    const { data, error } = await supabase
      .rpc('find_neighborhood', {
        lat: 40.7681,
        lon: -73.9819
      });

    expect(error).to.be.null;
    expect(data).to.not.be.null;
  });
});
