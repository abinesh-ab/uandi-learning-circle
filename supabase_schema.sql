-- ============================================================================
-- SUPABASE POSTGRES ARCHITECTURE FOR THE X FACTORS (U&I LEARNING CIRCLE)
-- Safe, Idempotent SQL Setup Script (Safe to re-run multiple times)
-- ============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- TABLE 1: volunteers (Core Registry)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.volunteers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'Educator',
    focus TEXT DEFAULT 'Foundational Numeracy',
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed core squad members if empty
INSERT INTO public.volunteers (name, role, focus)
VALUES 
    ('Aravinth', '100% Changemaker', 'Foundational Numeracy'),
    ('Sushmitha', '100% Changemaker', 'Foundational Numeracy'),
    ('Aruntathi', '100% Changemaker', 'Foundational Numeracy'),
    ('Stanes', '100% Changemaker', 'Foundational Numeracy'),
    ('Nivashini', '100% Changemaker', 'Foundational Numeracy & Accountancy'),
    ('Kaviya', '100% Changemaker', 'Accountancy'),
    ('Kishore', '100% Changemaker', 'Maths'),
    ('Yuvan', '100% Changemaker', 'Maths'),
    ('Vignesh', '100% Changemaker', 'Accountancy'),
    ('Yogesh', '100% Changemaker', 'Accountancy'),
    ('Abinesh', '100% Changemaker & Lead', 'LC Support & Tasks')
ON CONFLICT (name) DO NOTHING;

-- ----------------------------------------------------------------------------
-- TABLE 2: affirmations (The Gratitude Vault)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.affirmations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID REFERENCES public.volunteers(id) ON DELETE SET NULL,
    recipient_name TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    message TEXT NOT NULL,
    color TEXT DEFAULT 'amber',
    reactions JSONB DEFAULT '{"❤️": 0, "🔥": 0, "👏": 0, "🌟": 0, "🐝": 0, "🌻": 0}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TABLE 3: missions (Squad Missions / Action Tracker)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    volunteer_name TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    status TEXT DEFAULT 'todo',
    due_date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- ----------------------------------------------------------------------------
-- TABLE 4: student_logs (Future-Proof Entry System)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    volunteer_name TEXT NOT NULL,
    session_date DATE DEFAULT CURRENT_DATE,
    topics_covered TEXT NOT NULL,
    student_understanding TEXT DEFAULT 'Good',
    homework_assigned TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TABLE 5: generic_entries (Universal Dynamic Store for Future Features)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.generic_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_type TEXT NOT NULL,
    author_name TEXT NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- ROW-LEVEL SECURITY (RLS) POLICIES - OPEN PUBLIC ACCESS FOR VOLUNTEERS
-- ----------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generic_entries ENABLE ROW LEVEL SECURITY;

-- Cleanly drop policies if they already exist to avoid duplicate errors
DROP POLICY IF EXISTS "Public access for volunteers" ON public.volunteers;
DROP POLICY IF EXISTS "Public access for affirmations" ON public.affirmations;
DROP POLICY IF EXISTS "Public access for missions" ON public.missions;
DROP POLICY IF EXISTS "Public access for student_logs" ON public.student_logs;
DROP POLICY IF EXISTS "Public access for generic_entries" ON public.generic_entries;

-- Create Open Public Access Policies (Read/Write/Update)
CREATE POLICY "Public access for volunteers" ON public.volunteers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access for affirmations" ON public.affirmations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access for missions" ON public.missions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access for student_logs" ON public.student_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access for generic_entries" ON public.generic_entries FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime for all tables (Safely ignore if publication table already exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'volunteers') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.volunteers;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'affirmations') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.affirmations;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'missions') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.missions;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'student_logs') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.student_logs;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'generic_entries') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.generic_entries;
    END IF;
END $$;
