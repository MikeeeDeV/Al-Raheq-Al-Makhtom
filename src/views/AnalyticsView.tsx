import React, { useState } from 'react';
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
  } = useAppStore();

  const [selectedTierFilter, setSelectedTierFilter] = useState<'all' | BadgeTier>('all');

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

  const filteredAchievements = selectedTierFilter === 'all'
    ? achievements
    : achievements.filter((a) => a.tier === selectedTierFilter);

  const getTierBadgeStyle = (tier?: BadgeTier, unlocked?: boolean) => {
    if (!unlocked) {
      return {
        cardBg: 'bg-m3-surface-dim/40 dark:bg-m3-surface-darkContainer/40 border-m3-outline-variant/20 opacity-50 grayscale',
        chipBg: 'bg-gray-500/20 text-gray-700 dark:text-gray-300',
        label: 'مغلق',
        icon: <ShieldCheck className="w-5 h-5 text-gray-400" />,
      };
    }

    const currentTier = tier || 'bronze';

    switch (currentTier) {
      case 'gold':
        return {
          cardBg: 'bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-amber-600/20 border-amber-400 shadow-m3-2',
          chipBg: 'bg-amber-500 text-white font-bold shadow-sm',
          label: 'وسام ذهبي 🥇',
          icon: <Award className="w-5 h-5 text-amber-500" />,
        };
      case 'platinum':
        return {
          cardBg: 'bg-gradient-to-br from-slate-300/20 via-cyan-400/10 to-slate-400/20 border-cyan-400 shadow-m3-2',
          chipBg: 'bg-cyan-600 text-white font-bold shadow-sm',
          label: 'وسام بلاتيني 🥈💎',
          icon: <Crown className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
        };
      case 'diamond':
        return {
          cardBg: 'bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-indigo-500/20 border-emerald-400 shadow-m3-3 ring-2 ring-emerald-400/30',
          chipBg: 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black shadow-md',
          label: 'وسام ماسي 💎✨',
          icon: <Diamond className="w-5 h-5 text-emerald-500 animate-pulse" />,
        };
      case 'bronze':
      default:
        return {
          cardBg: 'bg-amber-900/10 dark:bg-amber-900/20 border-amber-700/50 shadow-m3-1',
          chipBg: 'bg-amber-800 text-amber-100 font-bold',
          label: 'وسام برونزي 🥉',
          icon: <Medal className="w-5 h-5 text-amber-700 dark:text-amber-500" />,
        };
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-m3-onSurface tracking-tight">
          لوحة الإحصائيات والأوسمة
        </h1>
        <p className="text-xs sm:text-sm text-m3-onSurface-variant mt-1">
          رصد دقيق لمستوى التحصيل العلمي والأوسمة المفتوحة في دراسة السيرة النبوية النيرة
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
            <span className="block text-2xl font-black text-m3-onSurface">{accuracy}%</span>
            <span className="text-xs text-m3-onSurface-variant font-medium">معدل الدقة الإجمالي</span>
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

      {/* Tiered Gamified Milestone Badges Gallery */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-m3-onSurface font-black text-xl">
            <Award className="w-6 h-6 text-amber-500" />
            <span>شارات الوسام المفتوحة (برونزية - ذهبية - بلاتينية - ماسية)</span>
          </div>

          {/* Tier Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-m3-surface-container dark:bg-m3-surface-darkContainer rounded-full border border-m3-outline-variant/20 self-start">
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
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                selectedTierFilter === 'bronze'
                  ? 'bg-amber-800 text-white'
                  : 'text-m3-onSurface-variant hover:text-m3-onSurface'
              }`}
            >
              برونزي 🥉
            </button>
            <button
              onClick={() => setSelectedTierFilter('gold')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                selectedTierFilter === 'gold'
                  ? 'bg-amber-500 text-white'
                  : 'text-m3-onSurface-variant hover:text-m3-onSurface'
              }`}
            >
              ذهبي 🥇
            </button>
            <button
              onClick={() => setSelectedTierFilter('platinum')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                selectedTierFilter === 'platinum'
                  ? 'bg-cyan-600 text-white'
                  : 'text-m3-onSurface-variant hover:text-m3-onSurface'
              }`}
            >
              بلاتيني 🥈💎
            </button>
            <button
              onClick={() => setSelectedTierFilter('diamond')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                selectedTierFilter === 'diamond'
                  ? 'bg-emerald-600 text-white'
                  : 'text-m3-onSurface-variant hover:text-m3-onSurface'
              }`}
            >
              ماسي 💎✨
            </button>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredAchievements.map((ach) => {
            const style = getTierBadgeStyle(ach.tier, ach.unlocked);
            return (
              <motion.div
                key={ach.id}
                whileHover={{ y: -3 }}
                className={`p-5 rounded-3xl border text-right transition-all flex flex-col justify-between space-y-4 ${style.cardBg}`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-m3-surface/60 dark:bg-m3-surface-dark/60 rounded-2xl border border-m3-outline-variant/20 shadow-xs">
                    {style.icon}
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${style.chipBg}`}>
                    {style.label}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-m3-onSurface flex items-center gap-1">
                    <span>{ach.title}</span>
                  </h4>
                  <p className="text-xs text-m3-onSurface-variant leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                {ach.unlocked && ach.unlockedAt && (
                  <div className="pt-2 border-t border-m3-outline-variant/10 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>تم الفتح في: {ach.unlockedAt}</span>
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
