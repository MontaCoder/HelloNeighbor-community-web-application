-- Database Schema Backup
-- Generated on: 2024-03-19

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'user');

-- Create Tables
CREATE TABLE IF NOT EXISTS public.neighborhoods (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    boundaries jsonb NOT NULL,
    metadata jsonb,
    created_by uuid,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT neighborhoods_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid NOT NULL,
    full_name text,
    avatar_url text,
    username text,
    neighborhood text,
    city text,
    latitude double precision,
    longitude double precision,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    neighborhood_id uuid,
    preferences jsonb DEFAULT '{}'::jsonb,
    last_seen timestamp with time zone,
    status text DEFAULT 'offline'::text,
    CONSTRAINT profiles_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    location text,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone NOT NULL,
    image_url text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    neighborhood_id uuid,
    CONSTRAINT events_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.alerts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type text NOT NULL,
    urgency text NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    neighborhood_id uuid,
    CONSTRAINT alerts_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.marketplace_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    price numeric,
    category text,
    image_urls text[],
    status text DEFAULT 'available'::text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    neighborhood_id uuid,
    CONSTRAINT marketplace_items_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    content text NOT NULL,
    image_url text,
    sender_id uuid,
    receiver_id uuid,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    neighborhood_id uuid,
    CONSTRAINT messages_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    title text NOT NULL,
    message text NOT NULL,
    type text NOT NULL,
    read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    related_entity_id uuid,
    related_entity_type text,
    CONSTRAINT notifications_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    role user_role DEFAULT 'user'::user_role,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT user_roles_pkey PRIMARY KEY (id)
);

-- Add Foreign Key Constraints
ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id),
    ADD CONSTRAINT profiles_neighborhood_id_fkey FOREIGN KEY (neighborhood_id) REFERENCES neighborhoods(id);

ALTER TABLE public.events
    ADD CONSTRAINT events_created_by_fkey FOREIGN KEY (created_by) REFERENCES profiles(id),
    ADD CONSTRAINT events_neighborhood_id_fkey FOREIGN KEY (neighborhood_id) REFERENCES neighborhoods(id);

ALTER TABLE public.alerts
    ADD CONSTRAINT alerts_created_by_fkey FOREIGN KEY (created_by) REFERENCES profiles(id),
    ADD CONSTRAINT alerts_neighborhood_id_fkey FOREIGN KEY (neighborhood_id) REFERENCES neighborhoods(id);

ALTER TABLE public.marketplace_items
    ADD CONSTRAINT marketplace_items_created_by_fkey FOREIGN KEY (created_by) REFERENCES profiles(id),
    ADD CONSTRAINT marketplace_items_neighborhood_id_fkey FOREIGN KEY (neighborhood_id) REFERENCES neighborhoods(id);

ALTER TABLE public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES profiles(id),
    ADD CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES profiles(id),
    ADD CONSTRAINT messages_neighborhood_id_fkey FOREIGN KEY (neighborhood_id) REFERENCES neighborhoods(id);

ALTER TABLE public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id);

ALTER TABLE public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);

ALTER TABLE public.neighborhoods
    ADD CONSTRAINT neighborhoods_created_by_fkey FOREIGN KEY (created_by) REFERENCES profiles(id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Profiles Policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.profiles;
CREATE POLICY "profiles_select_policy" ON public.profiles
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM profiles viewer
            WHERE viewer.id = auth.uid()
            AND viewer.neighborhood_id = profiles.neighborhood_id
        )
    );

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users" ON public.profiles
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable delete for users" ON public.profiles
    FOR DELETE TO authenticated USING (auth.uid() = id);

-- Events Policies
CREATE POLICY "events_select_policy" ON public.events
    FOR SELECT TO authenticated USING (
        auth.uid() IN (
            SELECT profiles.id FROM profiles 
            WHERE profiles.neighborhood_id = events.neighborhood_id
        )
    );

CREATE POLICY "events_insert_policy" ON public.events
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "events_update_policy" ON public.events
    FOR UPDATE TO authenticated USING (auth.uid() = created_by);

CREATE POLICY "events_delete_policy" ON public.events
    FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Alerts Policies
CREATE POLICY "alerts_select_policy" ON public.alerts
    FOR SELECT TO authenticated USING (
        auth.uid() IN (
            SELECT profiles.id FROM profiles 
            WHERE profiles.neighborhood_id = alerts.neighborhood_id
        )
    );

CREATE POLICY "alerts_insert_policy" ON public.alerts
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "alerts_update_policy" ON public.alerts
    FOR UPDATE TO authenticated USING (auth.uid() = created_by);

CREATE POLICY "alerts_delete_policy" ON public.alerts
    FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Marketplace Items Policies
CREATE POLICY "marketplace_items_select_policy" ON public.marketplace_items
    FOR SELECT TO authenticated USING (
        auth.uid() IN (
            SELECT profiles.id FROM profiles 
            WHERE profiles.neighborhood_id = marketplace_items.neighborhood_id
        )
    );

CREATE POLICY "marketplace_items_insert_policy" ON public.marketplace_items
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "marketplace_items_update_policy" ON public.marketplace_items
    FOR UPDATE TO authenticated USING (auth.uid() = created_by);

CREATE POLICY "marketplace_items_delete_policy" ON public.marketplace_items
    FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Messages Policies
DROP POLICY IF EXISTS "messages_select_policy" ON public.messages;
CREATE POLICY "messages_select_policy" ON public.messages
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM profiles viewer
            WHERE viewer.id = auth.uid()
            AND viewer.neighborhood_id = messages.neighborhood_id
        )
        OR 
        (auth.uid() = sender_id OR auth.uid() = receiver_id)
    );

DROP POLICY IF EXISTS "messages_insert_policy" ON public.messages;
CREATE POLICY "messages_insert_policy" ON public.messages
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles sender
            WHERE sender.id = auth.uid()
            AND sender.neighborhood_id = neighborhood_id
        )
    );

CREATE POLICY "messages_update_policy" ON public.messages
    FOR UPDATE TO authenticated USING (auth.uid() = sender_id);

CREATE POLICY "messages_delete_policy" ON public.messages
    FOR DELETE TO authenticated USING (auth.uid() = sender_id);

-- Notifications Policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Neighborhoods Policies
CREATE POLICY "neighborhoods_select_policy" ON public.neighborhoods
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "neighborhoods_insert_policy" ON public.neighborhoods
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "neighborhoods_update_policy" ON public.neighborhoods
    FOR UPDATE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role = 'admin'::user_role
        )
    );

CREATE POLICY "neighborhoods_delete_policy" ON public.neighborhoods
    FOR DELETE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role = 'admin'::user_role
        )
    );

-- User Roles Policies
CREATE POLICY "user_roles_select_policy" ON public.user_roles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "user_roles_insert_policy" ON public.user_roles
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "user_roles_update_policy" ON public.user_roles
    FOR UPDATE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM user_roles user_roles_1
            WHERE user_roles_1.user_id = auth.uid() 
            AND user_roles_1.role = 'admin'::user_role
        )
    );

CREATE POLICY "user_roles_delete_policy" ON public.user_roles
    FOR DELETE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM user_roles user_roles_1
            WHERE user_roles_1.user_id = auth.uid() 
            AND user_roles_1.role = 'admin'::user_role
        )
    );

-- Create Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_roles.user_id = $1 
    AND user_roles.role = 'admin'
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.find_neighborhood(lat double precision, lon double precision)
RETURNS uuid
LANGUAGE plpgsql
AS $function$
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
                    WHEN boundaries->>'geometry' IS NOT NULL THEN boundaries->>'geometry'
                    ELSE NULL
                END
            ),
            4326
        ),
        ST_SetSRID(ST_MakePoint(lon, lat), 4326)
    );
    
    RAISE NOTICE 'Checking point %, % against neighborhoods', lon, lat;
    
    RETURN neighborhood_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_event_timestamps()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
    IF NEW.end_time <= NEW.start_time THEN
        RAISE EXCEPTION 'End time must be after start time';
    END IF;
    RETURN NEW;
END;
$function$;

-- Create Triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER ensure_valid_event_times
    BEFORE INSERT OR UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION validate_event_timestamps();

-- Create Indexes (if needed)
CREATE INDEX IF NOT EXISTS idx_profiles_neighborhood_id ON profiles(neighborhood_id);
CREATE INDEX IF NOT EXISTS idx_events_neighborhood_id ON events(neighborhood_id);
CREATE INDEX IF NOT EXISTS idx_alerts_neighborhood_id ON alerts(neighborhood_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_neighborhood_id ON marketplace_items(neighborhood_id);
CREATE INDEX IF NOT EXISTS idx_messages_neighborhood_id ON messages(neighborhood_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);