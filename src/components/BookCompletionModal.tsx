import React, { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  Trophy,
  Calendar,
  CheckCircle2,
  BookOpen,
  Award,
  Sparkles,
  X,
  Share2,
  BarChart3,
  HeartHandshake,
} from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export const BookCompletionModal: React.FC = () => {
  const {
    isCompletionModalOpen,
    setCompletionModalOpen,
    readingStartDate,
    readingEndDate,
    totalPages,
    answeredQuestions,
    streak,
    setShareModalOpen,
  } = useAppStore();

  useEffect(() => {
    if (isCompletionModalOpen) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });
    }
  }, [isCompletionModalOpen]);

  if (!isCompletionModalOpen) return null;

  const answered = Object.values(answeredQuestions);
  const totalAnswered = answered.length;
  const correctCount = answered.filter((a) => a.isCorrect).length;
  const accuracyPercentage = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  const startDateFormatted = readingStartDate
    ? new Date(readingStartDate).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'اليوم';

  const endDateFormatted = readingEndDate
    ? new Date(readingEndDate).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-arabic dir-rtl">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setCompletionModalOpen(false)}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-6 z-10 my-auto overflow-hidden text-center"
      >
        {/* Glow Orbs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setCompletionModalOpen(false)}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Trophy Header Badge */}
        <div className="pt-2 space-y-3">
          <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-emerald-500 rounded-3xl p-0.5 mx-auto shadow-xl animate-bounce-gentle">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-amber-400">
              <Trophy className="w-10 h-10" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-2">
              <span>مُبارَك تمَام القِراءة!</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </h2>
            <p className="text-xs sm:text-sm text-emerald-400 font-semibold">
              أتممت قراءة كتاب الرحيق المختوم كاملاً في سيرة النبي الكريم ﷺ
            </p>
          </div>
        </div>

        {/* Start & End Date Details */}
        <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-2xl text-right">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">تاريخ البداية:</span>
              <span className="text-xs font-bold text-slate-200">{startDateFormatted}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">تاريخ الإتمام:</span>
              <span className="text-xs font-bold text-slate-200">{endDateFormatted}</span>
            </div>
          </div>
        </div>

        {/* Detailed Quiz Statistics Grid */}
        <div className="space-y-2 text-right">
          <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>حصيلة استيعابك وأجوبتك في الاختبارات:</span>
          </h4>

          <div className="grid grid-cols-3 gap-2.5">
            {/* Total Answered */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 block">الأسئلة المجابة</span>
              <span className="text-lg font-black text-white">{totalAnswered}</span>
              <span className="text-[10px] text-slate-500 block">سؤال</span>
            </div>

            {/* Correct Count */}
            <div className="p-3 bg-slate-950/80 border border-emerald-500/30 rounded-2xl text-center">
              <span className="text-[10px] text-emerald-400 block">الإجابات الصحيحة</span>
              <span className="text-lg font-black text-emerald-300">{correctCount}</span>
              <span className="text-[10px] text-emerald-500/80 block">صحيح</span>
            </div>

            {/* Accuracy % */}
            <div className="p-3 bg-slate-950/80 border border-amber-500/30 rounded-2xl text-center">
              <span className="text-[10px] text-amber-400 block">نسبة الإتقان</span>
              <span className="text-lg font-black text-amber-300">{accuracyPercentage}%</span>
              <span className="text-[10px] text-amber-500/80 block">دقة عامة</span>
            </div>
          </div>
        </div>

        {/* Telemetry Confirmation Notice */}
        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-300 flex items-center justify-center gap-2">
          <HeartHandshake className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>تم إرسال تقرير الختام وتفاصيلك لمطور المنصة للابتهاج بإنجازك ✨</span>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              setCompletionModalOpen(false);
              setShareModalOpen(true);
            }}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>مشاركة بطاقة الإنجاز</span>
          </button>

          <button
            onClick={() => setCompletionModalOpen(false)}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            إغلاق النافذة
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default BookCompletionModal;
