export type QuestionType = 'multiple_choice' | 'true_false';

export interface Question {
  id: number;
  originalId?: number;
  sectionId?: number;
  section: string; // e.g. "الجزء الأول: من النسب والنشأة حتى الهجرة"
  type: QuestionType;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface SectionBreakdown {
  mcq_per_section: number;
  true_false_per_section: number;
  total_per_section: number;
}

export interface SectionQuestions {
  mcq: Question[];
  true_false: Question[];
}

export interface QuizData {
  book_title: string;
  author: string;
  total_sections: number;
  total_questions_count: number;
  breakdown_per_section: SectionBreakdown;
  sections: {
    section_1: SectionQuestions;
    section_2: SectionQuestions;
    section_3: SectionQuestions;
    section_4: SectionQuestions;
  };
}

export interface SectionInfo {
  id: number;
  key: 'section_1' | 'section_2' | 'section_3' | 'section_4';
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
}

export interface Bookmark {
  id: string;
  pageNumber: number;
  title: string;
  note?: string;
  createdAt: string;
}

export interface QuizHistoryEntry {
  id: string;
  date: string;
  sectionId: number;
  mode: 'relaxed' | 'timed';
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  durationSeconds: number;
}

export interface CorrectedMistakeEntry {
  question: Question;
  correctedAt: string;
}

export type ReaderTheme = 'paper' | 'sepia' | 'night';

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface UserAchievement {
  id: string;
  trackId: string;
  trackTitle: string;
  title: string;
  description: string;
  icon: string;
  tier: BadgeTier;
  level: number; // 1: bronze, 2: silver, 3: gold, 4: diamond
  targetValue: number;
  currentValue?: number;
  unlocked: boolean;
  unlockedAt?: string;
}
