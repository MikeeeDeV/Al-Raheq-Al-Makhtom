import { createClient } from '@supabase/supabase-js';

// Fallback credentials for Supabase integration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummykey';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface UserProgressRecord {
  user_id?: string;
  current_page: number;
  reading_start_date?: string;
  reading_end_date?: string;
  is_book_completed?: boolean;
  answered_questions_count: number;
  correct_answers_count: number;
  streak_days: number;
  updated_at: string;
}

/**
 * Persists user reading & quiz progress to Supabase PostgreSQL database
 */
export async function syncUserProgressToSupabase(record: UserProgressRecord) {
  try {
    if (!import.meta.env.VITE_SUPABASE_URL) return; // Silent fallback if not configured in .env

    let userId = localStorage.getItem('alraheeq_supabase_uid');
    if (!userId) {
      userId = `user_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
      localStorage.setItem('alraheeq_supabase_uid', userId);
    }

    const { error } = await supabase.from('alraheeq_progress').upsert({
      user_id: userId,
      current_page: record.current_page,
      reading_start_date: record.reading_start_date,
      reading_end_date: record.reading_end_date,
      is_book_completed: record.is_book_completed,
      answered_questions_count: record.answered_questions_count,
      correct_answers_count: record.correct_answers_count,
      streak_days: record.streak_days,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.log('Supabase sync info:', error.message);
    }
  } catch (err) {
    console.log('Supabase connection info:', err);
  }
}
