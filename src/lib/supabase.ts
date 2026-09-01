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
  DEVICE_ID: 'al_raheeq_device_id',
};

// Generate or retrieve persistent unique client device ID
export const getDeviceId = (): string => {
  if (typeof window === 'undefined') return 'server_side';
  let deviceId = localStorage.getItem(LOCAL_STORAGE_KEYS.DEVICE_ID);
  if (!deviceId) {
    deviceId = 'usr_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem(LOCAL_STORAGE_KEYS.DEVICE_ID, deviceId);
  }
  return deviceId;
};

// Sync State Payload Interface
export interface CloudSyncPayload {
  currentPage: number;
  streak: number;
  bookmarks: any[];
  answeredQuestions: Record<string, any>;
  mistakesBank: Record<string, any>;
  quizHistory: any[];
  lastActiveDate: string;
}

// Background Cloud Sync to Supabase
export const syncProgressToCloud = async (payload: CloudSyncPayload): Promise<boolean> => {
  if (!supabase || !isSupabaseConfigured) return false;

  try {
    const deviceId = getDeviceId();
    const { error } = await supabase
      .from('user_progress')
      .upsert(
        {
          user_device_id: deviceId,
          current_page: payload.currentPage,
          streak: payload.streak,
          bookmarks: payload.bookmarks,
          answered_questions: payload.answeredQuestions,
          mistakes_bank: payload.mistakesBank,
          quiz_history: payload.quizHistory,
          last_active_date: payload.lastActiveDate,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_device_id' }
      );

    if (error) {
      console.warn('[Supabase Sync Warning]:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase Sync Catch]:', err);
    return false;
  }
};

// Fetch User Progress from Cloud
export const fetchProgressFromCloud = async (): Promise<Partial<CloudSyncPayload> | null> => {
  if (!supabase || !isSupabaseConfigured) return null;

  try {
    const deviceId = getDeviceId();
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_device_id', deviceId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      currentPage: data.current_page,
      streak: data.streak,
      bookmarks: data.bookmarks || [],
      answeredQuestions: data.answered_questions || {},
      mistakesBank: data.mistakes_bank || {},
      quizHistory: data.quiz_history || [],
      lastActiveDate: data.last_active_date || '',
    };
  } catch (err) {
    console.warn('[Supabase Fetch Catch]:', err);
    return null;
  }
};
