import React, { useState, useEffect } from 'react';
import { useAppStore, getTodayQuestionId } from '../store/useAppStore';
import { Question } from '../types';
import { copyToClipboard } from '../utils/clipboard';
import {
  Flame,
  Sparkles,
  CheckCircle2,
  XCircle,
  Calendar,
  Zap,
  HelpCircle,
  X,
  Award,
  Share2,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DailyChallengeModal: React.FC = () => {
  const {
    isDailyChallengeModalOpen,
    setDailyChallengeModalOpen,
    dailyChallengeState,
    recordDailyChallengeAnswer,
    quizData,
    fetchQuestions,
    isLoadingQuestions,
  } = useAppStore();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayFormatted = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    if (isDailyChallengeModalOpen && !quizData) {
      fetchQuestions();
    }
  }, [isDailyChallengeModalOpen, quizData, fetchQuestions]);

  useEffect(() => {
    if (quizData) {
      const qId = dailyChallengeState.questionId || getTodayQuestionId(todayStr);
      let found: Question | null = null;
      for (const secKey of Object.keys(quizData.sections) as (keyof typeof quizData.sections)[]) {
        const sec = quizData.sections[secKey];
        found = sec.mcq.find((q) => q.id === qId) || sec.true_false.find((q) => q.id === qId) || null;
        if (found) break;
      }

      if (!found && quizData.sections.section_1.mcq.length > 0) {
        found = quizData.sections.section_1.mcq[0];
      }
      setCurrentQuestion(found);
    }
  }, [quizData, dailyChallengeState.questionId, todayStr]);

  if (!isDailyChallengeModalOpen) return null;

  const isAnswered = dailyChallengeState.date === todayStr && dailyChallengeState.answered;
  const isCorrect = dailyChallengeState.isCorrect;

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || isAnswered) return;
    recordDailyChallengeAnswer(selectedOption);
  };

  const handleShare = async () => {
    const text = `🌟 لقد أتممت سؤال اليوم في سيرة النبي الكريم ﷺ على منصة الرحيق المختوم!
سلسلة المواظبة اليومية: ${dailyChallengeState.streakCount || 1} أيام 🔥
جرب تحدي اليوم بنفسك: ${window.location.origin}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'تحدي اليوم - الرحيق المختوم', text });
        return;
      } catch {
        // Fallback below
      }
    }

    const copied = await copyToClipboard(text);
    if (copied) {
      alert('تم نسخ نتيجة التحدي اليومي بنجاح!');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md dir-rtl font-arabic">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-xl bg-slate-900 border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden relative text-white"
        >
          {/* Header Banner */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 border-b border-emerald-500/20 relative">
            <button
              onClick={() => setDailyChallengeModalOpen(false)}
              className="absolute left-4 top-4 p-2 text-slate-400 hover:text-white bg-slate-800/60 rounded-full transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-1">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{todayFormatted}</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span>سؤال اليوم في السيرة</span>
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                </h2>
                <p className="text-xs text-emerald-200/90 mt-0.5 font-medium">
                  سؤال يومي توثيقي متجدد يكسبك +50 نقطة خبرة (XP) ومكافأة مواظبة
                </p>
              </div>

              {/* Streak Badge */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 border border-amber-400/40 rounded-2xl text-amber-300 text-xs font-black shrink-0">
                <Flame className="w-4 h-4 fill-amber-400 animate-bounce-gentle" />
                <span>سلسلة التحدي: {dailyChallengeState.streakCount || 0}d</span>
              </div>
            </div>
          </div>

          {/* Main Question Body */}
          <div className="p-5 sm:p-6 space-y-5">
            {isLoadingQuestions || !currentQuestion ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-300 font-semibold">جاري تحضير سؤال اليوم التوثيقي...</p>
              </div>
            ) : (
              <>
                {/* Section Title Pill */}
                <div className="flex items-center justify-between text-xs">
                  <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold rounded-full">
                    {currentQuestion.section}
                  </span>
                  <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold rounded-full flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-amber-400" />
                    <span>+50 XP مكافأة</span>
                  </span>
                </div>

                {/* Question Text with Elevated Contrast */}
                <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700">
                  <p className="text-base sm:text-lg font-black text-white leading-relaxed">
                    {currentQuestion.question}
                  </p>
                </div>

                {/* Options List */}
                <div className="space-y-2.5">
                  {currentQuestion.options.map((opt, idx) => {
                    const activeSelected = selectedOption === opt;
                    const isCorrectOpt = opt === currentQuestion.correct_answer;
                    const isUserSelected =
                      (isAnswered ? dailyChallengeState.selectedAnswer : selectedOption) === opt;

                    let optBg = 'bg-slate-800/80 border-slate-700 hover:bg-slate-750 text-slate-100 font-medium';

                    if (isAnswered) {
                      if (isCorrectOpt) {
                        optBg = 'bg-emerald-950/90 border-emerald-400 text-emerald-100 font-black shadow-md ring-1 ring-emerald-400/50';
                      } else if (isUserSelected && !isCorrectOpt) {
                        optBg = 'bg-rose-950/90 border-rose-400 text-rose-100 font-black';
                      } else {
                        optBg = 'bg-slate-800/30 border-slate-800 text-slate-400 opacity-60';
                      }
                    } else if (activeSelected) {
                      optBg = 'bg-emerald-900/80 border-emerald-400 text-emerald-100 font-black shadow-md ring-1 ring-emerald-400/50';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(opt)}
                        className={`w-full p-3.5 rounded-2xl border text-right text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${optBg}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-600 text-amber-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-slate-100">{opt}</span>
                        </div>

                        {isAnswered && isCorrectOpt && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        )}
                        {isAnswered && isUserSelected && !isCorrectOpt && (
                          <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Card if Answered */}
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`p-4 rounded-2xl border space-y-2 text-xs leading-relaxed ${
                      isCorrect
                        ? 'bg-emerald-950/90 border-emerald-400/60 text-emerald-100'
                        : 'bg-rose-950/90 border-rose-400/60 text-rose-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-black text-sm">
                      {isCorrect ? (
                        <>
                          <Award className="w-5 h-5 text-amber-300 shrink-0" />
                          <span className="text-emerald-300">إجابة صحيحة موثقة! +50 XP 🌟</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                          <span className="text-rose-300">إجابة غير دقيقة</span>
                        </>
                      )}
                    </div>
                    {currentQuestion.explanation && (
                      <p className="text-slate-200 pt-1.5 border-t border-slate-700/60 font-medium leading-relaxed">
                        <strong className="text-amber-300 font-bold">التوثيق التاريخي: </strong>
                        {currentQuestion.explanation}
                      </p>
                    )}
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
            {!isAnswered ? (
              <button
                disabled={!selectedOption || isLoadingQuestions}
                onClick={handleSubmitAnswer}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>اعتماد الإجابة وكسب المكافأة</span>
              </button>
            ) : (
              <div className="flex items-center justify-between w-full gap-2">
                <button
                  onClick={handleShare}
                  className="px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-2 transition cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>مشاركة النتيجة</span>
                </button>

                <button
                  onClick={() => setDailyChallengeModalOpen(false)}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DailyChallengeModal;
