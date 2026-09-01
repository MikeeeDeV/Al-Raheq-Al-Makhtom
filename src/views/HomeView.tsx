import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { SECTIONS_INFO } from '../data/sectionsInfo';
import {
  BookOpen,
  HelpCircle,
  Play,
  Flame,
  CheckCircle2,
  Award,
  ArrowLeft,
  Sparkles,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const HomeView: React.FC = () => {
  const {
    currentPage,
    streak,
    answeredQuestions,
    setCurrentView,
    startQuiz,
  } = useAppStore();

  const totalAnswered = Object.keys(answeredQuestions).length;
  const correctCount = Object.values(answeredQuestions).filter((a) => a.isCorrect).length;
  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 20 } },
  };

  return (
    <div className="space-y-6 sm:space-y-10 pb-16 md:pb-10 font-arabic dir-rtl">
      {/* Hero Banner with Animated Ambient Glow */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white p-5 sm:p-10 md:p-12 shadow-m3-3 border border-emerald-500/30"
      >
        {/* Background Ambient Pulsing Circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 max-w-3xl space-y-4 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-[11px] sm:text-xs font-bold text-emerald-200 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>كتاب السيرة النبوية التفاعلي</span>
          </motion.div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight">
            الرحيق المختوم <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200 animate-gradient">
              في سيرة النبي الكريم ﷺ
            </span>
          </h1>

          <p className="text-xs sm:text-base text-emerald-100/90 leading-relaxed font-normal">
            المنصة التفاعلية الأكثر شمولاً وتطوراً لدراسة وقراءة واختبارات السيرة النبوية المباركة، المصممة وفق لغة غوغل ماتيريال 3 لتجربة تعليمية روحانية عصرية.
          </p>

          {/* Action FAB Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setCurrentView('reader')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-full font-bold text-xs sm:text-sm shadow-m3-2 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current shrink-0" />
              <span>{currentPage > 1 ? `متابعة القراءة (ص ${currentPage})` : 'بدء قراءة الكتاب'}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => startQuiz(1, 'relaxed')}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold text-xs sm:text-sm backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-amber-300 shrink-0" />
              <span>اختبار سريع</span>
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* 🌟 Daily Challenge Interactive Hero Banner Widget */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 sm:p-6 bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-teal-500/15 rounded-3xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-m3-1 relative overflow-hidden"
      >
        <div className="flex items-center gap-3 text-right">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 border border-amber-400/40 shadow-xs">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 font-black text-[10px] sm:text-[11px] rounded-full shadow-xs flex items-center gap-1">
                <Zap className="w-3 h-3 fill-slate-950 text-slate-950" />
                <span>تحدي يومي +50 XP</span>
              </span>
              <span className="text-[11px] sm:text-xs text-m3-onSurface-variant font-bold">
                سلسلة التحديات: {useAppStore.getState().dailyChallengeState.streakCount || 0}d
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-m3-onSurface">
              سؤال اليوم التوثيقي في السيرة النبوية
            </h3>
            <p className="text-[11px] sm:text-xs text-m3-onSurface-variant leading-relaxed font-medium">
              جاوب على سؤال اليوم المتجدد لترقية أوسمتك وزيادة نقاط المعرفة بالسيرة النبوية.
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => useAppStore.getState().setDailyChallengeModalOpen(true)}
          className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Zap className="w-3.5 h-3.5 fill-slate-950" />
          <span>
            {useAppStore.getState().dailyChallengeState.date === new Date().toISOString().split('T')[0] &&
            useAppStore.getState().dailyChallengeState.answered
              ? 'عرض نتيجة سؤال اليوم'
              : 'دخول تحدي اليوم الان'}
          </span>
        </motion.button>
      </motion.div>

      {/* Metric Cards (Staggered Animation - Optimized for Mobile) */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        {/* Card 1: Streak */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, scale: 1.02 }}
          className="p-3.5 sm:p-5 rounded-2xl bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 flex items-center gap-2.5 sm:gap-4 shadow-m3-1 transition-all"
        >
          <div className="p-2.5 sm:p-3.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-xl sm:rounded-2xl shrink-0">
            <Flame className="w-5 h-5 sm:w-7 sm:h-7 fill-amber-500" />
          </div>
          <div className="min-w-0">
            <span className="block text-sm sm:text-2xl font-black text-m3-onSurface truncate">
              {streak} أيام
            </span>
            <span className="text-[10px] sm:text-xs text-m3-onSurface-variant font-bold leading-tight block truncate">
              سلسلة المواظبة
            </span>
          </div>
        </motion.div>

        {/* Card 2: Current Page */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, scale: 1.02 }}
          className="p-3.5 sm:p-5 rounded-2xl bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 flex items-center gap-2.5 sm:gap-4 shadow-m3-1 transition-all"
        >
          <div className="p-2.5 sm:p-3.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-xl sm:rounded-2xl shrink-0">
            <BookOpen className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>
          <div className="min-w-0">
            <span className="block text-sm sm:text-2xl font-black text-m3-onSurface truncate">
              صفحة {currentPage}
            </span>
            <span className="text-[10px] sm:text-xs text-m3-onSurface-variant font-bold leading-tight block truncate">
              تقدم القراءة
            </span>
          </div>
        </motion.div>

        {/* Card 3: Solved Questions */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, scale: 1.02 }}
          className="p-3.5 sm:p-5 rounded-2xl bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 flex items-center gap-2.5 sm:gap-4 shadow-m3-1 transition-all"
        >
          <div className="p-2.5 sm:p-3.5 bg-teal-500/15 text-teal-600 dark:text-teal-400 rounded-xl sm:rounded-2xl shrink-0">
            <CheckCircle2 className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>
          <div className="min-w-0">
            <span className="block text-sm sm:text-2xl font-black text-m3-onSurface truncate">
              {correctCount} / 1200
            </span>
            <span className="text-[10px] sm:text-xs text-m3-onSurface-variant font-bold leading-tight block truncate">
              إجابة موثقة
            </span>
          </div>
        </motion.div>

        {/* Card 4: Accuracy Rate */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, scale: 1.02 }}
          className="p-3.5 sm:p-5 rounded-2xl bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 flex items-center gap-2.5 sm:gap-4 shadow-m3-1 transition-all"
        >
          <div className="p-2.5 sm:p-3.5 bg-purple-500/15 text-purple-600 dark:text-purple-400 rounded-xl sm:rounded-2xl shrink-0">
            <Award className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>
          <div className="min-w-0">
            <span className="block text-sm sm:text-2xl font-black text-m3-onSurface truncate">
              {accuracy}%
            </span>
            <span className="text-[10px] sm:text-xs text-m3-onSurface-variant font-bold leading-tight block truncate">
              نسبة الإتقان
            </span>
          </div>
        </motion.div>
      </motion.section>

      {/* 4 Historical Parts Section */}
      <section className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-m3-onSurface tracking-tight">
              أجزاء السيرة النبوية الـ 4
            </h2>
            <p className="text-xs sm:text-sm text-m3-onSurface-variant mt-0.5">
              اختر الجزء التاريخي لقراءة مباحثه أو دخول الاختبارات الخاصة به (300 سؤال لكل جزء)
            </p>
          </div>

          <button
            onClick={() => setCurrentView('quiz')}
            className="hidden sm:flex items-center gap-2 text-sm text-m3-primary dark:text-m3-primary-dark font-bold hover:underline group cursor-pointer shrink-0"
          >
            <span>عرض كل الاختبارات</span>
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </button>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
        >
          {SECTIONS_INFO.map((sec) => (
            <motion.div
              key={sec.id}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="p-5 sm:p-6 rounded-3xl bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 shadow-m3-1 hover:shadow-m3-2 transition-all space-y-4 relative overflow-hidden group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] sm:text-xs font-bold text-m3-primary dark:text-m3-primary-dark uppercase tracking-wider">
                    {sec.subtitle}
                  </span>
                  <h3 className="text-base sm:text-xl font-black text-m3-onSurface group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {sec.title}
                  </h3>
                </div>

                <div className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] sm:text-xs font-bold shrink-0 border border-emerald-500/20">
                  الجزء {sec.id}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-m3-onSurface-variant leading-relaxed line-clamp-2">
                {sec.description}
              </p>

              {/* Card Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setCurrentView('reader')}
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs sm:text-sm transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>قراءة الجزء</span>
                </button>

                <button
                  onClick={() => startQuiz(sec.id, 'relaxed')}
                  className="flex-1 py-2.5 px-4 bg-m3-surface-containerHigh dark:bg-m3-surface-darkContainerHigh hover:bg-emerald-500/10 text-m3-onSurface rounded-2xl font-bold text-xs sm:text-sm transition border border-m3-outline-variant/40 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>اختبار الجزء (300 سؤال)</span>
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default HomeView;
