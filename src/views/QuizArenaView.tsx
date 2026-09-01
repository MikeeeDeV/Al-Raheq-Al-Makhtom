import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Question, QuestionType } from '../types';
import { SECTIONS_INFO } from '../data/sectionsInfo';
import {
  HelpCircle,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
  Info,
  Trophy,
  ArrowRight,
  Loader2,
  Share2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export const QuizArenaView: React.FC = () => {
  const {
    quizData,
    fetchQuestions,
    isLoadingQuestions,
    activeQuizSection,
    activeQuizMode,
    startQuiz,
    recordAnswer,
    saveQuizSession,
    setShareModalOpen,
  } = useAppStore();

  const [selectedSectionId, setSelectedSectionId] = useState<number>(activeQuizSection || 1);
  const [quizMode, setQuizMode] = useState<'relaxed' | 'timed'>(activeQuizMode || 'relaxed');
  const [filterType, setFilterType] = useState<'all' | QuestionType>('all');

  const [questionsList, setQuestionsList] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [sessionScore, setSessionScore] = useState<number>(0);
  const [isSessionComplete, setIsSessionComplete] = useState<boolean>(false);

  // Timer for Timed Challenge Mode
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [sessionStartTime] = useState<number>(Date.now());

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Load questions for selected section and filter
  useEffect(() => {
    if (!quizData) return;

    const sectionKey = `section_${selectedSectionId}` as keyof typeof quizData.sections;
    const secData = quizData.sections[sectionKey];

    if (!secData) return;

    let combined: Question[] = [];
    if (filterType === 'all') {
      combined = [...secData.mcq, ...secData.true_false];
    } else if (filterType === 'multiple_choice') {
      combined = [...secData.mcq];
    } else if (filterType === 'true_false') {
      combined = [...secData.true_false];
    }

    // Shuffle questions for fresh experience
    const shuffled = [...combined].sort(() => 0.5 - Math.random());
    setQuestionsList(shuffled);
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setSessionScore(0);
    setIsSessionComplete(false);
    setTimeLeft(30);
  }, [quizData, selectedSectionId, filterType]);

  // Timer tick for timed mode
  useEffect(() => {
    if (quizMode !== 'timed' || isSessionComplete || !questionsList.length || selectedOption !== null) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up for current question
          handleOptionClick('انتهى الوقت');
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizMode, isSessionComplete, questionsList, selectedOption, currentIndex]);

  const currentQuestion = questionsList[currentIndex];

  const handleOptionClick = (option: string) => {
    if (selectedOption !== null || !currentQuestion) return;

    setSelectedOption(option);
    const isCorrect = recordAnswer(currentQuestion, option);

    if (isCorrect) {
      setSessionScore((prev) => prev + 1);
    }

    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setTimeLeft(30);

    if (currentIndex + 1 < Math.min(30, questionsList.length)) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Complete Session
      setIsSessionComplete(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });

      const totalQs = Math.min(30, questionsList.length);
      const scorePct = Math.round((sessionScore / totalQs) * 100);
      const duration = Math.round((Date.now() - sessionStartTime) / 1000);

      saveQuizSession({
        sectionId: selectedSectionId,
        mode: quizMode,
        totalQuestions: totalQs,
        correctAnswers: sessionScore,
        scorePercentage: scorePct,
        durationSeconds: duration,
      });
    }
  };

  if (isLoadingQuestions || !quizData) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <Loader2 className="w-12 h-12 text-m3-primary animate-spin mb-4" />
        <p className="text-lg font-bold text-m3-onSurface">جاري تهيئة بنك الـ 1200 سؤال...</p>
        <span className="text-xs text-m3-onSurface-variant mt-1">الرحيق المختوم في سيرة النبي الكريم ﷺ</span>
      </div>
    );
  }

  const currentSectionInfo = SECTIONS_INFO.find((s) => s.id === selectedSectionId);

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-m3-onSurface tracking-tight">
            منظومة الاختبارات التفاعلية
          </h1>
          <p className="text-xs sm:text-sm text-m3-onSurface-variant mt-1">
            1,200 سؤال موثق وموزع على أجزاء السيرة النبوية المباركة (MCQ + صواب وخطأ)
          </p>
        </div>

        {/* Timed vs Relaxed Segmented Control */}
        <div className="flex items-center p-1.5 bg-m3-surface-container dark:bg-m3-surface-darkContainer rounded-full border border-m3-outline-variant/30 self-start md:self-auto">
          <button
            onClick={() => setQuizMode('relaxed')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition ${
              quizMode === 'relaxed'
                ? 'bg-m3-primary-container text-m3-primary-onContainer shadow-sm'
                : 'text-m3-onSurface-variant hover:text-m3-onSurface'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>تدارس واسترخاء</span>
          </button>

          <button
            onClick={() => setQuizMode('timed')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition ${
              quizMode === 'timed'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-m3-onSurface-variant hover:text-m3-onSurface'
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>تحدي الوقت</span>
          </button>
        </div>
      </div>

      {/* Section Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SECTIONS_INFO.map((sec) => {
          const isSelected = sec.id === selectedSectionId;
          return (
            <button
              key={sec.id}
              onClick={() => setSelectedSectionId(sec.id)}
              className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'bg-m3-primary-container/80 dark:bg-m3-primary-containerDark border-m3-primary text-m3-primary-onContainer shadow-m3-2 font-bold scale-[1.02]'
                  : 'bg-m3-surface-container/40 dark:bg-m3-surface-darkContainer border-m3-outline-variant/20 hover:border-m3-primary/40 text-m3-onSurface'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2 py-0.5 bg-black/10 dark:bg-white/10 rounded-full">
                  الجزء {sec.id}
                </span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-m3-primary" />}
              </div>
              <span className="text-xs sm:text-sm font-bold line-clamp-1">{sec.title}</span>
            </button>
          );
        })}
      </div>

      {/* Question Type Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-m3-surface-dim dark:bg-m3-surface-darkContainer p-3 rounded-2xl border border-m3-outline-variant/20">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-m3-onSurface-variant" />
          <span className="text-xs font-semibold text-m3-onSurface-variant">نوع الأسئلة:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                filterType === 'all'
                  ? 'bg-m3-primary text-white font-bold'
                  : 'bg-m3-surface-container text-m3-onSurface-variant hover:bg-m3-surface-high'
              }`}
            >
              الكل (300)
            </button>
            <button
              onClick={() => setFilterType('multiple_choice')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                filterType === 'multiple_choice'
                  ? 'bg-m3-primary text-white font-bold'
                  : 'bg-m3-surface-container text-m3-onSurface-variant hover:bg-m3-surface-high'
              }`}
            >
              متعدد الاختيارات (150)
            </button>
            <button
              onClick={() => setFilterType('true_false')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                filterType === 'true_false'
                  ? 'bg-m3-primary text-white font-bold'
                  : 'bg-m3-surface-container text-m3-onSurface-variant hover:bg-m3-surface-high'
              }`}
            >
              صواب وخطأ (150)
            </button>
          </div>
        </div>

        {/* Timed Mode Counter */}
        {quizMode === 'timed' && !isSessionComplete && (
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>المتبقي: {timeLeft} ثانية</span>
          </div>
        )}
      </div>

      {/* Main Question Arena Card */}
      {!isSessionComplete && currentQuestion && (
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-m3-3 space-y-6 relative overflow-hidden"
        >
          {/* Top Progress & Details */}
          <div className="flex items-center justify-between text-xs text-m3-onSurface-variant font-semibold">
            <span className="px-3 py-1 bg-m3-primary-container text-m3-primary-onContainer rounded-full">
              السؤال {currentIndex + 1} من {Math.min(30, questionsList.length)}
            </span>

            <span className="text-m3-secondary font-bold">
              {currentQuestion.type === 'multiple_choice' ? 'اختيار من متعدد' : 'صواب / خطأ'}
            </span>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <h2 className="text-lg md:text-2xl font-bold text-m3-onSurface leading-snug">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Interactive Options Cards */}
          <div className="grid grid-cols-1 gap-3 pt-2">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrectOption = option === currentQuestion.correct_answer;
              const hasAnswered = selectedOption !== null;

              let cardBg = 'bg-m3-surface dark:bg-m3-surface-darkDim border-m3-outline-variant/30 hover:border-m3-primary/50';
              let textColor = 'text-m3-onSurface';
              let badgeIcon = null;

              if (hasAnswered) {
                if (isCorrectOption) {
                  cardBg = 'bg-emerald-500/15 border-emerald-600 text-emerald-900 dark:text-emerald-200 font-bold';
                  badgeIcon = <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
                } else if (isSelected) {
                  cardBg = 'bg-red-500/15 border-red-600 text-red-900 dark:text-red-200 font-bold';
                  badgeIcon = <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
                } else {
                  cardBg = 'opacity-40 bg-m3-surface border-transparent';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={hasAnswered}
                  onClick={() => handleOptionClick(option)}
                  className={`w-full p-4 rounded-2xl border text-right transition-all flex items-center justify-between gap-4 ${cardBg} ${textColor} active:scale-[0.99]`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-m3-surface-container dark:bg-m3-surface-darkContainer text-m3-onSurface font-bold text-xs flex items-center justify-center border border-m3-outline-variant/30">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm md:text-base font-medium">{option}</span>
                  </div>
                  {badgeIcon}
                </button>
              );
            })}
          </div>

          {/* Explanation Bottom Modal Sheet Trigger */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-5 bg-m3-primary-container/40 dark:bg-m3-primary-containerDark/40 rounded-2xl border border-m3-primary/30 space-y-3"
              >
                <div className="flex items-center gap-2 text-m3-primary dark:text-m3-primary-dark font-bold text-sm">
                  <Info className="w-4 h-4" />
                  <span>توضيح وإضاءة من سيرة الرحيق المختوم:</span>
                </div>
                <p className="text-sm text-m3-onSurface leading-relaxed">
                  {currentQuestion.explanation}
                </p>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-2 px-6 py-2.5 bg-m3-primary text-white hover:bg-m3-primary/90 font-bold text-sm rounded-full shadow-m3-2 transition active:scale-95"
                  >
                    <span>السؤال التالي</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Session Result Summary Modal / Screen */}
      {isSessionComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-3xl p-8 shadow-m3-4 text-center space-y-6 max-w-2xl mx-auto"
        >
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-m3-2">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-m3-onSurface">
              بارك الله فيك! أكملت الجلسة بنجاح 🎉
            </h2>
            <p className="text-sm text-m3-onSurface-variant">
              اختبار {currentSectionInfo?.title}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-m3-surface rounded-2xl border border-m3-outline-variant/20">
              <span className="block text-2xl font-black text-emerald-600">{sessionScore}</span>
              <span className="text-xs text-m3-onSurface-variant">إجابة صحيحة</span>
            </div>
            <div className="p-4 bg-m3-surface rounded-2xl border border-m3-outline-variant/20">
              <span className="block text-2xl font-black text-m3-primary">
                {Math.round((sessionScore / Math.min(30, questionsList.length)) * 100)}%
              </span>
              <span className="text-xs text-m3-onSurface-variant">درجة الإتقان</span>
            </div>
            <div className="col-span-2 sm:col-span-1 p-4 bg-m3-surface rounded-2xl border border-m3-outline-variant/20">
              <span className="block text-2xl font-black text-amber-600">
                {Math.min(30, questionsList.length)}
              </span>
              <span className="text-xs text-m3-onSurface-variant">إجمالي الأسئلة</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setIsSessionComplete(false);
                setCurrentIndex(0);
                setSessionScore(0);
                setSelectedOption(null);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-m3-primary text-white rounded-full font-bold text-sm shadow-m3-2 hover:bg-m3-primary/90 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة الاختبار</span>
            </button>

            <button
              onClick={() => setShareModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-m3-primary-container text-m3-primary-onContainer rounded-full font-bold text-sm hover:bg-m3-primary/20 transition"
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة النتيجة</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
