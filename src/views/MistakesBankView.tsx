import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Trash2,
  Info,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MistakesBankView: React.FC = () => {
  const { mistakesBank, recordAnswer, removeFromMistakesBank, setCurrentView } = useAppStore();

  const mistakesList = Object.values(mistakesBank);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Guard against index out of bounds
  const safeIndex = Math.min(currentIndex, Math.max(0, mistakesList.length - 1));
  const currentQuestion = mistakesList[safeIndex];

  const handleOptionClick = (option: string) => {
    if (selectedOption !== null || !currentQuestion) return;

    setSelectedOption(option);
    const isCorrect = recordAnswer(currentQuestion, option);
    setShowExplanation(true);

    if (isCorrect) {
      // Safely queue removal from mistakes bank
      setTimeout(() => {
        removeFromMistakesBank(currentQuestion.id);
      }, 800);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (safeIndex + 1 < mistakesList.length) {
      setCurrentIndex(safeIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (safeIndex > 0) {
      setSelectedOption(null);
      setShowExplanation(false);
      setCurrentIndex(safeIndex - 1);
    }
  };

  if (mistakesList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 md:p-16 text-center space-y-5 bg-m3-surface-container dark:bg-m3-surface-darkContainer rounded-3xl border border-m3-outline-variant/30 my-8">
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center shadow-m3-1">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2 max-w-md">
          <h2 className="text-2xl font-black text-m3-onSurface">بنك المراجعة خالي تماماً! 🎉</h2>
          <p className="text-sm text-m3-onSurface-variant leading-relaxed">
            ممتاز جداً! ليس لديك أي أسئلة غير مأسورة حالياً. جميع إجاباتك السابقة موثقة وصحيحة.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('quiz')}
          className="px-7 py-3 bg-m3-primary text-white rounded-full font-bold text-sm shadow-m3-2 hover:bg-m3-primary/90 transition cursor-pointer"
        >
          الانتقال لساحة الاختبارات الرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/30 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-m3-1">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-m3-onSurface">بنك المراجعة الذكي</h1>
            <p className="text-xs text-m3-onSurface-variant mt-0.5">
              يعزل تلقائياً الأسئلة التي أخطأت بها لإعادتها وتثبيت حفظ وفهم السيرة
            </p>
          </div>
        </div>

        <span className="px-4 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-full">
          {mistakesList.length} سؤال يتطلب المراجعة
        </span>
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <motion.div
          key={`mistake-q-${safeIndex}-${currentQuestion.id}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-m3-3 space-y-6"
        >
          <div className="flex items-center justify-between text-xs text-m3-onSurface-variant font-semibold">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-800 dark:text-amber-200 rounded-full">
              سؤال مراجعة {safeIndex + 1} من {mistakesList.length}
            </span>

            <span className="text-m3-primary font-bold">{currentQuestion.section}</span>
          </div>

          <h2 className="text-lg md:text-2xl font-bold text-m3-onSurface leading-snug">
            {currentQuestion.question}
          </h2>

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
                  badgeIcon = <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
                } else if (isSelected) {
                  cardBg = 'bg-red-500/15 border-red-600 text-red-900 dark:text-red-200 font-bold';
                  badgeIcon = <XCircle className="w-5 h-5 text-red-600" />;
                } else {
                  cardBg = 'opacity-40 bg-m3-surface border-transparent';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={hasAnswered}
                  onClick={() => handleOptionClick(option)}
                  className={`w-full p-4 rounded-2xl border text-right transition-all flex items-center justify-between gap-4 ${cardBg} ${textColor} cursor-pointer`}
                >
                  <span className="text-sm md:text-base font-medium">{option}</span>
                  {badgeIcon}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-m3-surface rounded-2xl border border-m3-outline-variant/20 space-y-3"
              >
                <div className="flex items-center gap-2 text-m3-primary font-bold text-sm">
                  <Info className="w-4 h-4" />
                  <span>الشرح والتصويب:</span>
                </div>
                <p className="text-sm text-m3-onSurface leading-relaxed">
                  {currentQuestion.explanation}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => removeFromMistakesBank(currentQuestion.id)}
                    className="flex items-center gap-1.5 text-xs text-red-500 hover:underline cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>إزالة من بنك الأخطاء</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dedicated Navigation Bar */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-m3-outline-variant/20">
            <button
              onClick={handlePrev}
              disabled={safeIndex === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-m3-surface-dim dark:bg-m3-surface-darkContainer text-m3-onSurface hover:bg-m3-surface-high rounded-full font-semibold text-sm transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
              <span>السؤال السابق</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-7 py-3 bg-m3-primary text-white hover:bg-m3-primary/90 font-bold text-sm rounded-full shadow-m3-2 transition active:scale-95 cursor-pointer"
            >
              <span>السؤال التالي</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
