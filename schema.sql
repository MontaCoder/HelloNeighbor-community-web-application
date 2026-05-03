-- Database Schema Backup (FIXED)
-- Generated on: 2024-03-19
-- Fixed on: 2026-04-18

-- ============================================
-- ESSENTIAL EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;  -- REQUIRED for find_neighborhood function

-- ============================================
-- CUSTOM TYPES
-- ============================================
CREATE TYPE user_role AS ENUM ('admin', 'user');

-- ============================================
-- TABLES
-- ============================================

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

-- ============================================
-- FOREIGN KEY CONSTRAINTS
-- ============================================

ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE,
    ADD CONSTRAINT profiles_neighborhood_id_fkey FOREIGN KEY (neighborhood_id) REFERENCES neighborhoods(id);

ALTER TABLE public.events
    ADD CONSTRAINT events_created_by_fkey FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE SET NULL,
    ADD CONSTRAINT events_neighborhood_id_fkey FOREIGN KEY (neighborhood_id) REFERENCES neighborhoods(id) ON DELETE SET NULL;

ALTER TABLE public.alerts
    ADD CONSTRAINT alerts_created_by_fkey FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE SET NULL,
    ADD CONSTRAINT alerts_neighborhood_id_fkey FOREIGN KEY (neighborhood_id) REFERENCES neighborhoods(id) ON DELETE SET NULL;

ALTER TABLE public.marketplace_items
    ADD CONSTRAINT marketplace_items_created_by_fkey FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE SET NULL,
    ADD CONSTRAINT marketplace_items_neighborhood_id_fkey FOREIGN KEY (neighborhood_id) REFERENCES neighborhoods(id) ON DELETE SET NULL;

ALTER TABLE public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE SET NULL,
    ADD CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES profiles(id) ON DELETE SET NULL,
    ADD CONSTRAINT messages_neighborhood_id_fkey FOREIGN KEY (neighborhood_id) REFERENCES neighborhoods(id) ON DELETE SET NULL;

ALTER TABLE public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.neighborhoods
    ADD CONSTRAINT neighborhoods_created_by_fkey FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE SET NULL;

-- ============================================
-- DATA INTEGRITY CONSTRAINTS
-- ============================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_roles_user_id_role_key') THEN
        ALTER TABLE public.user_roles
            ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'events_valid_time_check') THEN
        ALTER TABLE public.events
            ADD CONSTRAINT events_valid_time_check CHECK (end_time > start_time);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'alerts_type_check') THEN
        ALTER TABLE public.alerts
            ADD CONSTRAINT alerts_type_check CHECK (type IN ('general', 'emergency', 'weather', 'safety', 'maintenance', 'event'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'alerts_urgency_check') THEN
        ALTER TABLE public.alerts
            ADD CONSTRAINT alerts_urgency_check CHECK (urgency IN ('low', 'medium', 'high'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'marketplace_items_status_check') THEN
        ALTER TABLE public.marketplace_items
            ADD CONSTRAINT marketplace_items_status_check CHECK (status IN ('available', 'pending', 'sold', 'removed'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'marketplace_items_category_check') THEN
        ALTER TABLE public.marketplace_items
            ADD CONSTRAINT marketplace_items_category_check CHECK (category IS NULL OR category IN ('general', 'furniture', 'electronics', 'clothing', 'books', 'services'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'marketplace_items_price_check') THEN
        ALTER TABLE public.marketplace_items
            ADD CONSTRAINT marketplace_items_price_check CHECK (price IS NULL OR price >= 0);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_coordinates_check') THEN
        ALTER TABLE public.profiles
            ADD CONSTRAINT profiles_coordinates_check CHECK (
                (latitude IS NULL AND longitude IS NULL)
                OR (latitude BETWEEN -90 AND 90 AND longitude BETWEEN -180 AND 180)
            );
    END IF;
END $$;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS HELPER FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION public.get_current_user_neighborhood_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT neighborhood_id FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = $1
    AND user_roles.role = 'admin'
  );
$function$;

CREATE OR REPLACE FUNCTION public.find_neighborhood(lat double precision, lon double precision)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $function$
DECLARE
    neighborhood_id uuid;
BEGIN
    SELECT id INTO neighborhood_id
    FROM public.neighborhoods
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
$function$;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Profiles Policies
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
CREATE POLICY "profiles_select_policy" ON public.profiles
    FOR SELECT TO authenticated USING (
        id = auth.uid()
        OR neighborhood_id = public.get_current_user_neighborhood_id()
    );

DROP POLICY IF EXISTS "profiles_update_own_policy" ON public.profiles;
CREATE POLICY "profiles_update_own_policy" ON public.profiles
    FOR UPDATE TO authenticated
    USING ((select auth.uid()) = id)
    WITH CHECK (
        (select auth.uid()) = id
        AND (
            neighborhood_id IS NULL
            OR (
                latitude IS NOT NULL
                AND longitude IS NOT NULL
                AND neighborhood_id = public.find_neighborhood(latitude, longitude)
            )
        )
    );

DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
CREATE POLICY "profiles_insert_policy" ON public.profiles
    FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS "profiles_delete_own_policy" ON public.profiles;
CREATE POLICY "profiles_delete_own_policy" ON public.profiles
    FOR DELETE TO authenticated USING ((select auth.uid()) = id);

-- Events Policies
DROP POLICY IF EXISTS "events_select_policy" ON public.events;
CREATE POLICY "events_select_policy" ON public.events
    FOR SELECT TO authenticated USING (
        neighborhood_id = public.get_current_user_neighborhood_id()
    );

DROP POLICY IF EXISTS "events_insert_policy" ON public.events;
CREATE POLICY "events_insert_policy" ON public.events
    FOR INSERT TO authenticated WITH CHECK (
        (select auth.uid()) = created_by
        AND neighborhood_id = public.get_current_user_neighborhood_id()
    );

DROP POLICY IF EXISTS "events_update_policy" ON public.events;
CREATE POLICY "events_update_policy" ON public.events
    FOR UPDATE TO authenticated
    USING ((select auth.uid()) = created_by)
    WITH CHECK (
        (select auth.uid()) = created_by
        AND neighborhood_id = public.get_current_user_neighborhood_id()
    );

DROP POLICY IF EXISTS "events_delete_policy" ON public.events;
CREATE POLICY "events_delete_policy" ON public.events
    FOR DELETE TO authenticated USING ((select auth.uid()) = created_by);

-- Alerts Policies
DROP POLICY IF EXISTS "alerts_select_policy" ON public.alerts;
CREATE POLICY "alerts_select_policy" ON public.alerts
    FOR SELECT TO authenticated USING (
        neighborhood_id = public.get_current_user_neighborhood_id()
    );

DROP POLICY IF EXISTS "alerts_insert_policy" ON public.alerts;
CREATE POLICY "alerts_insert_policy" ON public.alerts
    FOR INSERT TO authenticated WITH CHECK (
        (select auth.uid()) = created_by
        AND neighborhood_id = public.get_current_user_neighborhood_id()
    );

DROP POLICY IF EXISTS "alerts_update_policy" ON public.alerts;
CREATE POLICY "alerts_update_policy" ON public.alerts
    FOR UPDATE TO authenticated
    USING ((select auth.uid()) = created_by)
    WITH CHECK (
        (select auth.uid()) = created_by
        AND neighborhood_id = public.get_current_user_neighborhood_id()
    );

DROP POLICY IF EXISTS "alerts_delete_policy" ON public.alerts;
CREATE POLICY "alerts_delete_policy" ON public.alerts
    FOR DELETE TO authenticated USING ((select auth.uid()) = created_by);

-- Marketplace Items Policies
DROP POLICY IF EXISTS "marketplace_items_select_policy" ON public.marketplace_items;
CREATE POLICY "marketplace_items_select_policy" ON public.marketplace_items
    FOR SELECT TO authenticated USING (
        neighborhood_id = public.get_current_user_neighborhood_id()
    );

DROP POLICY IF EXISTS "marketplace_items_insert_policy" ON public.marketplace_items;
CREATE POLICY "marketplace_items_insert_policy" ON public.marketplace_items
    FOR INSERT TO authenticated WITH CHECK (
        (select auth.uid()) = created_by
        AND neighborhood_id = public.get_current_user_neighborhood_id()
    );

DROP POLICY IF EXISTS "marketplace_items_update_policy" ON public.marketplace_items;
CREATE POLICY "marketplace_items_update_policy" ON public.marketplace_items
    FOR UPDATE TO authenticated
    USING ((select auth.uid()) = created_by)
    WITH CHECK (
        (select auth.uid()) = created_by
        AND neighborhood_id = public.get_current_user_neighborhood_id()
    );

DROP POLICY IF EXISTS "marketplace_items_delete_policy" ON public.marketplace_items;
CREATE POLICY "marketplace_items_delete_policy" ON public.marketplace_items
    FOR DELETE TO authenticated USING ((select auth.uid()) = created_by);

-- Messages Policies
DROP POLICY IF EXISTS "messages_select_policy" ON public.messages;
CREATE POLICY "messages_select_policy" ON public.messages
    FOR SELECT TO authenticated USING (
        auth.uid() = sender_id
        OR auth.uid() = receiver_id
        OR (receiver_id IS NULL AND neighborhood_id = public.get_current_user_neighborhood_id())
    );

DROP POLICY IF EXISTS "messages_insert_policy" ON public.messages;
CREATE POLICY "messages_insert_policy" ON public.messages
    FOR INSERT TO authenticated WITH CHECK (
        (select auth.uid()) = sender_id
        AND neighborhood_id = public.get_current_user_neighborhood_id()
        AND (
            receiver_id IS NULL
            OR EXISTS (
                SELECT 1 FROM public.profiles receiver
                WHERE receiver.id = receiver_id
                AND receiver.neighborhood_id = public.get_current_user_neighborhood_id()
            )
        )
    );

DROP POLICY IF EXISTS "messages_update_policy" ON public.messages;
CREATE POLICY "messages_update_policy" ON public.messages
    FOR UPDATE TO authenticated
    USING ((select auth.uid()) = sender_id)
    WITH CHECK (
        (select auth.uid()) = sender_id
        AND neighborhood_id = public.get_current_user_neighborhood_id()
    );

DROP POLICY IF EXISTS "messages_delete_policy" ON public.messages;
CREATE POLICY "messages_delete_policy" ON public.messages
    FOR DELETE TO authenticated USING ((select auth.uid()) = sender_id);

-- Notifications Policies
DROP POLICY IF EXISTS "notifications_select_policy" ON public.notifications;
CREATE POLICY "notifications_select_policy" ON public.notifications
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_update_policy" ON public.notifications;
CREATE POLICY "notifications_update_policy" ON public.notifications
    FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- NEW: Allow system to insert notifications for users
DROP POLICY IF EXISTS "notifications_insert_policy" ON public.notifications;
CREATE POLICY "notifications_insert_policy" ON public.notifications
    FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = user_id);

-- NEW: Allow users to delete their own notifications
DROP POLICY IF EXISTS "notifications_delete_policy" ON public.notifications;
CREATE POLICY "notifications_delete_policy" ON public.notifications
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Neighborhoods Policies
DROP POLICY IF EXISTS "neighborhoods_select_policy" ON public.neighborhoods;
CREATE POLICY "neighborhoods_select_policy" ON public.neighborhoods
    FOR SELECT TO authenticated USING (
        public.is_admin((select auth.uid()))
        OR id = public.get_current_user_neighborhood_id()
    );

DROP POLICY IF EXISTS "neighborhoods_insert_policy" ON public.neighborhoods;
CREATE POLICY "neighborhoods_insert_policy" ON public.neighborhoods
    FOR INSERT TO authenticated WITH CHECK (
        public.is_admin((select auth.uid()))
        AND created_by = (select auth.uid())
    );

DROP POLICY IF EXISTS "neighborhoods_update_policy" ON public.neighborhoods;
CREATE POLICY "neighborhoods_update_policy" ON public.neighborhoods
    FOR UPDATE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'::user_role
        )
    );

DROP POLICY IF EXISTS "neighborhoods_delete_policy" ON public.neighborhoods;
CREATE POLICY "neighborhoods_delete_policy" ON public.neighborhoods
    FOR DELETE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'::user_role
        )
    );

-- User Roles Policies
DROP POLICY IF EXISTS "user_roles_select_policy" ON public.user_roles;
CREATE POLICY "user_roles_select_policy" ON public.user_roles
    FOR SELECT TO authenticated USING (
        user_id = (select auth.uid())
        OR public.is_admin((select auth.uid()))
    );

DROP POLICY IF EXISTS "user_roles_insert_policy" ON public.user_roles;
CREATE POLICY "user_roles_insert_policy" ON public.user_roles
    FOR INSERT TO authenticated WITH CHECK (public.is_admin((select auth.uid())));

DROP POLICY IF EXISTS "user_roles_update_policy" ON public.user_roles;
CREATE POLICY "user_roles_update_policy" ON public.user_roles
    FOR UPDATE TO authenticated
    USING (public.is_admin((select auth.uid())))
    WITH CHECK (public.is_admin((select auth.uid())));

DROP POLICY IF EXISTS "user_roles_delete_policy" ON public.user_roles;
CREATE POLICY "user_roles_delete_policy" ON public.user_roles
    FOR DELETE TO authenticated USING (public.is_admin((select auth.uid())));

-- ============================================
-- FUNCTIONS
-- ============================================

-- Helper function that bypasses RLS for policy checks
-- SECURITY DEFINER means it runs with elevated privileges,
-- so inner queries don't trigger RLS policies again
CREATE OR REPLACE FUNCTION public.get_current_user_neighborhood_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT neighborhood_id FROM public.profiles WHERE id = auth.uid();
$$;

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
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = $1
    AND user_roles.role = 'admin'
  );
$function$;

CREATE OR REPLACE FUNCTION public.admin_set_user_neighborhood(
    target_user_id uuid,
    target_neighborhood_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    IF NOT public.is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Only admins can assign neighborhoods';
    END IF;

    IF target_neighborhood_id IS NOT NULL
        AND NOT EXISTS (
            SELECT 1
            FROM public.neighborhoods
            WHERE id = target_neighborhood_id
        )
    THEN
        RAISE EXCEPTION 'Neighborhood does not exist';
    END IF;

    UPDATE public.profiles
    SET neighborhood_id = target_neighborhood_id,
        updated_at = timezone('utc'::text, now())
    WHERE id = target_user_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.find_neighborhood(lat double precision, lon double precision)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
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

REVOKE EXECUTE ON FUNCTION public.get_current_user_neighborhood_id() FROM public;
GRANT EXECUTE ON FUNCTION public.get_current_user_neighborhood_id() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.find_neighborhood(double precision, double precision) FROM public;
GRANT EXECUTE ON FUNCTION public.find_neighborhood(double precision, double precision) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.admin_set_user_neighborhood(uuid, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.admin_set_user_neighborhood(uuid, uuid) TO authenticated;

-- ============================================
-- TRIGGERS
-- ============================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

DROP TRIGGER IF EXISTS ensure_valid_event_times ON events;
CREATE TRIGGER ensure_valid_event_times
    BEFORE INSERT OR UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION validate_event_timestamps();

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_neighborhood_id ON profiles(neighborhood_id);
CREATE INDEX IF NOT EXISTS idx_events_neighborhood_id ON events(neighborhood_id);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);  -- NEW: for ordering
CREATE INDEX IF NOT EXISTS idx_alerts_neighborhood_id ON alerts(neighborhood_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_neighborhood_id ON marketplace_items(neighborhood_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_status ON marketplace_items(status);  -- NEW: for filtering
CREATE INDEX IF NOT EXISTS idx_messages_neighborhood_id ON messages(neighborhood_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);  -- NEW: for joins
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);  -- NEW: for joins
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);  -- NEW: for filtering
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);

-- ============================================
-- STORAGE BUCKET SETUP (NEW)
-- ============================================

-- Create the app-uploads bucket for image uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'app-uploads',
    'app-uploads',
    true,
    5242880, -- 5MB limit
    ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
CREATE POLICY "Allow authenticated uploads" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (
        bucket_id = 'app-uploads'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Allow public access to view uploaded images
DROP POLICY IF EXISTS "Allow public access to uploads" ON storage.objects;
CREATE POLICY "Allow public access to uploads" ON storage.objects
    FOR SELECT TO public USING (bucket_id = 'app-uploads');

-- Allow users to delete their own uploads
DROP POLICY IF EXISTS "Allow users to delete own uploads" ON storage.objects;
CREATE POLICY "Allow users to delete own uploads" ON storage.objects
    FOR DELETE TO authenticated USING (
        bucket_id = 'app-uploads' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );
