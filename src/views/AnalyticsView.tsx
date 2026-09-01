import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { SECTIONS_INFO } from '../data/sectionsInfo';
import { BadgeTier } from '../types';
import {
  Flame,
  BookOpen,
  CheckCircle2,
  Trophy,
  Award,
  BarChart3,
  PieChart as PieChartIcon,
  ShieldCheck,
  Sparkles,
  Medal,
  Crown,
  Diamond,
  Check,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { motion } from 'framer-motion';

export const AnalyticsView: React.FC = () => {
  const {
    streak,
    currentPage,
    totalPages,
    answeredQuestions,
    achievements,
    checkAchievements,
  } = useAppStore();

  const [selectedTierFilter, setSelectedTierFilter] = useState<'all' | BadgeTier>('all');
  const [activeTrackFilter, setActiveTrackFilter] = useState<string>('all');

  useEffect(() => {
    checkAchievements();
  }, [checkAchievements]);

  const totalSolved = Object.keys(answeredQuestions).length;
  const correctCount = Object.values(answeredQuestions).filter((a) => a.isCorrect).length;
  const wrongCount = totalSolved - correctCount;
  const accuracy = totalSolved > 0 ? Math.round((correctCount / totalSolved) * 100) : 0;

  // Radar Data per Section
  const radarData = SECTIONS_INFO.map((sec) => {
    const sectionSolved = Object.entries(answeredQuestions).filter(([qId]) => {
      const idNum = parseInt(qId, 10);
      const minId = (sec.id - 1) * 300 + 1;
      const maxId = sec.id * 300;
      return idNum >= minId && idNum <= maxId;
    });

    const secCorrect = sectionSolved.filter(([_, res]) => res.isCorrect).length;
    const secMastery = sectionSolved.length > 0 ? Math.round((secCorrect / 300) * 100) : 0;

    return {
      subject: `الجزء ${sec.id}`,
      mastery: Math.max(10, secMastery * 3), // scaled for radar visual impact
      rawMastery: secMastery,
    };
  });

  // Donut Chart Data
  const pieData = [
    { name: 'إجابات صحيحة', value: correctCount || 1, color: '#0D6E4F' },
    { name: 'إجابات خاطئة', value: wrongCount || 0, color: '#BA1A1A' },
  ];

  // Group achievements by Track
  const tracks = [
    { id: 'all', title: 'كافة المسارات' },
    { id: 'reader', title: 'مسار القراءة' },
    { id: 'questions', title: 'مسار الإجابات' },
    { id: 'streak', title: 'مسار المواظبة' },
    { id: 'mistakes', title: 'مسار تصحيح الأخطاء' },
    { id: 'sessions', title: 'مسار الاختبارات' },
    { id: 'accuracy', title: 'مسار الدقة' },
  ];

  const filteredAchievements = achievements.filter((a) => {
    const matchesTier = selectedTierFilter === 'all' || a.tier === selectedTierFilter;
    const matchesTrack = activeTrackFilter === 'all' || a.trackId === activeTrackFilter;
    return matchesTier && matchesTrack;
  });

  const getTierBadgeStyle = (tier: BadgeTier, unlocked: boolean) => {
    if (!unlocked) {
      return {
        cardBg: 'bg-m3-surface-dim/40 dark:bg-m3-surface-darkContainer/40 border-m3-outline-variant/20 opacity-70 grayscale',
        chipBg: 'bg-gray-500/20 text-gray-700 dark:text-gray-300 font-semibold',
        label: 'مغلق',
        icon: <ShieldCheck className="w-5 h-5 text-gray-400" />,
      };
    }

    switch (tier) {
      case 'bronze':
        return {
          cardBg: 'bg-gradient-to-br from-amber-900/15 via-amber-800/10 to-amber-900/20 border-amber-700/50 shadow-m3-1',
          chipBg: 'bg-amber-800 text-amber-100 font-bold shadow-xs',
          label: 'برونزي 🥉',
          icon: <Medal className="w-5 h-5 text-amber-700 dark:text-amber-500" />,
        };
      case 'silver':
        return {
          cardBg: 'bg-gradient-to-br from-slate-400/20 via-slate-300/10 to-slate-500/20 border-slate-400/60 shadow-m3-1',
          chipBg: 'bg-slate-600 text-white font-bold shadow-xs',
          label: 'فضي 🥈',
          icon: <Award className="w-5 h-5 text-slate-500 dark:text-slate-300" />,
        };
      case 'gold':
        return {
          cardBg: 'bg-gradient-to-br from-amber-500/20 via-yellow-500/15 to-amber-600/20 border-amber-400 shadow-m3-2',
          chipBg: 'bg-amber-500 text-white font-bold shadow-sm',
          label: 'ذهبي 🥇',
          icon: <Crown className="w-5 h-5 text-amber-500" />,
        };
      case 'diamond':
        return {
          cardBg: 'bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-indigo-500/20 border-emerald-400 shadow-m3-3 ring-2 ring-emerald-400/30',
          chipBg: 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black shadow-md',
          label: 'ماسي 💎✨',
          icon: <Diamond className="w-5 h-5 text-emerald-500 animate-pulse" />,
        };
    }
  };

  const totalUnlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-8 pb-12 font-arabic">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-m3-onSurface tracking-tight">
          لوحة الإحصائيات والأوسمة المتاحة
        </h1>
        <p className="text-xs sm:text-sm text-m3-onSurface-variant mt-1">
          نظام الأوسمة المتقدم (برونزي 🥉 ← فضي 🥈 ← ذهبي 🥇 ← ماسي 💎✨) لكافة مسارات التعلم
        </p>
      </div>

      {/* Top 4 Elevated Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-m3-surface-container dark:bg-m3-surface-darkContainer rounded-3xl border border-m3-outline-variant/30 shadow-m3-1 flex items-center gap-4">
          <div className="p-3.5 bg-amber-500/15 text-amber-600 rounded-2xl">
            <Flame className="w-7 h-7 fill-amber-500" />
          </div>
          <div>
            <span className="block text-2xl font-black text-m3-onSurface">{streak} أيام</span>
            <span className="text-xs text-m3-onSurface-variant font-medium">سلسلة المواظبة</span>
          </div>
        </div>

        <div className="p-5 bg-m3-surface-container dark:bg-m3-surface-darkContainer rounded-3xl border border-m3-outline-variant/30 shadow-m3-1 flex items-center gap-4">
          <div className="p-3.5 bg-emerald-500/15 text-emerald-600 rounded-2xl">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <span className="block text-2xl font-black text-m3-onSurface">
              {currentPage} / {totalPages}
            </span>
            <span className="text-xs text-m3-onSurface-variant font-medium">صفحات أتممت قراءتها</span>
          </div>
        </div>

        <div className="p-5 bg-m3-surface-container dark:bg-m3-surface-darkContainer rounded-3xl border border-m3-outline-variant/30 shadow-m3-1 flex items-center gap-4">
          <div className="p-3.5 bg-teal-500/15 text-teal-600 rounded-2xl">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="block text-2xl font-black text-m3-onSurface">{correctCount}</span>
            <span className="text-xs text-m3-onSurface-variant font-medium">إجابة صحيحة موثقة</span>
          </div>
        </div>

        <div className="p-5 bg-m3-surface-container dark:bg-m3-surface-darkContainer rounded-3xl border border-m3-outline-variant/30 shadow-m3-1 flex items-center gap-4">
          <div className="p-3.5 bg-purple-500/15 text-purple-600 rounded-2xl">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <span className="block text-2xl font-black text-m3-onSurface">{totalUnlockedCount} / {achievements.length}</span>
            <span className="text-xs text-m3-onSurface-variant font-medium">وسام مفتوح</span>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart for 4 Sections */}
        <div className="p-6 bg-m3-surface-container dark:bg-m3-surface-darkContainer rounded-3xl border border-m3-outline-variant/30 shadow-m3-2 space-y-4">
          <div className="flex items-center gap-2 text-m3-primary dark:text-m3-primary-dark font-bold text-base">
            <BarChart3 className="w-5 h-5" />
            <span>مخطط الإتقان للأجزاء الـ 4</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#707974" strokeDasharray="3 3" opacity={0.3} />
                <PolarAngleAxis dataKey="subject" stroke="#404944" tick={{ fontSize: 12, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#707974" opacity={0.3} />
                <Radar
                  name="نسبة الإتقان"
                  dataKey="mastery"
                  stroke="#0D6E4F"
                  fill="#0D6E4F"
                  fillOpacity={0.45}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart for Accuracy Breakdown */}
        <div className="p-6 bg-m3-surface-container dark:bg-m3-surface-darkContainer rounded-3xl border border-m3-outline-variant/30 shadow-m3-2 space-y-4">
          <div className="flex items-center gap-2 text-m3-primary dark:text-m3-primary-dark font-bold text-base">
            <PieChartIcon className="w-5 h-5" />
            <span>نسبة دقة الإجابات (Donut Breakdown)</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Multi-Tier Achievement Badges Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-m3-onSurface font-black text-xl">
              <Award className="w-6 h-6 text-amber-500" />
              <span>معرض الأوسمة والطبقات المفتوحة</span>
            </h2>
            <p className="text-xs text-m3-onSurface-variant mt-1">
              تتدرج كل شارة عبر 4 مستويات: برونزي 🥉 ثم فضي 🥈 ثم ذهبي 🥇 ثم ماسي 💎✨
            </p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Track Filter */}
            <select
              value={activeTrackFilter}
              onChange={(e) => setActiveTrackFilter(e.target.value)}
              className="px-3 py-1.5 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-full text-xs font-bold text-m3-onSurface focus:outline-hidden"
            >
              {tracks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>

            {/* Tier Filter Pills */}
            <div className="flex items-center gap-1 p-1 bg-m3-surface-container dark:bg-m3-surface-darkContainer rounded-full border border-m3-outline-variant/20">
              <button
                onClick={() => setSelectedTierFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  selectedTierFilter === 'all'
                    ? 'bg-m3-primary text-white'
                    : 'text-m3-onSurface-variant hover:text-m3-onSurface'
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => setSelectedTierFilter('bronze')}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition ${
                  selectedTierFilter === 'bronze'
                    ? 'bg-amber-800 text-white'
                    : 'text-m3-onSurface-variant hover:text-m3-onSurface'
                }`}
              >
                برونزي 🥉
              </button>
              <button
                onClick={() => setSelectedTierFilter('silver')}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition ${
                  selectedTierFilter === 'silver'
                    ? 'bg-slate-600 text-white'
                    : 'text-m3-onSurface-variant hover:text-m3-onSurface'
                }`}
              >
                فضي 🥈
              </button>
              <button
                onClick={() => setSelectedTierFilter('gold')}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition ${
                  selectedTierFilter === 'gold'
                    ? 'bg-amber-500 text-white'
                    : 'text-m3-onSurface-variant hover:text-m3-onSurface'
                }`}
              >
                ذهبي 🥇
              </button>
              <button
                onClick={() => setSelectedTierFilter('diamond')}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition ${
                  selectedTierFilter === 'diamond'
                    ? 'bg-emerald-600 text-white'
                    : 'text-m3-onSurface-variant hover:text-m3-onSurface'
                }`}
              >
                ماسي 💎✨
              </button>
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredAchievements.map((ach) => {
            const style = getTierBadgeStyle(ach.tier, ach.unlocked);
            const currentVal = ach.currentValue || 0;
            const progressPercent = Math.min(100, Math.round((currentVal / ach.targetValue) * 100));

            return (
              <motion.div
                key={ach.id}
                whileHover={{ y: -3 }}
                className={`p-5 rounded-3xl border text-right transition-all flex flex-col justify-between space-y-4 relative overflow-hidden ${style.cardBg}`}
              >
                {/* Track Badge Header */}
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-m3-surface/60 dark:bg-m3-surface-dark/60 rounded-2xl border border-m3-outline-variant/20 shadow-xs">
                    {style.icon}
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${style.chipBg}`}>
                    {style.label}
                  </span>
                </div>

                {/* Title and Description */}
                <div className="space-y-1">
                  <span className="text-[10px] text-m3-primary dark:text-m3-primary-dark font-bold block">
                    {ach.trackTitle}
                  </span>
                  <h4 className="font-extrabold text-sm text-m3-onSurface flex items-center gap-1">
                    <span>{ach.title}</span>
                  </h4>
                  <p className="text-xs text-m3-onSurface-variant leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                {/* Unlocked status or progress bar */}
                {ach.unlocked ? (
                  <div className="pt-2 border-t border-m3-outline-variant/10 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>وسام مفتوح ({ach.unlockedAt})</span>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-m3-outline-variant/10 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-m3-onSurface-variant">
                      <span>التقدم الحالي:</span>
                      <span>{currentVal} / {ach.targetValue} ({progressPercent}%)</span>
                    </div>
                    <div className="w-full bg-m3-outline-variant/30 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-m3-primary h-full rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
