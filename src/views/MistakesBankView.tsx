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
  Sparkles,
  Archive,
  RotateCcw,
  Search,
  BookOpen,
  Check,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MistakesBankView: React.FC = () => {
  const {
    mistakesBank,
    correctedMistakesArchive,
    recordAnswer,
    removeFromMistakesBank,
    clearCorrectedArchive,
    setCurrentView,
  } = useAppStore();

  const mistakesList = Object.values(mistakesBank);
  const correctedList = Object.values(correctedMistakesArchive);

  const [activeTab, setActiveTab] = useState<'active' | 'archive'>('active');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [justCorrected, setJustCorrected] = useState<boolean>(false);
  const [archiveSearchQuery, setArchiveSearchQuery] = useState<string>('');

  // Guard against index out of bounds
  const safeIndex = Math.min(currentIndex, Math.max(0, mistakesList.length - 1));
  const currentQuestion = mistakesList[safeIndex];

  const handleOptionClick = (option: string) => {
    if (selectedOption !== null || !currentQuestion) return;

    setSelectedOption(option);
    const isCorrect = recordAnswer(currentQuestion, option);
    setShowExplanation(true);

    if (isCorrect) {
      setJustCorrected(true);
      // Safely queue archiving & removal from active mistakes bank
      setTimeout(() => {
        removeFromMistakesBank(currentQuestion.id);
        setJustCorrected(false);
        setSelectedOption(null);
        setShowExplanation(false);
      }, 1200);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setJustCorrected(false);
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
      setJustCorrected(false);
      setCurrentIndex(safeIndex - 1);
    }
  };

  const filteredArchive = correctedList.filter((item) => {
    if (!archiveSearchQuery.trim()) return true;
    const qText = item.question.question.toLowerCase();
    const secText = item.question.section.toLowerCase();
    const query = archiveSearchQuery.toLowerCase();
    return qText.includes(query) || secText.includes(query);
  });

  return (
    <div className="space-y-8 pb-16 font-arabic" dir="rtl">
      {/* Executive Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-amber-950/80 via-slate-900 to-emerald-950/80 border border-amber-500/30 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3.5 z-10">
          <div className="p-3 bg-amber-500 text-slate-950 rounded-2xl shadow-m3-1 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">منظومة مراجعة الأخطاء والأرشيف</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5 font-light">
              تصلح المفاهيم وتؤرشف جميع الأسئلة التي تغلبت عليها للرجوع إليها مستقبلاً
            </p>
          </div>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center p-1 bg-slate-900/80 border border-slate-700/60 rounded-full z-10 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'active'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>أسئلة للمراجعة ({mistakesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('archive')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'archive'
                ? 'bg-emerald-500 text-slate-950 shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>أرشيف المصححات ({correctedList.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🚨 TAB 1: ACTIVE MISTAKES ARENA */}
      {/* ========================================================================= */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          {mistakesList.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center p-12 md:p-16 text-center space-y-5 bg-m3-surface-container dark:bg-m3-surface-darkContainer rounded-3xl border border-m3-outline-variant/30 my-4 shadow-m3-2"
            >
              <div className="w-20 h-20 bg-emerald-500/15 text-emerald-600 rounded-full flex items-center justify-center shadow-m3-1">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2 max-w-md">
                <h2 className="text-2xl font-black text-m3-onSurface flex items-center justify-center gap-2">
                  <span>بنك المراجعة خالي تماماً!</span>
                  <Sparkles className="w-6 h-6 text-amber-500 animate-bounce-gentle" />
                </h2>
                <p className="text-sm text-m3-onSurface-variant leading-relaxed">
                  ممتاز جداً! ليس لديك أي أسئلة بحاجة مراجعة حالياً. جميع أخطائك السابقة تم تصحيحها وحفظها في الأرشيف.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {correctedList.length > 0 && (
                  <button
                    onClick={() => setActiveTab('archive')}
                    className="px-6 py-2.5 bg-emerald-700 text-white rounded-full font-bold text-xs shadow-sm hover:bg-emerald-600 transition flex items-center gap-2 cursor-pointer"
                  >
                    <Archive className="w-4 h-4" />
                    <span>تصفح أرشيف المصححات ({correctedList.length})</span>
                  </button>
                )}

                <button
                  onClick={() => setCurrentView('quiz')}
                  className="px-6 py-2.5 bg-m3-primary text-white rounded-full font-bold text-xs shadow-m3-2 hover:bg-m3-primary/90 transition cursor-pointer"
                >
                  الانتقال لساحة الاختبارات الرئيسية
                </button>
              </div>
            </motion.div>
          ) : (
            currentQuestion && (
              <motion.div
                key={`mistake-q-${safeIndex}-${currentQuestion.id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-m3-3 space-y-6 relative overflow-hidden"
              >
                {/* Corrected Toast Banner */}
                <AnimatePresence>
                  {justCorrected && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-between shadow-xl border border-emerald-400/40"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
                        <span>أحسنت! تم تصحيح السؤال ونقله إلى "أرشيف الأسئلة المصححة" بنجاح 🌟</span>
                      </div>
                      <Check className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between text-xs text-m3-onSurface-variant font-semibold">
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-800 dark:text-amber-200 rounded-full font-bold">
                    سؤال مراجعة {safeIndex + 1} من {mistakesList.length}
                  </span>

                  <span className="text-m3-primary font-bold">{currentQuestion.section}</span>
                </div>

                <h2 className="text-lg md:text-2xl font-bold text-m3-onSurface leading-snug">
                  {currentQuestion.question}
                </h2>

                {/* Options List */}
                <div className="grid grid-cols-1 gap-3 pt-2">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOption === option;
                    const isCorrectOption = option === currentQuestion.correct_answer;
                    const hasAnswered = selectedOption !== null;

                    let cardBg = 'bg-m3-surface dark:bg-m3-surface-darkDim border-m3-outline-variant/30 hover:border-m3-primary/50';
                    let textColor = 'text-m3-onSurface';
                    let badgeIcon = null;

                    let animClass = '';
                    if (hasAnswered) {
                      if (isCorrectOption) {
                        cardBg = 'bg-emerald-500/15 border-emerald-600 text-emerald-900 dark:text-emerald-200 font-bold';
                        badgeIcon = <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-bounce-gentle" />;
                        animClass = 'animate-pulse-glow';
                      } else if (isSelected) {
                        cardBg = 'bg-red-500/15 border-red-600 text-red-900 dark:text-red-200 font-bold';
                        badgeIcon = <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
                        animClass = 'animate-shake';
                      } else {
                        cardBg = 'opacity-40 bg-m3-surface border-transparent';
                      }
                    }

                    return (
                      <motion.button
                        key={idx}
                        whileHover={!hasAnswered ? { scale: 1.015, x: -4 } : {}}
                        whileTap={!hasAnswered ? { scale: 0.985 } : {}}
                        disabled={hasAnswered}
                        onClick={() => handleOptionClick(option)}
                        className={`w-full p-4 rounded-2xl border text-right transition-all flex items-center justify-between gap-4 ${cardBg} ${textColor} ${animClass} cursor-pointer`}
                      >
                        <span className="text-sm md:text-base font-medium">{option}</span>
                        {badgeIcon}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Explanation */}
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
                          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition cursor-pointer"
                        >
                          <Archive className="w-4 h-4" />
                          <span>نقل يدوي إلى الأرشيف</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Bar */}
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
            )
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📦 TAB 2: CORRECTED MISTAKES ARCHIVE */}
      {/* ========================================================================= */}
      {activeTab === 'archive' && (
        <div className="space-y-6">
          {/* Archive Search and Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-m3-surface-container dark:bg-m3-surface-darkContainer p-4 rounded-3xl border border-m3-outline-variant/30">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={archiveSearchQuery}
                onChange={(e) => setArchiveSearchQuery(e.target.value)}
                placeholder="ابحث في الأسئلة المصححة..."
                className="w-full pl-4 pr-10 py-2 bg-m3-surface dark:bg-m3-surface-darkDim border border-m3-outline-variant/30 rounded-2xl text-xs text-m3-onSurface focus:outline-hidden focus:border-emerald-500"
              />
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-m3-onSurface-variant" />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 rounded-full">
                إجمالي المصححات: {correctedList.length} سؤال
              </span>

              {correctedList.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm('هل أنت تأكد من إخلاء أرشيف المصححات؟')) {
                      clearCorrectedArchive();
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                  title="مسح الأرشيف"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              )}
            </div>
          </div>

          {filteredArchive.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 bg-m3-surface-container dark:bg-m3-surface-darkContainer rounded-3xl border border-m3-outline-variant/30">
              <Archive className="w-12 h-12 text-slate-500 opacity-60" />
              <p className="text-sm font-bold text-m3-onSurface">
                {archiveSearchQuery ? 'لا توجد نتائج تطابق البحث' : 'أرشيف المصححات خالي حالياً'}
              </p>
              <p className="text-xs text-m3-onSurface-variant max-w-sm">
                عندما تجيب بشكل صحيح على الأخطاء السابقة، سيتم إدراجها آلياً هنا لحفظ إنجازك.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArchive.map((entry, idx) => (
                <motion.div
                  key={`archived-q-${entry.question.id}-${idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-emerald-500/30 rounded-3xl space-y-3 shadow-m3-1 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-full">
                        {entry.question.section}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        تم التصحيح: {entry.correctedAt}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-m3-onSurface leading-snug">
                      {entry.question.question}
                    </h3>

                    {/* Correct Answer Box */}
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">الإجابة الصحيحة:</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-300">
                          {entry.question.correct_answer}
                        </span>
                      </div>
                    </div>

                    {/* Explanation */}
                    <p className="text-xs text-m3-onSurface-variant line-clamp-3 leading-relaxed pt-1">
                      {entry.question.explanation}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MistakesBankView;
