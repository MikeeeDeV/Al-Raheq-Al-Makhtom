import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  BookOpen,
  Github,
  Heart,
  Info,
  Gift,
  RefreshCw,
  Sparkles,
  Flame,
  Award,
  Book,
  Flower2,
  MessageSquare,
  Users,
} from 'lucide-react';
import { motion } from 'framer-motion';

const PROPHETIC_WISDOMS = [
  '«إنما بعثت لأتمم مكارم الأخلاق» — حديث شريف',
  '«أحب الأعمال إلى الله أدومها وإن قل» — حديث شريف',
  '«خيركم من تعلم القرآن وعلمه» — حديث شريف',
  '«الدال على الخير كفاعله» — حديث شريف',
  '«تهادوا تحابوا» — من هدايا السيرة النبوية النيرة',
  '«إن من أحبكم إلي وأقربكم مني مجلساً يوم القيامة أحاسنكم أخلاقاً» — حديث شريف',
];

export const Footer: React.FC = () => {
  const {
    setAboutModalOpen,
    setGiftModalOpen,
    currentPage,
    streak,
    answeredQuestions,
    visitorCount,
  } = useAppStore();

  const [quoteIndex, setQuoteIndex] = useState(0);

  const totalCorrect = Object.values(answeredQuestions).filter((a) => a.isCorrect).length;

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % PROPHETIC_WISDOMS.length);
  };

  return (
    <footer className="w-full relative overflow-hidden bg-slate-950 text-slate-200 mt-20 pb-24 md:pb-8 pt-10 font-arabic border-t border-emerald-500/20 shadow-2xl">
      {/* Top Animated Shimmer Border Line */}
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 animate-gradient" />

      {/* Background Subtle Radial Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
        {/* Mobile Compact Footer */}
        <div className="block md:hidden text-center space-y-6">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-2xl flex items-center justify-center text-amber-300 shadow-md">
              <Flower2 className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="font-black text-xl text-white tracking-wide">الرحيق المختوم</h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs font-light">
              المنصة التفاعلية للسيرة النبوية المطهرة — قراءة، دراسة، واختبارات 1200 سؤال وجواب.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setAboutModalOpen(true)}
              className="px-3.5 py-1.5 bg-slate-800 text-slate-200 rounded-full text-xs font-bold border border-slate-700"
            >
              عن المنصة
            </button>
            <button
              onClick={() => setGiftModalOpen(true)}
              className="px-3.5 py-1.5 bg-emerald-900/60 text-emerald-300 rounded-full text-xs font-bold border border-emerald-700/60 flex items-center gap-1"
            >
              <Gift className="w-3.5 h-3.5 text-amber-300" />
              <span>إهداء كارت</span>
            </button>
            <button
              onClick={() => useAppStore.getState().setContactModalOpen(true)}
              className="px-3.5 py-1.5 bg-teal-900/60 text-teal-300 rounded-full text-xs font-bold border border-teal-700/60 flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>تواصل مباشر</span>
            </button>
          </div>

          <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs text-slate-300 italic font-semibold">
            {PROPHETIC_WISDOMS[quoteIndex]}
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex flex-col items-center gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-slate-300 rounded-full font-bold border border-slate-800">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>إجمالي الزيارات: {(visitorCount || 1845).toLocaleString('ar-EG')} زائر</span>
              </span>
            </div>
            <p>© {new Date().getFullYear()} الرحيق المختوم — عمل لوجه الله تعالى</p>
          </div>
        </div>

        {/* Desktop Full Footer */}
        <div className="hidden md:block space-y-8">
          {/* Top Banner Feature Strip */}
          <div className="p-5 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 rounded-3xl border border-emerald-500/30 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-800/80 rounded-2xl flex items-center justify-center text-amber-300 shadow-inner border border-emerald-600/50">
                <Flower2 className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-black text-lg text-white">المنصة التفاعلية للرحيق المختوم</h3>
                <p className="text-xs text-emerald-200/80 font-light">
                  تصفح واقرأ واختبر حصيلتك في السيرة النبوية الشريفة مجاناً وبدون إعلانات.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setGiftModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-2xl border border-slate-700 transition cursor-pointer"
              >
                <Gift className="w-4 h-4 text-amber-300" />
                <span>كارت لرفاقك</span>
              </motion.button>
            </div>
          </div>

          {/* Feature Bar 2: Rotating Prophetic Hadith Wisdom */}
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold shrink-0">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
              <span>قبس من السيرة والهدى النبوي:</span>
            </div>

            <div className="flex-1 text-center font-semibold text-slate-200 text-xs italic px-4">
              {PROPHETIC_WISDOMS[quoteIndex]}
            </div>

            <button
              onClick={nextQuote}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-emerald-300 transition p-1.5 rounded-lg hover:bg-slate-800 shrink-0 cursor-pointer"
              title="قبس آخر"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>قبس آخر</span>
            </button>
          </div>

          {/* Main 3-Column Desktop Grid */}
          <div className="grid grid-cols-3 gap-8 text-right">
            {/* Col 1: About Book & Mission */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-black text-lg">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span>الرحيق المختوم</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                منظومة تفاعلية عصرية لقراءة ودراسة كتاب الرحيق المختوم في سيرة النبي الأعظم ﷺ، الحائز على المركز الأول في مسابقة رابطة العالم الإسلامي بمكة المكرمة للمؤلف صفي الرحمن المباركفوري.
              </p>

              {/* Live Progress Chips */}
              <div className="flex items-center gap-2 pt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-300 rounded-full text-[11px] font-bold border border-emerald-500/20">
                  <Book className="w-3 h-3 text-emerald-400" />
                  صفحة {currentPage}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-500/10 text-teal-300 rounded-full text-[11px] font-bold border border-teal-500/20">
                  <Award className="w-3 h-3 text-teal-400" />
                  {totalCorrect} إجابة صحيحة
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 text-amber-300 rounded-full text-[11px] font-bold border border-amber-500/20">
                  <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                  {streak} أيام
                </span>
              </div>
            </div>

            {/* Col 2: Platform Shortcuts */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-white">مكونات المنصة الرقمية</h3>
              <ul className="text-xs text-slate-300 space-y-2 leading-relaxed font-light">
                <li>• قارئ متطور يعرض صفحات الكتاب بتقنيات التكبير والليل.</li>
                <li>• ساحة اختبارات تضم 1200 سؤال وجواب تفاعلي وموثق.</li>
                <li>• بنك المراجعة الذكي لمعالجة الأخطاء السابقة وتثبيت الحفظ.</li>
                <li>• لوحة الإحصائيات وشارات الأوسمة الماسية والذهبية.</li>
              </ul>
            </div>

            {/* Col 3: Developer & Credits */}
            <div className="space-y-3 flex flex-col items-start">
              <h3 className="font-bold text-sm text-white">المطور والحقوق</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                تم تطوير وتنفيذ هذه المنصة خصيصاً بنية الصدقة الجارية ونشر سيرة النبي الكريم ﷺ.
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setAboutModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 text-slate-200 rounded-full text-xs font-bold hover:bg-slate-700 transition cursor-pointer border border-slate-700"
                >
                  <Info className="w-3.5 h-3.5 text-emerald-400" />
                  <span>دليل التطبيق</span>
                </button>

                <button
                  onClick={() => useAppStore.getState().setContactModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-bold hover:bg-emerald-500/30 transition cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>تواصل معنا</span>
                </button>
              </div>

              <a
                href="https://github.com/MikeeeDeV/Al-Raheq-Al-Makhtom"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-emerald-400 hover:underline font-bold mt-1"
              >
                <Github className="w-4 h-4" />
                <span>تطوير: محمد أيمن (MikeeeDeV)</span>
              </a>
            </div>
          </div>

          {/* Desktop Rights Bar */}
          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <p>© {new Date().getFullYear()} المنصة التفاعلية للرحيق المختوم — عمل لوجه الله تعالى وصلاح المسلمين.</p>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-slate-200 rounded-full text-xs font-bold border border-slate-700/80 shadow-inner">
                <Users className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>إجمالي الزيارات: {(visitorCount || 1845).toLocaleString('ar-EG')} زائر</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-slate-300">
              <span>صُنع بحب وإهداء خاص</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
              <span>وخدمةً للسيرة النبوية العطرة</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
