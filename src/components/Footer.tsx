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
  } = useAppStore();

  const [quoteIndex, setQuoteIndex] = useState(0);

  const totalCorrect = Object.values(answeredQuestions).filter((a) => a.isCorrect).length;

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % PROPHETIC_WISDOMS.length);
  };

  return (
    <footer className="w-full relative overflow-hidden bg-slate-950 text-slate-200 mt-20 pb-20 md:pb-8 pt-10 font-arabic border-t border-emerald-500/20 shadow-2xl">
      {/* Top Animated Shimmer Border Line */}
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 animate-gradient" />

      {/* Live Ambient Glowing Background Orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

        {/* 📱 MOBILE FOOTER: Ultra Simple & Clean Layout with Static Dedication Banner */}
        <div className="md:hidden space-y-4 text-center py-2">
          {/* Static Romantic Dedication Card Mobile */}
          <div className="p-4 bg-gradient-to-r from-rose-950/90 via-slate-900/90 to-emerald-950/90 border border-rose-500/30 rounded-2xl text-right space-y-1.5 shadow-md">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
              <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
              <span>إهداء خاص إلى ملهمة الدرب وحبيبة العمر</span>
            </div>
            <p className="text-[11px] text-slate-200 leading-relaxed font-light">
              إلى حبيبتي وملهمة الدرب.. أهديكِ هذا العمل المبارك بنية الصدقة الجارية والنور، دمتِ لي سكنًا ونورًا وأجمل نعم ربي.
            </p>
            <span className="block text-[10px] text-rose-300/80 font-bold text-left">
              مِن المحبّ: محمد أيمن
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>الرحيق المختوم</span>
            </div>

            <button
              onClick={() => setGiftModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-full shadow-xs transition cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5 text-amber-300" />
              <span>إهداء لرفاقك</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            منصة تفاعلية لقراءة ودراسة السيرة النبوية المطهرة © {new Date().getFullYear()}
          </p>
        </div>


        {/* 💻 DESKTOP FOOTER: Rich Detailed Layout & Widgets */}
        <div className="hidden md:block space-y-8">
          {/* Feature Bar 1: Static Gift Dedication Banner */}
          <div className="p-5 bg-gradient-to-r from-rose-950/90 via-slate-900/90 to-emerald-950/90 border border-rose-500/30 rounded-3xl flex items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-rose-900/80 rounded-2xl flex items-center justify-center text-white shrink-0 border border-rose-400/30 shadow-xs">
                <Heart className="w-6 h-6 text-rose-300 fill-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>إهداء خَاص لـ مُلهمَة الدَّرب وحبيبة العمر</span>
                  <Flower2 className="w-4 h-4 text-rose-400" />
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 max-w-2xl font-light leading-relaxed">
                  إلى حبيبتي وملهمة الدرب.. أهديكِ هذا العمل المبارك بنية الصدقة الجارية والنور، دمتِ لي سكنًا ونورًا وأجمل نعم ربي. عمل مخلص شريف في سيرة النبي ﷺ، مهداة كلماته العاطرة إهداءً خاصاً بالحب والوفاء.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0 pl-2">
              <div className="text-left border-r border-rose-500/30 pr-4">
                <span className="text-[11px] text-rose-300 font-bold block">مِن المحبّ</span>
                <span className="text-sm font-black text-white">محمد أيمن</span>
              </div>

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
                <span>تطوير وإخراج: محمد أيمن (MikeeeDeV)</span>
              </a>
            </div>
          </div>

          {/* Desktop Rights Bar */}
          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <p>© {new Date().getFullYear()} المنصة التفاعلية للرحيق المختوم — عمل لوجه الله تعالى وصلاح المسلمين.</p>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-800 text-slate-300 rounded-full text-[11px] font-semibold border border-slate-700">
                <Users className="w-3 h-3 text-emerald-400" />
                <span>إجمالي الزيارات: {useAppStore.getState().visitorCount.toLocaleString('ar-EG')} زائر</span>
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
