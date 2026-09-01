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
    <footer className="w-full bg-m3-surface-container/80 dark:bg-m3-surface-darkContainer/80 border-t border-m3-outline-variant/30 mt-16 pb-20 md:pb-8 pt-12 transition-colors font-arabic">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Top Feature Bar 1: Simple Minimalist Islamic Gift Card Banner */}
        <div className="p-5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-800/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center md:text-right">
            <div className="w-11 h-11 bg-emerald-800 rounded-xl flex items-center justify-center text-white flex-shrink-0">
              <Gift className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-m3-onSurface">
                إهداء المنصة لأحبائك في الله 📜
              </h3>
              <p className="text-xs text-m3-onSurface-variant mt-0.5 max-w-xl">
                أرسل كارت إهداء بسيط يحتوي على اسمك واسم المُهدى إليه ورسالة عاطرة مع رابط منصة السيرة النبوية.
              </p>
            </div>
          </div>

          <button
            onClick={() => setGiftModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex-shrink-0"
          >
            <Gift className="w-4 h-4 text-amber-300" />
            <span>إنشاء كارت إهداء</span>
          </button>
        </div>

        {/* Top Feature Bar 2: Rotating Prophetic Hadith & Daily Wisdom */}
        <div className="p-4 bg-m3-surface-containerHigh/60 dark:bg-m3-surface-dark/60 rounded-2xl border border-m3-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-m3-primary dark:text-m3-primary-dark font-bold">
            <Sparkles className="w-4 h-4" />
            <span>قبس من السيرة والهدى النبوي:</span>
          </div>

          <div className="flex-1 text-center font-semibold text-m3-onSurface text-xs italic px-4">
            {PROPHETIC_WISDOMS[quoteIndex]}
          </div>

          <button
            onClick={nextQuote}
            className="flex items-center gap-1 text-[11px] font-bold text-m3-onSurface-variant hover:text-m3-primary transition p-1.5 rounded-lg hover:bg-m3-surface-container"
            title="قبس آخر"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>قبس آخر</span>
          </button>
        </div>

        {/* Main 3-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-right">
          {/* Col 1: About Book & Mission */}
          <div className="space-y-3">
            <div className="flex items-center justify-center md:justify-start gap-2 text-m3-primary dark:text-m3-primary-dark font-black text-lg">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>الرحيق المختوم</span>
            </div>
            <p className="text-xs sm:text-sm text-m3-onSurface-variant leading-relaxed">
              منظومة تفاعلية عصرية لقراءة ودراسة كتاب الرحيق المختوم في سيرة النبي الأعظم ﷺ، الحائز على المركز الأول في مسابقة رابطة العالم الإسلامي بمكة المكرمة للمؤلف صفي الرحمن المباركفوري.
            </p>

            {/* Live Progress Chips */}
            <div className="flex items-center justify-center md:justify-start gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-m3-primary-container/50 text-m3-primary-onContainer rounded-full text-[11px] font-bold">
                <Book className="w-3 h-3" />
                صفحة {currentPage}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded-full text-[11px] font-bold">
                <Award className="w-3 h-3" />
                {totalCorrect} إجابة صحيحة
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-300 rounded-full text-[11px] font-bold">
                <Flame className="w-3 h-3 fill-amber-500" />
                {streak} أيام
              </span>
            </div>
          </div>

          {/* Col 2: Platform Shortcuts */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-m3-onSurface">مكونات المنصة الرقمية</h3>
            <ul className="text-xs text-m3-onSurface-variant space-y-2 leading-relaxed">
              <li>• قارئ متطور يعرض صفحات الكتاب بتقنيات التكبير والليل.</li>
              <li>• ساحة اختبارات تضم 1200 سؤال وجواب تفاعلي وموثق.</li>
              <li>• بنك المراجعة الذكي لمعالجة الأخطاء السابقة وتثبيت الحفظ.</li>
              <li>• لوحة الإحصائيات وشارات الأوسمة الماسية والذهبية.</li>
            </ul>
          </div>

          {/* Col 3: Developer & Sadaqah Jariyah Credit */}
          <div className="space-y-3 flex flex-col items-center md:items-start">
            <h3 className="font-bold text-sm text-m3-onSurface">المطور والحقوق</h3>
            <p className="text-xs text-m3-onSurface-variant leading-relaxed">
              تم تطوير وتنفيذ هذه المنصة خصيصاً بنية الصدقة الجارية ونشر سيرة النبي الكريم ﷺ.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setAboutModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-m3-primary-container text-m3-primary-onContainer rounded-full text-xs font-bold hover:bg-m3-primary/20 transition cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
                <span>دليل التطبيق</span>
              </button>

              <button
                onClick={() => setGiftModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-300 border border-rose-500/30 rounded-full text-xs font-bold hover:bg-rose-500/20 transition cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>إهداء المنصة 💖</span>
              </button>
            </div>

            <a
              href="https://github.com/mohamed-ayman"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-m3-primary dark:text-m3-primary-dark hover:underline font-bold mt-1"
            >
              <Github className="w-4 h-4" />
              <span>تطوير وإخراج: محمد أيمن (Mohamed Ayman)</span>
            </a>
          </div>
        </div>

        {/* Bottom Rights Bar */}
        <div className="pt-6 border-t border-m3-outline-variant/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-m3-onSurface-variant/80 text-center">
          <p>© {new Date().getFullYear()} المنصة التفاعلية للرحيق المختوم — عمل لوجه الله تعالى وصلاح المسلمين.</p>
          <div className="flex items-center gap-1.5 font-semibold">
            <span>صُنع بحب</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current animate-pulse" />
            <span>خدمةً للسيرة النبوية العطرة</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
