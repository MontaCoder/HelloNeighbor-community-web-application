-- ============================================================================
-- DEFINITIVE RLS FIX - No More Infinite Recursion
-- ============================================================================
-- This uses SECURITY DEFINER functions to BYPASS RLS in policy checks.
-- Run ALL of this in SQL Editor: https://app.supabase.com/project/hrmplyapfvzgcqignrhz/sql
-- ============================================================================

-- ============================================
-- STEP 1: Create helper functions that bypass RLS
-- ============================================

-- This function runs with elevated privileges (bypasses RLS)
-- so the inner query doesn't trigger the policy again
CREATE OR REPLACE FUNCTION public.get_current_user_neighborhood_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT neighborhood_id FROM public.profiles WHERE id = auth.uid();
$$;

-- ============================================
-- STEP 2: Replace ALL broken policies
-- ============================================

-- FIX: Profiles SELECT
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
CREATE POLICY "profiles_select_policy" ON public.profiles
    FOR SELECT TO authenticated USING (
        id = auth.uid()
        OR neighborhood_id = public.get_current_user_neighborhood_id()
    );

-- FIX: Events SELECT
DROP POLICY IF EXISTS "events_select_policy" ON public.events;
CREATE POLICY "events_select_policy" ON public.events
    FOR SELECT TO authenticated USING (
        neighborhood_id = public.get_current_user_neighborhood_id()
    );

-- FIX: Alerts SELECT
DROP POLICY IF EXISTS "alerts_select_policy" ON public.alerts;
CREATE POLICY "alerts_select_policy" ON public.alerts
    FOR SELECT TO authenticated USING (
        neighborhood_id = public.get_current_user_neighborhood_id()
    );

-- FIX: Marketplace Items SELECT
DROP POLICY IF EXISTS "marketplace_items_select_policy" ON public.marketplace_items;
CREATE POLICY "marketplace_items_select_policy" ON public.marketplace_items
    FOR SELECT TO authenticated USING (
        neighborhood_id = public.get_current_user_neighborhood_id()
    );

-- FIX: Messages SELECT
DROP POLICY IF EXISTS "messages_select_policy" ON public.messages;
CREATE POLICY "messages_select_policy" ON public.messages
    FOR SELECT TO authenticated USING (
        auth.uid() = sender_id
        OR auth.uid() = receiver_id
        OR (receiver_id IS NULL AND neighborhood_id = public.get_current_user_neighborhood_id())
    );

-- ============================================
-- STEP 3: Verify it works
-- ============================================
-- After running, test with this query (should NOT error):
-- SELECT * FROM profiles WHERE id = auth.uid();
