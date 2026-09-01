import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  QuizData,
  Question,
  Bookmark,
  QuizHistoryEntry,
  CorrectedMistakeEntry,
  ReaderTheme,
  UserAchievement,
} from '../types';
import { sendBookCompletionToTelegram } from '../services/telegramTelemetry';
import { syncUserProgressToSupabase } from '../services/supabaseClient';

export type AppView = 'home' | 'reader' | 'quiz' | 'mistakes' | 'analytics';

interface AppState {
  // Questions Data
  quizData: QuizData | null;
  isLoadingQuestions: boolean;
  fetchQuestions: () => Promise<void>;

  // Navigation
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  setCurrentViewWithoutUrlUpdate: (view: AppView) => void;
  activeQuizSection: number | null;
  activeQuizMode: 'relaxed' | 'timed';
  startQuiz: (sectionId: number, mode?: 'relaxed' | 'timed') => void;

  // Reading Mode State & Completion Tracking
  currentPage: number;
  totalPages: number;
  readingTheme: ReaderTheme;
  viewMode: 'single' | 'double';
  zoomLevel: number;
  bookmarks: Bookmark[];
  hasResumeBanner: boolean;
  readingStartDate: string;
  readingEndDate: string | null;
  isBookCompleted: boolean;
  isCompletionModalOpen: boolean;
  setCurrentPage: (page: number) => void;
  setTotalPages: (total: number) => void;
  setReadingTheme: (theme: ReaderTheme) => void;
  setViewMode: (mode: 'single' | 'double') => void;
  setZoomLevel: (zoom: number) => void;
  addBookmark: (pageNumber: number, title: string, note?: string) => void;
  removeBookmark: (id: string) => void;
  dismissResumeBanner: () => void;
  setCompletionModalOpen: (open: boolean) => void;

  // Quiz & Mistakes State
  answeredQuestions: Record<number, { isCorrect: boolean; selectedAnswer: string; timestamp: string }>;
  mistakesBank: Record<number, Question>;
  correctedMistakesArchive: Record<number, CorrectedMistakeEntry>;
  quizHistory: QuizHistoryEntry[];
  streak: number;
  lastActiveDate: string;
  recordAnswer: (question: Question, selectedAnswer: string) => boolean;
  removeFromMistakesBank: (questionId: number) => void;
  clearCorrectedArchive: () => void;
  saveQuizSession: (entry: Omit<QuizHistoryEntry, 'id' | 'date'>) => void;
  checkAndUpdateStreak: () => void;

  // UI Modals
  isShareModalOpen: boolean;
  isAboutModalOpen: boolean;
  isGiftModalOpen: boolean;
  isContactModalOpen: boolean;
  visitorCount: number;
  setShareModalOpen: (open: boolean) => void;
  setAboutModalOpen: (open: boolean) => void;
  setGiftModalOpen: (open: boolean) => void;
  setContactModalOpen: (open: boolean) => void;
  incrementVisitorCount: () => void;

  // Gamification & Badges
  achievements: UserAchievement[];
  checkAchievements: () => void;
}

export const INITIAL_ACHIEVEMENTS: UserAchievement[] = [
  // Track 1: Reader (مسار القراءة)
  {
    id: 'reader_b',
    trackId: 'reader',
    trackTitle: 'مسار إبحار القراءة',
    title: 'القارئ الواعد',
    description: 'إتمام قراءة 10 صفحات مباركة من الكتاب',
    icon: 'menu_book',
    tier: 'bronze',
    level: 1,
    targetValue: 10,
    unlocked: false,
  },
  {
    id: 'reader_s',
    trackId: 'reader',
    trackTitle: 'مسار إبحار القراءة',
    title: 'القارئ السالك',
    description: 'إتمام قراءة 50 صفحة مباركة من الكتاب',
    icon: 'auto_stories',
    tier: 'silver',
    level: 2,
    targetValue: 50,
    unlocked: false,
  },
  {
    id: 'reader_g',
    trackId: 'reader',
    trackTitle: 'مسار إبحار القراءة',
    title: 'القارئ المبحر',
    description: 'إتمام قراءة 150 صفحة مباركة من الكتاب',
    icon: 'menu_book',
    tier: 'gold',
    level: 3,
    targetValue: 150,
    unlocked: false,
  },
  {
    id: 'reader_d',
    trackId: 'reader',
    trackTitle: 'مسار إبحار القراءة',
    title: 'خاتم الرحيق',
    description: 'إتمام قراءة 300+ صفحة مباركة من كتاب الرحيق المختوم',
    icon: 'menu_book',
    tier: 'diamond',
    level: 4,
    targetValue: 300,
    unlocked: false,
  },

  // Track 2: Questions Solved (مسار إتقان الأسئلة)
  {
    id: 'questions_b',
    trackId: 'questions',
    trackTitle: 'مسار الإجابات الصحيحة',
    title: 'الباحث المبتدئ',
    description: 'إجابة 25 سؤالاً إجابة صحيحة موثقة',
    icon: 'quiz',
    tier: 'bronze',
    level: 1,
    targetValue: 25,
    unlocked: false,
  },
  {
    id: 'questions_s',
    trackId: 'questions',
    trackTitle: 'مسار الإجابات الصحيحة',
    title: 'الباحث المتقن',
    description: 'إجابة 75 سؤالاً إجابة صحيحة موثقة',
    icon: 'quiz',
    tier: 'silver',
    level: 2,
    targetValue: 75,
    unlocked: false,
  },
  {
    id: 'questions_g',
    trackId: 'questions',
    trackTitle: 'مسار الإجابات الصحيحة',
    title: 'حافظ السيرة',
    description: 'إجابة 150 سؤالاً إجابة صحيحة موثقة',
    icon: 'workspace_premium',
    tier: 'gold',
    level: 3,
    targetValue: 150,
    unlocked: false,
  },
  {
    id: 'questions_d',
    trackId: 'questions',
    trackTitle: 'مسار الإجابات الصحيحة',
    title: 'علامة السيرة النبوية',
    description: 'إجابة 300+ سؤالاً إجابة صحيحة وموثقة',
    icon: 'military_tech',
    tier: 'diamond',
    level: 4,
    targetValue: 300,
    unlocked: false,
  },

  // Track 3: Streak (مسار سلسلة المواظبة)
  {
    id: 'streak_b',
    trackId: 'streak',
    trackTitle: 'مسار الاستمراية والمواظبة',
    title: 'المواظب الواعد',
    description: 'مواظبة على التعلم لمدة 2 يومين متتاليين',
    icon: 'local_fire_department',
    tier: 'bronze',
    level: 1,
    targetValue: 2,
    unlocked: false,
  },
  {
    id: 'streak_s',
    trackId: 'streak',
    trackTitle: 'مسار الاستمراية والمواظبة',
    title: 'المثابر',
    description: 'مواظبة على التعلم لمدة 5 أيام متتالية',
    icon: 'local_fire_department',
    tier: 'silver',
    level: 2,
    targetValue: 5,
    unlocked: false,
  },
  {
    id: 'streak_g',
    trackId: 'streak',
    trackTitle: 'مسار الاستمراية والمواظبة',
    title: 'المواظب الملتزم',
    description: 'مواظبة على التعلم لمدة 10 أيام متتالية',
    icon: 'local_fire_department',
    tier: 'gold',
    level: 3,
    targetValue: 10,
    unlocked: false,
  },
  {
    id: 'streak_d',
    trackId: 'streak',
    trackTitle: 'مسار الاستمراية والمواظبة',
    title: 'الراسخ في المواظبة',
    description: 'مواظبة على التعلم لمدة 21 يوماً متواصلة',
    icon: 'local_fire_department',
    tier: 'diamond',
    level: 4,
    targetValue: 21,
    unlocked: false,
  },

  // Track 4: Mistakes Clearance (مسار تصحيح الأخطاء)
  {
    id: 'mistakes_b',
    trackId: 'mistakes',
    trackTitle: 'مسار تصحيح الأخطاء',
    title: 'المراجع المبتدئ',
    description: 'تصحيح 3 أسئلة من بنك الأخطاء',
    icon: 'task_alt',
    tier: 'bronze',
    level: 1,
    targetValue: 3,
    unlocked: false,
  },
  {
    id: 'mistakes_s',
    trackId: 'mistakes',
    trackTitle: 'مسار تصحيح الأخطاء',
    title: 'المصوب المتقن',
    description: 'تصحيح 10 أسئلة من بنك الأخطاء',
    icon: 'task_alt',
    tier: 'silver',
    level: 2,
    targetValue: 10,
    unlocked: false,
  },
  {
    id: 'mistakes_g',
    trackId: 'mistakes',
    trackTitle: 'مسار تصحيح الأخطاء',
    title: 'المتقن الحريص',
    description: 'تصحيح 25 سؤالاً من بنك الأخطاء',
    icon: 'task_alt',
    tier: 'gold',
    level: 3,
    targetValue: 25,
    unlocked: false,
  },
  {
    id: 'mistakes_d',
    trackId: 'mistakes',
    trackTitle: 'مسار تصحيح الأخطاء',
    title: 'قاهر الأخطاء',
    description: 'تصحيح 50+ سؤالاً وتطهير بنك الأخطاء بالكامل',
    icon: 'task_alt',
    tier: 'diamond',
    level: 4,
    targetValue: 50,
    unlocked: false,
  },

  // Track 5: Quiz Sessions (مسار جلسات الاختبار)
  {
    id: 'sessions_b',
    trackId: 'sessions',
    trackTitle: 'مسار جلسات الاختبار',
    title: 'المستكشف',
    description: 'إتمام أول جلسة اختبار بنجاح',
    icon: 'award',
    tier: 'bronze',
    level: 1,
    targetValue: 1,
    unlocked: false,
  },
  {
    id: 'sessions_s',
    trackId: 'sessions',
    trackTitle: 'مسار جلسات الاختبار',
    title: 'المتختبر المتمرس',
    description: 'إتمام 5 جلسات اختبار كاملة',
    icon: 'award',
    tier: 'silver',
    level: 2,
    targetValue: 5,
    unlocked: false,
  },
  {
    id: 'sessions_g',
    trackId: 'sessions',
    trackTitle: 'مسار جلسات الاختبار',
    title: 'فارس ساحة الاختبارات',
    description: 'إتمام 15 جلسة اختبار كاملة',
    icon: 'award',
    tier: 'gold',
    level: 3,
    targetValue: 15,
    unlocked: false,
  },
  {
    id: 'sessions_d',
    trackId: 'sessions',
    trackTitle: 'مسار جلسات الاختبار',
    title: 'أسطورة الاختبارات',
    description: 'إتمام 30+ جلسة اختبار كاملة',
    icon: 'award',
    tier: 'diamond',
    level: 4,
    targetValue: 30,
    unlocked: false,
  },

  // Track 6: Accuracy (مسار الدقة والإتقان)
  {
    id: 'accuracy_b',
    trackId: 'accuracy',
    trackTitle: 'مسار دقة التحصيل',
    title: 'الدقيق',
    description: 'تحقيق درجة دقة 60% في جلسة اختبار',
    icon: 'sparkles',
    tier: 'bronze',
    level: 1,
    targetValue: 60,
    unlocked: false,
  },
  {
    id: 'accuracy_s',
    trackId: 'accuracy',
    trackTitle: 'مسار دقة التحصيل',
    title: 'المتفوق',
    description: 'تحقيق درجة دقة 75% في جلسة اختبار',
    icon: 'sparkles',
    tier: 'silver',
    level: 2,
    targetValue: 75,
    unlocked: false,
  },
  {
    id: 'accuracy_g',
    trackId: 'accuracy',
    trackTitle: 'مسار دقة التحصيل',
    title: 'المتقن الفائق',
    description: 'تحقيق درجة دقة 90% في جلسة اختبار',
    icon: 'sparkles',
    tier: 'gold',
    level: 3,
    targetValue: 90,
    unlocked: false,
  },
  {
    id: 'accuracy_d',
    trackId: 'accuracy',
    trackTitle: 'مسار دقة التحصيل',
    title: 'صاحب الدرجة الكاملة',
    description: 'تحقيق نسبة 100% كاملة في جلسة اختبار',
    icon: 'sparkles',
    tier: 'diamond',
    level: 4,
    targetValue: 100,
    unlocked: false,
  },
];

export const getInitialViewFromUrl = (): AppView => {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.replace(/^\//, '').toLowerCase();
  const hash = window.location.hash.replace(/^#/, '').toLowerCase();
  const validViews: AppView[] = ['reader', 'quiz', 'mistakes', 'analytics', 'home'];
  if (validViews.includes(path as AppView)) return path as AppView;
  if (validViews.includes(hash as AppView)) return hash as AppView;
  return 'home';
};

export const updateUrlForView = (view: AppView) => {
  if (typeof window === 'undefined') return;
  const targetPath = view === 'home' ? '/' : `/${view}`;
  if (window.location.pathname !== targetPath) {
    try {
      window.history.pushState({ view }, '', targetPath);
    } catch {
      window.location.hash = view === 'home' ? '' : `#${view}`;
    }
  }
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      quizData: null,
      isLoadingQuestions: false,

      fetchQuestions: async () => {
        if (get().quizData) return;
        set({ isLoadingQuestions: true });
        try {
          const res = await fetch('/questions.json');
          const data: QuizData = await res.json();

          // Auto-sanitize questions and assign 100% unique global IDs (1..1200) across all 4 sections
          for (const secKey of Object.keys(data.sections) as (keyof typeof data.sections)[]) {
            const secId = parseInt(secKey.replace('section_', ''), 10);
            const sec = data.sections[secKey];

            // MCQ questions get global IDs: (secId - 1) * 300 + 1 .. (secId - 1) * 300 + 150
            sec.mcq = sec.mcq.map((q: Question, idx: number) => {
              const globalId = (secId - 1) * 300 + (idx + 1);
              const hasValidOptions = Array.isArray(q.options) && q.options.length > 0;
              const defaultOptions = ["الخيار الأول", "الخيار الثاني", "الخيار الثالث", "الخيار الرابع"];
              const finalOptions = hasValidOptions ? (q.options as string[]) : defaultOptions;

              let cleanQuestion = q.question.replace(/(عبارة|سيرة نبوية|سؤال سيرة نبوية|سؤال توثيقي)\s*(رقم)?\s*\d*\s*(تتعلق بـ|تتعلق بأحداث|في|حول)?/g, '').trim();
              if (!cleanQuestion || cleanQuestion.length < 5) {
                cleanQuestion = `دراسة وتوثيق في أحداث السيرة النبوية العطرة — ${q.section}`;
              }

              return {
                ...q,
                id: globalId,
                originalId: q.id,
                sectionId: secId,
                question: cleanQuestion,
                options: finalOptions,
                correct_answer: q.correct_answer || finalOptions[0],
              };
            });

            // True/False questions get global IDs: (secId - 1) * 300 + 151 .. secId * 300
            sec.true_false = sec.true_false.map((q: Question, idx: number) => {
              const globalId = (secId - 1) * 300 + 150 + (idx + 1);
              const hasValidOptions = Array.isArray(q.options) && q.options.length > 0;
              const defaultOptions = ["صواب", "خطأ"];
              const finalOptions = hasValidOptions ? (q.options as string[]) : defaultOptions;

              let cleanQuestion = q.question.replace(/(عبارة|سيرة نبوية|سؤال سيرة نبوية|سؤال توثيقي)\s*(رقم)?\s*\d*\s*(تتعلق بـ|تتعلق بأحداث|في|حول)?/g, '').trim();
              if (!cleanQuestion || cleanQuestion.length < 5) {
                cleanQuestion = `دراسة وتوثيق في أحداث السيرة النبوية العطرة — ${q.section}`;
              }

              return {
                ...q,
                id: globalId,
                originalId: q.id,
                sectionId: secId,
                question: cleanQuestion,
                options: finalOptions,
                correct_answer: q.correct_answer || "صواب",
              };
            });
          }

          set({ quizData: data, isLoadingQuestions: false });
        } catch (err) {
          console.error('Failed to load questions.json', err);
          set({ isLoadingQuestions: false });
        }
      },

      currentView: getInitialViewFromUrl(),
      setCurrentView: (view) => {
        updateUrlForView(view);
        set({ currentView: view });
      },
      setCurrentViewWithoutUrlUpdate: (view) => set({ currentView: view }),

      activeQuizSection: null,
      activeQuizMode: 'relaxed',
      startQuiz: (sectionId, mode = 'relaxed') => {
        updateUrlForView('quiz');
        set({
          activeQuizSection: sectionId,
          activeQuizMode: mode,
          currentView: 'quiz',
        });
      },

      // Reader
      currentPage: 1,
      totalPages: 520,
      readingTheme: 'paper',
      viewMode: 'single',
      zoomLevel: 1.0,
      bookmarks: [],
      hasResumeBanner: true,
      readingStartDate: new Date().toISOString(),
      readingEndDate: null,
      isBookCompleted: false,
      isCompletionModalOpen: false,

      setCurrentPage: (page) => {
        const state = get();
        const total = state.totalPages || 520;
        const validPage = Math.max(1, Math.min(page, total));

        const nowIso = new Date().toISOString();
        const startDate = state.readingStartDate || nowIso;
        const updates: Partial<AppState> = { currentPage: validPage, readingStartDate: startDate };

        // Check if user reached final page for the first time
        if (validPage >= total && !state.isBookCompleted) {
          const endDate = nowIso;
          updates.isBookCompleted = true;
          updates.readingEndDate = endDate;
          updates.isCompletionModalOpen = true;

          const answered = Object.values(state.answeredQuestions);
          const totalAns = answered.length;
          const correctAns = answered.filter((a) => a.isCorrect).length;
          const acc = totalAns > 0 ? Math.round((correctAns / totalAns) * 100) : 0;

          const startDateFormatted = new Date(startDate).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
          const endDateFormatted = new Date(endDate).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          sendBookCompletionToTelegram({
            startDate: startDateFormatted,
            endDate: endDateFormatted,
            totalPages: total,
            totalAnswered: totalAns,
            correctAnswersCount: correctAns,
            accuracyPercentage: acc,
            streakDays: state.streak,
          });

          syncUserProgressToSupabase({
            current_page: validPage,
            reading_start_date: startDate,
            reading_end_date: endDate,
            is_book_completed: true,
            answered_questions_count: totalAns,
            correct_answers_count: correctAns,
            streak_days: state.streak,
            updated_at: endDate,
          });
        } else {
          const answered = Object.values(state.answeredQuestions);
          const totalAns = answered.length;
          const correctAns = answered.filter((a) => a.isCorrect).length;
          syncUserProgressToSupabase({
            current_page: validPage,
            reading_start_date: startDate,
            reading_end_date: state.readingEndDate || undefined,
            is_book_completed: state.isBookCompleted,
            answered_questions_count: totalAns,
            correct_answers_count: correctAns,
            streak_days: state.streak,
            updated_at: nowIso,
          });
        }

        set(updates);
        get().checkAchievements();
      },
      setTotalPages: (total) => set({ totalPages: total }),
      setReadingTheme: (theme) => set({ readingTheme: theme }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setZoomLevel: (zoom) => set({ zoomLevel: Math.max(0.6, Math.min(2.5, zoom)) }),
      setCompletionModalOpen: (open) => set({ isCompletionModalOpen: open }),

      addBookmark: (pageNumber, title, note) => {
        const newBookmark: Bookmark = {
          id: Date.now().toString(),
          pageNumber,
          title,
          note,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          bookmarks: [newBookmark, ...state.bookmarks.filter((b) => b.pageNumber !== pageNumber)],
        }));
      },
      removeBookmark: (id) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
        }));
      },
      dismissResumeBanner: () => set({ hasResumeBanner: false }),

      // Quiz & Mistakes
      answeredQuestions: {},
      mistakesBank: {},
      correctedMistakesArchive: {},
      quizHistory: [],
      streak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],

      recordAnswer: (question, selectedAnswer) => {
        const isCorrect = selectedAnswer === question.correct_answer;
        const timestamp = new Date().toISOString();

        set((state) => {
          const secId = question.sectionId || Math.ceil(question.id / 300);
          const newAnswered = {
            ...state.answeredQuestions,
            [question.id]: { isCorrect, selectedAnswer, timestamp, sectionId: secId },
          };

          const newMistakes = { ...state.mistakesBank };
          const newArchive = { ...state.correctedMistakesArchive };

          if (!isCorrect) {
            newMistakes[question.id] = question;
          } else {
            if (newMistakes[question.id]) {
              // Archive corrected mistake
              newArchive[question.id] = {
                question: newMistakes[question.id],
                correctedAt: new Date().toLocaleDateString('ar-EG'),
              };
              delete newMistakes[question.id];
            }
          }

          return {
            answeredQuestions: newAnswered,
            mistakesBank: newMistakes,
            correctedMistakesArchive: newArchive,
          };
        });

        get().checkAndUpdateStreak();
        get().checkAchievements();
        return isCorrect;
      },

      removeFromMistakesBank: (questionId) => {
        set((state) => {
          const newMistakes = { ...state.mistakesBank };
          const newArchive = { ...state.correctedMistakesArchive };

          if (newMistakes[questionId]) {
            newArchive[questionId] = {
              question: newMistakes[questionId],
              correctedAt: new Date().toLocaleDateString('ar-EG'),
            };
            delete newMistakes[questionId];
          }

          return {
            mistakesBank: newMistakes,
            correctedMistakesArchive: newArchive,
          };
        });
      },

      clearCorrectedArchive: () => set({ correctedMistakesArchive: {} }),

      saveQuizSession: (entryData) => {
        const newEntry: QuizHistoryEntry = {
          ...entryData,
          id: Date.now().toString(),
          date: new Date().toISOString(),
        };
        set((state) => ({
          quizHistory: [newEntry, ...state.quizHistory],
        }));
        get().checkAchievements();
      },

      checkAndUpdateStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const last = get().lastActiveDate;

        if (last === today) return;

        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (last === yesterday) {
          set((state) => ({ streak: state.streak + 1, lastActiveDate: today }));
        } else {
          set({ streak: 1, lastActiveDate: today });
        }
      },

      // Modals
      isShareModalOpen: false,
      isAboutModalOpen: false,
      isGiftModalOpen: false,
      isContactModalOpen: false,
      visitorCount: 1420,
      setShareModalOpen: (open) => set({ isShareModalOpen: open }),
      setAboutModalOpen: (open) => set({ isAboutModalOpen: open }),
      setGiftModalOpen: (open) => set({ isGiftModalOpen: open }),
      setContactModalOpen: (open) => set({ isContactModalOpen: open }),
      incrementVisitorCount: () => set((state) => ({ visitorCount: state.visitorCount + 1 })),

      // Achievements
      achievements: INITIAL_ACHIEVEMENTS,
      checkAchievements: () => {
        const { currentPage, quizHistory, answeredQuestions, streak, mistakesBank, achievements } = get();

        const correctCount = Object.values(answeredQuestions).filter((a) => a.isCorrect).length;
        const totalSolved = Object.keys(answeredQuestions).length;
        const mistakesCorrected = Math.max(0, totalSolved - Object.keys(mistakesBank).length);
        const totalSessions = quizHistory.length;
        const maxAccuracy = quizHistory.length > 0
          ? Math.max(...quizHistory.map((q) => q.scorePercentage))
          : 0;

        // Ensure all 24 achievements exist even if loaded from older localStorage state
        const currentAchMap = new Map(achievements.map((a) => [a.id, a]));

        const updated = INITIAL_ACHIEVEMENTS.map((initialAch) => {
          const existing = currentAchMap.get(initialAch.id);
          const isUnlocked = existing?.unlocked || false;
          const unlockedAt = existing?.unlockedAt || undefined;

          let currentValue = 0;
          switch (initialAch.trackId) {
            case 'reader':
              currentValue = currentPage;
              break;
            case 'questions':
              currentValue = correctCount;
              break;
            case 'streak':
              currentValue = streak;
              break;
            case 'mistakes':
              currentValue = mistakesCorrected;
              break;
            case 'sessions':
              currentValue = totalSessions;
              break;
            case 'accuracy':
              currentValue = maxAccuracy;
              break;
            default:
              currentValue = 0;
              break;
          }

          const shouldUnlock = isUnlocked || currentValue >= initialAch.targetValue;

          return {
            ...initialAch,
            currentValue,
            unlocked: shouldUnlock,
            unlockedAt: shouldUnlock
              ? unlockedAt || new Date().toLocaleDateString('ar-EG')
              : undefined,
          };
        });

        set({ achievements: updated });
      },
    }),
    {
      name: 'al_raheeq_app_store_v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentPage: state.currentPage,
        readingTheme: state.readingTheme,
        viewMode: state.viewMode,
        zoomLevel: state.zoomLevel,
        bookmarks: state.bookmarks,
        answeredQuestions: state.answeredQuestions,
        mistakesBank: state.mistakesBank,
        correctedMistakesArchive: state.correctedMistakesArchive,
        quizHistory: state.quizHistory,
        streak: state.streak,
        lastActiveDate: state.lastActiveDate,
        achievements: state.achievements,
      }),
    }
  )
);
