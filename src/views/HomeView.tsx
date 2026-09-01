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
  Star,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const HomeView: React.FC = () => {
  const {
    currentPage,
    streak,
    answeredQuestions,
    setCurrentView,
    startQuiz,
    setShareModalOpen,
  } = useAppStore();

  const totalAnswered = Object.keys(answeredQuestions).length;
  const correctCount = Object.values(answeredQuestions).filter((a) => a.isCorrect).length;
  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  return (
    <div className="space-y-10 pb-10">
      {/* Hero Banner with M3 Tonal Palette */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white p-6 sm:p-10 md:p-12 shadow-m3-3 border border-emerald-500/20">
        {/* Background Ambient Blur Circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-xs font-semibold text-emerald-200">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>كتاب السيرة النبوية الفائز بالمركز الأول</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight">
            الرحيق المختوم <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200">
              في سيرة النبي الكريم ﷺ
            </span>
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-light">
            مرحباً بك في المنصة التفاعلية الأكثر شمولاً وتطوراً لدراسة وقراءة واختبارات السيرة النبوية المباركة، المصممة وفق لغة غوغل ماتيريال 3 لتجربة تعليمية روحانية عصرية.
          </p>

          {/* Action FABs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setCurrentView('reader')}
              className="flex items-center gap-3 px-7 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-full font-bold text-base shadow-m3-3 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{currentPage > 1 ? `متابعة القراءة (صفحة ${currentPage})` : 'بدء قراءة الكتاب'}</span>
            </button>

            <button
              onClick={() => startQuiz(1, 'relaxed')}
              className="flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold text-sm backdrop-blur-md border border-white/20 transition-all hover:scale-105"
            >
              <HelpCircle className="w-5 h-5 text-amber-300" />
              <span>بدء اختبار سريع</span>
            </button>
          </div>
        </div>
      </section>

      {/* Metric Cards (M3 Surface Tiers) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Streak */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-5 rounded-2xl bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 flex items-center gap-4 shadow-m3-1"
        >
          <div className="p-3.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl">
            <Flame className="w-7 h-7 fill-amber-500" />
          </div>
          <div>
            <span className="block text-2xl font-black text-m3-onSurface">{streak} أيام</span>
            <span className="text-xs text-m3-onSurface-variant font-medium">سلسلة المواظبة</span>
          </div>
        </motion.div>

        {/* Card 2: Current Page */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-5 rounded-2xl bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 flex items-center gap-4 shadow-m3-1"
        >
          <div className="p-3.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <span className="block text-2xl font-black text-m3-onSurface">صفحة {currentPage}</span>
            <span className="text-xs text-m3-onSurface-variant font-medium">مستوى التقدم في القراءة</span>
          </div>
        </motion.div>

        {/* Card 3: Solved Questions */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-5 rounded-2xl bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 flex items-center gap-4 shadow-m3-1"
        >
          <div className="p-3.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-2xl">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="block text-2xl font-black text-m3-onSurface">{correctCount} / 1200</span>
            <span className="text-xs text-m3-onSurface-variant font-medium">إجابة صحيحة موثقة</span>
          </div>
        </motion.div>

        {/* Card 4: Accuracy Rate */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-5 rounded-2xl bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 flex items-center gap-4 shadow-m3-1"
        >
          <div className="p-3.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <span className="block text-2xl font-black text-m3-onSurface">{accuracy}%</span>
            <span className="text-xs text-m3-onSurface-variant font-medium">نسبة الإتقان العامة</span>
          </div>
        </motion.div>
      </section>

      {/* 4 Historical Parts Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-m3-onSurface tracking-tight">
              أجزاء السيرة النبوية الـ 4
            </h2>
            <p className="text-sm text-m3-onSurface-variant mt-1">
              اختر الجزء التاريخي لقراءة مباحثه أو دخول الاختبارات الخاصة به (300 سؤال لكل جزء)
            </p>
          </div>

          <button
            onClick={() => setCurrentView('quiz')}
            className="hidden sm:flex items-center gap-2 text-sm text-m3-primary dark:text-m3-primary-dark font-bold hover:underline"
          >
            <span>عرض كل الاختبارات</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SECTIONS_INFO.map((sec) => (
            <motion.div
              key={sec.id}
              whileHover={{ scale: 1.01 }}
              className="bg-m3-surface-dim/60 dark:bg-m3-surface-darkContainer p-6 rounded-3xl border border-m3-outline-variant/30 shadow-m3-2 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1 bg-m3-primary-container text-m3-primary-onContainer rounded-full text-xs font-bold">
                    الجزء {sec.id} من 4
                  </span>
                  <span className="text-xs font-semibold text-m3-onSurface-variant">
                    300 سؤال تفاعلي
                  </span>
                </div>

                <h3 className="text-xl font-bold text-m3-onSurface leading-snug">{sec.title}</h3>
                <p className="text-xs font-medium text-m3-secondary dark:text-m3-secondary-dark">{sec.subtitle}</p>
                <p className="text-sm text-m3-onSurface-variant/90 leading-relaxed line-clamp-3">
                  {sec.description}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-m3-outline-variant/20">
                <button
                  onClick={() => startQuiz(sec.id, 'relaxed')}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-m3-primary text-white hover:bg-m3-primary/90 font-medium text-sm rounded-full transition shadow-m3-1"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>دخول اختبار الجزء</span>
                </button>

                <button
                  onClick={() => startQuiz(sec.id, 'timed')}
                  className="flex items-center justify-center p-2.5 bg-m3-surface-container text-m3-onSurface hover:bg-m3-surface-high rounded-full transition"
                  title="تحدي وقت المؤشر"
                >
                  <Zap className="w-4 h-4 text-amber-600" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Daily Spiritual Insight / Quote */}
      <section className="p-6 md:p-8 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-emerald-500/10 rounded-3xl border border-amber-500/20 space-y-4">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
          <Star className="w-5 h-5 fill-current" />
          <span>قبس من السيرة النبوية النيرة</span>
        </div>
        <blockquote className="text-lg md:text-xl font-serif text-m3-onSurface italic leading-relaxed">
          «إن السيرة النبوية على صاحبها أفضل الصلاة وأزكى التسليم ليست مجرد سرد لتاريخ عابر، بل هي النبع الصافي والمشعل الهادي لبناء الفرد والأمة في كل عصر وحين.»
        </blockquote>
        <p className="text-xs text-m3-onSurface-variant font-medium">
          مستفاد من مقدمة كتاب الرحيق المختوم — الشيخ صفي الرحمن المباركفوري
        </p>
      </section>
    </div>
  );
};
