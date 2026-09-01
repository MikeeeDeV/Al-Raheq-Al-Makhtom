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
  Zap,
  Target,
  ChevronDown,
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
  const readingPercent = Math.round((currentPage / (totalPages || 543)) * 100);

  // Overall User XP Calculation
  const userXP = (correctCount * 15) + (currentPage * 10) + (streak * 25);

  const getRankTitle = (xp: number) => {
    if (xp > 3000) return { title: 'عَالِم بالسيرة النبوية 👑', color: 'from-amber-400 to-yellow-600' };
    if (xp > 1500) return { title: 'مُحَقِّق بالسيرة المطهرة 💎', color: 'from-cyan-400 to-emerald-600' };
    if (xp > 500) return { title: 'مُتَدَارِس السيرة الشريفة 🥇', color: 'from-emerald-500 to-teal-700' };
    return { title: 'مُحِبّ السيرة النبوية 🌱', color: 'from-teal-600 to-emerald-800' };
  };

  const userRank = getRankTitle(userXP);

  // Radar Data per Section
  const radarData = SECTIONS_INFO.map((sec) => {
    const sectionSolved = Object.entries(answeredQuestions).filter(([qId]) => {
      const idNum = parseInt(qId, 10);
      const minId = (sec.id - 1) * 300 + 1;
      const maxId = sec.id * 300;
      return idNum >= minId && idNum <= maxId;
    });

    const secCorrect = sectionSolved.filter(([_, res]) => res.isCorrect).length;
    const secMastery = Math.min(100, Math.round((secCorrect / 300) * 100));

    return {
      subject: `الجزء ${sec.id}`,
      mastery: Math.max(15, secMastery),
      rawMastery: secMastery,
    };
  });

  // Donut Chart Data
  const pieData = [
    { name: 'إجابات صحيحة', value: correctCount || 1, color: '#059669' },
    { name: 'إجابات خاطئة', value: wrongCount || 0, color: '#DC2626' },
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

  const DEFAULT_BADGE_STYLE = {
    cardBg: 'bg-gradient-to-br from-slate-400/20 via-slate-300/10 to-slate-500/20 border-slate-400/60 shadow-m3-1',
    chipBg: 'bg-slate-600 text-white font-bold shadow-xs',
    label: 'وسام 🏅',
    icon: <Award className="w-5 h-5 text-slate-500 dark:text-slate-300" />,
  };

  const getTierBadgeStyle = (tier?: string, unlocked?: boolean) => {
    if (!unlocked) {
      return {
        cardBg: 'bg-m3-surface-dim/40 dark:bg-m3-surface-darkContainer/40 border-m3-outline-variant/20 opacity-70 grayscale',
        chipBg: 'bg-gray-500/20 text-gray-700 dark:text-gray-300 font-semibold',
        label: 'مغلق 🔒',
        icon: <ShieldCheck className="w-5 h-5 text-gray-400" />,
      };
    }

    switch (tier) {
      case 'bronze':
        return {
          cardBg: 'bg-gradient-to-br from-amber-900/20 via-amber-800/10 to-amber-950/30 border-amber-700/60 shadow-m3-1',
          chipBg: 'bg-amber-800 text-amber-100 font-bold shadow-xs',
          label: 'برونزي 🥉',
          icon: <Medal className="w-5 h-5 text-amber-600 dark:text-amber-500 animate-bounce-gentle" />,
        };
      case 'silver':
      case 'platinum':
        return {
          cardBg: 'bg-gradient-to-br from-slate-400/20 via-slate-300/10 to-slate-500/20 border-slate-400/60 shadow-m3-1',
          chipBg: 'bg-slate-700 text-white font-bold shadow-xs',
          label: 'فضي 🥈',
          icon: <Award className="w-5 h-5 text-slate-400 dark:text-slate-200 animate-bounce-gentle" />,
        };
      case 'gold':
        return {
          cardBg: 'bg-gradient-to-br from-amber-500/20 via-yellow-500/15 to-amber-600/20 border-amber-400 shadow-m3-2',
          chipBg: 'bg-amber-500 text-slate-950 font-black shadow-sm',
          label: 'ذهبي 🥇',
          icon: <Crown className="w-5 h-5 text-amber-400 animate-bounce-gentle" />,
        };
      case 'diamond':
        return {
          cardBg: 'bg-gradient-to-br from-emerald-500/25 via-cyan-500/20 to-indigo-500/25 border-emerald-400 shadow-m3-3 ring-2 ring-emerald-400/40',
          chipBg: 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black shadow-md',
          label: 'ماسي 💎',
          icon: <Diamond className="w-5 h-5 text-emerald-400 animate-pulse" />,
        };
      default:
        return DEFAULT_BADGE_STYLE;
    }
  };

  const totalUnlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-8 pb-16 font-arabic" dir="rtl">
      {/* Executive Overall Progress Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-3xl border border-emerald-500/30 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

        <div className="space-y-3 text-center md:text-right z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 rounded-full text-xs font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
            <span>رتبتك في السيرة النبوية</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            {userRank.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-light leading-relaxed">
            استمر في قراءة السيرة والإجابة على الأسئلة لجمع نقاط المعرفة وتوثيق الأوسمة الماسية.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
            <span className="px-3 py-1 bg-slate-800/80 border border-slate-700 text-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{userXP} نقطة خبرة (XP)</span>
            </span>
            <span className="px-3 py-1 bg-slate-800/80 border border-slate-700 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>إنجاز القراءة: {readingPercent}%</span>
            </span>
          </div>
        </div>

        {/* Circular Overall Progress Ring Badge */}
        <div className="relative z-10 shrink-0 flex flex-col items-center justify-center">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-emerald-500/30 bg-slate-900/90 flex flex-col items-center justify-center shadow-xl relative">
            <span className="text-2xl sm:text-3xl font-black text-white">{totalUnlockedCount}</span>
            <span className="text-[10px] text-slate-400 font-bold">من {achievements.length} وسام</span>
          </div>
        </div>
      </motion.div>

      {/* Top 4 Elevated KPI Cards (100% Responsive Grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Streak */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-4 sm:p-5 bg-m3-surface-container dark:bg-m3-surface-darkContainer rounded-3xl border border-m3-outline-variant/30 shadow-m3-1 flex items-center gap-3.5"
        >
          <div className="p-3 bg-amber-500/15 text-amber-600 rounded-2xl shrink-0">
            <Flame className="w-6 h-6 sm:w-7 sm:h-7 fill-amber-500 animate-bounce-gentle" />
          </div>
          <div>
            <span className="block text-xl sm:text-2xl font-black text-m3-onSurface">{streak} أيام</span>
            <span className="text-[11px] sm:text-xs text-m3-onSurface-variant font-medium">سلسلة المواظبة</span>
          </div>
        </motion.div>

        {/* Card 2: Book Reading */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-4 sm:p-5 bg-m3-surface-container dark:bg-m3-surface-darkContainer rounded-3xl border border-m3-outline-variant/30 shadow-m3-1 flex items-center gap-3.5"
        >
          <div className="p-3 bg-emerald-500/15 text-emerald-600 rounded-2xl shrink-0">
            <BookOpen className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <span className="block text-xl sm:text-2xl font-black text-m3-onSurface">
              {currentPage} / {totalPages}
            </span>
            <span className="text-[11px] sm:text-xs text-m3-onSurface-variant font-medium">صفحات أتممتها</span>
          </div>
        </motion.div>

        {/* Card 3: Correct Answers */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-4 sm:p-5 bg-m3-surface-container dark:bg-m3-surface-darkContainer rounded-3xl border border-m3-outline-variant/30 shadow-m3-1 flex items-center gap-3.5"
        >
          <div className="p-3 bg-teal-500/15 text-teal-600 rounded-2xl shrink-0">
            <Target className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <span className="block text-xl sm:text-2xl font-black text-m3-onSurface">{accuracy}%</span>
            <span className="text-[11px] sm:text-xs text-m3-onSurface-variant font-medium">نسبة دقة الإجابات</span>
          </div>
        </motion.div>

        {/* Card 4: Unlocked Badges */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-4 sm:p-5 bg-m3-surface-container dark:bg-m3-surface-darkContainer rounded-3xl border border-m3-outline-variant/30 shadow-m3-1 flex items-center gap-3.5"
        >
          <div className="p-3 bg-purple-500/15 text-purple-600 rounded-2xl shrink-0">
            <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-purple-500" />
          </div>
          <div>
            <span className="block text-xl sm:text-2xl font-black text-m3-onSurface">{totalUnlockedCount}</span>
            <span className="text-[11px] sm:text-xs text-m3-onSurface-variant font-medium">وسام مفتوح</span>
          </div>
        </motion.div>
      </div>

      {/* Visual Charts Grid (Radar & Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart for 4 Sections */}
        <div className="p-5 sm:p-6 bg-m3-surface-container dark:bg-m3-surface-darkContainer rounded-3xl border border-m3-outline-variant/30 shadow-m3-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-m3-primary dark:text-m3-primary-dark font-bold text-sm sm:text-base">
              <BarChart3 className="w-5 h-5" />
              <span>مخطط الإتقان لأجزاء السيرة الـ 4</span>
            </div>
            <span className="text-xs text-m3-onSurface-variant font-semibold">مقياس الإتقان</span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#707974" strokeDasharray="3 3" opacity={0.3} />
                <PolarAngleAxis dataKey="subject" stroke="#404944" tick={{ fontSize: 12, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#707974" opacity={0.3} />
                <Radar
                  name="نسبة الإتقان"
                  dataKey="mastery"
                  stroke="#059669"
                  fill="#059669"
                  fillOpacity={0.45}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart for Accuracy Breakdown */}
        <div className="p-5 sm:p-6 bg-m3-surface-container dark:bg-m3-surface-darkContainer rounded-3xl border border-m3-outline-variant/30 shadow-m3-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-m3-primary dark:text-m3-primary-dark font-bold text-sm sm:text-base">
              <PieChartIcon className="w-5 h-5" />
              <span>تحليل الإجابات الموثقة</span>
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">{correctCount} صحيحة</span>
          </div>

          <div className="h-64 sm:h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
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
            <h2 className="flex items-center gap-2 text-m3-onSurface font-black text-lg sm:text-xl">
              <Award className="w-6 h-6 text-amber-500 animate-bounce-gentle" />
              <span>معرض الأوسمة والإنجازات</span>
            </h2>
            <p className="text-xs text-m3-onSurface-variant mt-0.5">
              تتدرج الأوسمة عبر 4 مستويات: برونزي 🥉 ← فضي 🥈 ← ذهبي 🥇 ← ماسي 💎
            </p>
          </div>

          {/* Interactive Filters Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Track Filter Dropdown */}
            <div className="relative">
              <select
                value={activeTrackFilter}
                onChange={(e) => setActiveTrackFilter(e.target.value)}
                className="px-3.5 py-1.5 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-full text-xs font-bold text-m3-onSurface focus:outline-hidden appearance-none pr-3 pl-8 cursor-pointer"
              >
                {tracks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-m3-onSurface-variant pointer-events-none" />
            </div>

            {/* Tier Filter Pills */}
            <div className="flex items-center gap-1 p-1 bg-m3-surface-container dark:bg-m3-surface-darkContainer rounded-full border border-m3-outline-variant/20 overflow-x-auto">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'bronze', label: 'برونزي 🥉' },
                { id: 'silver', label: 'فضي 🥈' },
                { id: 'gold', label: 'ذهبي 🥇' },
                { id: 'diamond', label: 'ماسي 💎' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setSelectedTierFilter(pill.id as any)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    selectedTierFilter === pill.id
                      ? 'bg-m3-primary text-white shadow-xs'
                      : 'text-m3-onSurface-variant hover:text-m3-onSurface'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Badges Grid (Responsive 1-4 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredAchievements.map((ach) => {
            const rawStyle = getTierBadgeStyle(ach.tier, ach.unlocked);
            const cardBg = rawStyle?.cardBg || DEFAULT_BADGE_STYLE.cardBg;
            const chipBg = rawStyle?.chipBg || DEFAULT_BADGE_STYLE.chipBg;
            const label = rawStyle?.label || DEFAULT_BADGE_STYLE.label;
            const icon = rawStyle?.icon || DEFAULT_BADGE_STYLE.icon;

            const currentVal = ach.currentValue || 0;
            const targetVal = ach.targetValue || 1;
            const progressPercent = Math.min(100, Math.round((currentVal / targetVal) * 100));

            return (
              <motion.div
                key={ach.id}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`p-5 rounded-3xl border text-right transition-all flex flex-col justify-between space-y-4 relative overflow-hidden shadow-xs hover:shadow-m3-2 ${cardBg}`}
              >
                {/* Track Badge Header */}
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-m3-surface/70 dark:bg-m3-surface-dark/70 rounded-2xl border border-m3-outline-variant/20 shadow-xs">
                    {icon}
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${chipBg}`}>
                    {label}
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
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="bg-m3-primary h-full rounded-full"
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

export default AnalyticsView;
