import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local storage keys for fallback persistence
export const LOCAL_STORAGE_KEYS = {
  READING_PROGRESS: 'al_raheeq_reading_progress',
  BOOKMARKS: 'al_raheeq_bookmarks',
  QUIZ_PROGRESS: 'al_raheeq_quiz_progress',
  MISTAKES_BANK: 'al_raheeq_mistakes_bank',
  QUIZ_HISTORY: 'al_raheeq_quiz_history',
  USER_STATS: 'al_raheeq_user_stats',
  THEME_SETTINGS: 'al_raheeq_theme_settings',
};
