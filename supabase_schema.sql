-- ============================================================
-- SQL Schema for Al-Raheeq Al-Makhtoum Platform (Supabase)
-- Execute this script in your Supabase SQL Editor
-- ============================================================

-- Create User Progress Table
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_device_id TEXT UNIQUE NOT NULL,
  current_page INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 1,
  total_score INTEGER DEFAULT 0,
  bookmarks JSONB DEFAULT '[]'::jsonb,
  answered_questions JSONB DEFAULT '{}'::jsonb,
  mistakes_bank JSONB DEFAULT '{}'::jsonb,
  quiz_history JSONB DEFAULT '[]'::jsonb,
  last_active_date TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Allow public read & write access by user_device_id
CREATE POLICY "Allow public select on user_progress"
  ON public.user_progress FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on user_progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update on user_progress"
  ON public.user_progress FOR UPDATE
  USING (true);
