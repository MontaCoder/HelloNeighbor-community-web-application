import { createClient } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);

describe('Supabase API Endpoints', () => {
  let userId: string;

  beforeAll(async () => {
    const { user, error } = await supabase.auth.signUp({
      email: 'testuser@example.com',
      password: 'password123',
    });

    if (error) throw error;
    userId = user.id;
  });

  afterAll(async () => {
    const { error } = await supabase.auth.api.deleteUser(userId, SUPABASE_KEY);
    if (error) throw error;
  });

  it('should authenticate user', async () => {
    const { user, error } = await supabase.auth.signIn({
      email: 'testuser@example.com',
      password: 'password123',
    });

    expect(error).toBeNull();
    expect(user).toBeDefined();
  });

  it('should retrieve user profile', async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it('should handle geospatial data retrieval', async () => {
    const { data, error } = await supabase
      .from('neighborhoods')
      .select('*')
      .limit(1);

    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it('should handle data submission', async () => {
    const { error } = await supabase
      .from('alerts')
      .insert({
        title: 'Test Alert',
        message: 'This is a test alert',
        type: 'general',
        urgency: 'low',
        created_by: userId,
        neighborhood_id: 'test-neighborhood-id',
      });

    expect(error).toBeNull();
  });

  it('should handle error responses', async () => {
    const { error } = await supabase
      .from('non_existent_table')
      .select('*');

    expect(error).not.toBeNull();
  });
});
