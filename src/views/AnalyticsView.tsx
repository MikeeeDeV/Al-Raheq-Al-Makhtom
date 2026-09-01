import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { SECTIONS_INFO } from '../data/sectionsInfo';
import {
  Flame,
  BookOpen,
  CheckCircle2,
  Trophy,
  Award,
  BarChart3,
  PieChart as PieChartIcon,
  ShieldCheck,
  Zap,
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
    quizHistory,
  } = useAppStore();

  const totalSolved = Object.keys(answeredQuestions).length;
  const correctCount = Object.values(answeredQuestions).filter((a) => a.isCorrect).length;
  const wrongCount = totalSolved - correctCount;
  const accuracy = totalSolved > 0 ? Math.round((correctCount / totalSolved) * 100) : 0;

  // Radar Data per Section
  const radarData = SECTIONS_INFO.map((sec) => {
    // calculate solved questions for this section
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

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-m3-onSurface tracking-tight">
          لوحة الإحصائيات والإنجازات
        </h1>
        <p className="text-xs sm:text-sm text-m3-onSurface-variant mt-1">
          رصد دقيق لمستوى التحصيل العلمي والتقدم في دراسة السيرة النبوية النيرة
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

      {/* Gamified Milestone Badges Gallery */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-m3-onSurface font-black text-xl">
          <Award className="w-6 h-6 text-amber-500" />
          <span>شارات الوسام المفتوحة</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {achievements.map((ach) => (
            <motion.div
              key={ach.id}
              whileHover={{ y: -3 }}
              className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between space-y-3 ${
                ach.unlocked
                  ? 'bg-m3-primary-container/40 dark:bg-m3-primary-containerDark/40 border-m3-primary/40 text-m3-onSurface'
                  : 'bg-m3-surface-dim/40 dark:bg-m3-surface-darkContainer/40 border-m3-outline-variant/20 opacity-50 grayscale'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="p-2 bg-m3-primary/10 rounded-xl text-m3-primary">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                {ach.unlocked && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-600 text-white rounded-full">
                    مفتوح
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-bold text-sm text-m3-onSurface">{ach.title}</h4>
                <p className="text-xs text-m3-onSurface-variant mt-1 leading-normal">
                  {ach.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
