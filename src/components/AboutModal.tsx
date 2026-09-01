import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { X, BookOpen, Award, Github, Code, CheckCircle2, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const AboutModal: React.FC = () => {
  const { setAboutModalOpen } = useAppStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-arabic dir-rtl">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={() => setAboutModalOpen(false)}
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 12 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant/30 w-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto z-10 my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-m3-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center shadow-m3-2">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-m3-primary dark:text-m3-primary-dark">
                منصة الرحيق المختوم التفاعلية
              </h3>
              <p className="text-xs text-m3-onSurface-variant">
                دراسة وقراءة واختبارات السيرة النبوية المباركة
              </p>
            </div>
          </div>
          <button
            onClick={() => setAboutModalOpen(false)}
            className="p-2 text-m3-onSurface-variant hover:bg-m3-surface-container rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Book Info Section */}
        <div className="space-y-3 bg-m3-surface-container/50 dark:bg-m3-surface-darkContainer/50 p-5 rounded-2xl border border-m3-outline-variant/20">
          <div className="flex items-center gap-2 text-m3-primary dark:text-m3-primary-dark font-bold text-base">
            <Award className="w-5 h-5" />
            <span>عن الكتاب والـمؤلف</span>
          </div>
          <p className="text-sm text-m3-onSurface-variant leading-relaxed">
            كتاب <strong className="text-m3-onSurface">"الرحيق المختوم"</strong> للشيخ العالي <strong className="text-m3-onSurface">صفي الرحمن المباركفوري</strong> رحمة الله عليه، يعد من أشهر وأشهر كتب السيرة النبوية في العصر الحديث. حاز الكتاب على المركز الأول في المهرجان العالمي الأول للسيرة النبوية الشريفة الذي نظمته رابطة العالم الإسلامي بمكة المكرمة.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-semibold">
              اسأل الله ان يكون عملى هذا مقبولا
            </span>
            <span className="px-3 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-300 rounded-full text-xs font-semibold flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>1,200 سؤال وجواب</span>
            </span>
            <span className="px-3 py-1 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 rounded-full text-xs font-semibold">
              تصميم Material You 3
            </span>
          </div>
        </div>

        {/* Developer Credit Section */}
        <div className="space-y-3 bg-gradient-to-br from-emerald-900/10 to-teal-900/10 p-5 rounded-2xl border border-emerald-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-m3-primary dark:text-m3-primary-dark font-bold text-base">
              <Code className="w-5 h-5" />
              <span>تطوير وبرمجة التطبيق</span>
            </div>
            <span className="px-2.5 py-0.5 bg-emerald-600 text-white text-[11px] font-bold rounded-full">
              Full-Stack Architect
            </span>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <div className="w-14 h-14 rounded-full bg-emerald-600 text-white font-black text-xl flex items-center justify-center shadow-m3-2 border-2 border-white">
              MA
            </div>
            <div>
              <h4 className="font-extrabold text-lg text-m3-onSurface">محمد أيمن (Mohamed Ayman)</h4>
              <p className="text-xs text-m3-onSurface-variant">
                مطور برمجيات خبير متخصص في بناء المنصات التعليمية والتفاعلية عالية الجودة.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <a
              href="https://github.com/MikeeeDeV/Al-Raheq-Al-Makhtom"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-m3-primary text-white hover:bg-m3-primary/90 font-medium text-sm rounded-full shadow-m3-2 transition cursor-pointer"
            >
              <Github className="w-4 h-4" />
              <span>زيارة حساب GitHub للمطور</span>
            </a>
          </div>
        </div>

        {/* Application Technologies */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-m3-onSurface-variant uppercase tracking-wider">
            التقنيات المستخدمة
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 bg-m3-surface-container rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>React 19 + TypeScript</span>
            </div>
            <div className="p-2.5 bg-m3-surface-container rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Material Design 3</span>
            </div>
            <div className="p-2.5 bg-m3-surface-container rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Tailwind CSS v3</span>
            </div>
            <div className="p-2.5 bg-m3-surface-container rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>PDF.js Visual Renderer</span>
            </div>
            <div className="p-2.5 bg-m3-surface-container rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zustand Persistence</span>
            </div>
            <div className="p-2.5 bg-m3-surface-container rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Live Telemetry Engine</span>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-4 border-t border-m3-outline-variant/20 flex justify-end">
          <button
            onClick={() => setAboutModalOpen(false)}
            className="px-6 py-2.5 bg-m3-surface-container text-m3-onSurface font-medium text-sm rounded-full hover:bg-m3-surface-high transition cursor-pointer"
          >
            إغلاق النافذة
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutModal;
