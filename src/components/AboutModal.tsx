import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  X,
  BookOpen,
  Award,
  Github,
  Code,
  CheckCircle2,
  HelpCircle,
  Compass,
  Trophy,
  RotateCcw,
  Gift,
  Share2,
  Flame,
  Sparkles,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AboutModal: React.FC = () => {
  const { isAboutModalOpen, setAboutModalOpen } = useAppStore();
  const [activeTab, setActiveTab] = useState<'guide' | 'about' | 'tech'>('guide');

  if (!isAboutModalOpen) return null;

  const guideItems = [
    {
      icon: <BookOpen className="w-5 h-5 text-emerald-500" />,
      title: 'القارئ التفاعلي المباشر',
      desc: 'تصفح صفحات كتاب الرحيق المختوم بدقة عالية مع حفظ تلقائي لصفحتك الحالية وتكبير وتصغير سلس.',
      tag: 'القراءة',
    },
    {
      icon: <Trophy className="w-5 h-5 text-amber-500" />,
      title: 'ساحة الاختبارات (1200 سؤال)',
      desc: 'اختبر معرفتك في السيرة النبوية بعد كل فصل مع أسئلة اختيار من متعدد وتقييم لحظي وإحصائيات دقيقة.',
      tag: 'الاختبارات',
    },
    {
      icon: <RotateCcw className="w-5 h-5 text-rose-500" />,
      title: 'بنك مراجعة الأخطاء',
      desc: 'يُحفظ تلقائياً أي سؤال تجيب عليه بشكل غير صحيح ليمكنك مراجعته وإعادة الاختبار فيه لتثبيت المعلومة.',
      tag: 'المراجعة',
    },
    {
      icon: <Flame className="w-5 h-5 text-orange-500" />,
      title: 'سلسلة المواظبة اليومية (Streak)',
      desc: 'شريط تحفيزي يتتبع أيّام قراءتك المتتالية ليشجعك على الاستمرار والتدارس بشكل يومي.',
      tag: 'التتبع',
    },
    {
      icon: <Gift className="w-5 h-5 text-teal-500" />,
      title: 'بطاقات الإهداء الرقمية',
      desc: 'اصنع كارت إهداء خاص مخصص بالاسم والرسالة وألوان رائعة وشاركه مباشرة عبر واتساب وتلغرام.',
      tag: 'الإهداء',
    },
    {
      icon: <Share2 className="w-5 h-5 text-sky-500" />,
      title: 'مشاركة الإنجازات صورة ونصر',
      desc: 'ولّد بطاقات إنجاز كصور عالية الدقة PNG تشمل إحصائياتك وصفحة قراءتك لمشاركتها مع أصحابك.',
      tag: 'المشاركة',
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 font-arabic dir-rtl overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={() => setAboutModalOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 16 }}
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
          className="bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant/30 w-full max-w-2xl rounded-3xl p-4 sm:p-7 shadow-2xl relative space-y-4 max-h-[90vh] flex flex-col z-10 my-auto overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-m3-outline-variant/20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 text-white flex items-center justify-center shadow-m3-2 shrink-0">
                <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
              </div>
              <div>
                <h2 className="font-extrabold text-base sm:text-xl text-m3-primary dark:text-m3-primary-dark flex items-center gap-1.5">
                  <span>دليل استخدام المنصة</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </h2>
                <p className="text-[11px] sm:text-xs text-m3-onSurface-variant font-medium">
                  الرحيق المختوم — المنصة التفاعلية لدارسة السيرة النبوية
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

          {/* Responsive Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-m3-surface-container/60 dark:bg-m3-surface-darkContainer/60 rounded-2xl border border-m3-outline-variant/20 shrink-0 text-xs sm:text-sm font-bold">
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-m3-onSurface-variant hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>دليل الاستخدام</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-m3-onSurface-variant hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>عن الكتاب والمطور</span>
            </button>

            <button
              onClick={() => setActiveTab('tech')}
              className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'tech'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-m3-onSurface-variant hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>التقنيات</span>
            </button>
          </div>

          {/* Scrollable Body Content */}
          <div className="overflow-y-auto space-y-4 pr-1 pl-1 flex-1 text-right dir-rtl">
            {activeTab === 'guide' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-3"
              >
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-800 dark:text-emerald-200 font-medium">
                  ✨ مرحباً بك في دليل المنصة! صُممت منصة <strong>الرحيق المختوم</strong> لتجعل قراءة وتدارس سيرة الحبيب المصطفى ﷺ تجربة ممتعة، تفاعلية، وميسرة على كل جهاز.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {guideItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-m3-surface-container/50 dark:bg-m3-surface-darkContainer/50 rounded-2xl border border-m3-outline-variant/20 hover:border-emerald-500/30 transition space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-m3-onSurface">
                          <div className="p-1.5 rounded-xl bg-m3-surface border border-m3-outline-variant/30">
                            {item.icon}
                          </div>
                          <span>{item.title}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold rounded-md">
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-m3-onSurface-variant leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'about' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                {/* Book Info Section */}
                <div className="space-y-2 bg-m3-surface-container/50 dark:bg-m3-surface-darkContainer/50 p-4 rounded-2xl border border-m3-outline-variant/20">
                  <div className="flex items-center gap-2 text-m3-primary dark:text-m3-primary-dark font-bold text-sm sm:text-base">
                    <Award className="w-5 h-5 text-amber-500" />
                    <span>عن الكتاب والمؤلف</span>
                  </div>
                  <p className="text-xs sm:text-sm text-m3-onSurface-variant leading-relaxed">
                    كتاب <strong className="text-m3-onSurface">"الرحيق المختوم"</strong> للشيخ العالي <strong className="text-m3-onSurface">صفي الرحمن المباركفوري</strong> رحمة الله عليه، يعد من أشهر وأفضل كتب السيرة النبوية الشريفة. حاز على المركز الأول في المهرجان العالمي للسيرة النبوية بمكة المكرمة.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-semibold">
                      اللهم اجعله خالصاً لوجهك الكريم
                    </span>
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-300 rounded-full text-xs font-semibold flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                      <span>1,200 سؤال وجواب</span>
                    </span>
                  </div>
                </div>

                {/* Developer Credit Section */}
                <div className="space-y-3 bg-gradient-to-br from-emerald-900/10 to-teal-900/10 p-4 sm:p-5 rounded-2xl border border-emerald-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-m3-primary dark:text-m3-primary-dark font-bold text-xs sm:text-sm">
                      <Code className="w-4 h-4 text-emerald-500" />
                      <span>تطوير وبرمجة التطبيق</span>
                    </div>
                    <span className="px-2.5 py-0.5 bg-emerald-600 text-white text-[10px] sm:text-[11px] font-extrabold rounded-full">
                      Full-Stack Architect
                    </span>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 pt-1">
                    <div className="relative group shrink-0">
                      <img
                        src="/developer.jpg"
                        alt="محمد أيمن - Mohamed Ayman"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover shadow-md border-2 border-emerald-500/50 group-hover:scale-105 transition-transform"
                      />
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-700 text-white font-black text-lg sm:text-xl flex items-center justify-center shadow-m3-2 border-2 border-white absolute inset-0 -z-10">
                        MA
                      </div>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base sm:text-lg text-m3-onSurface">
                        محمد أيمن (Mohamed Ayman)
                      </h3>
                      <p className="text-xs text-m3-onSurface-variant leading-relaxed">
                        مطور برمجيات خبير متخصص في بناء المنصات التعليمية والتفاعلية عالية الجودة.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <a
                      href="https://github.com/MikeeeDeV/Al-Raheq-Al-Makhtom"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-m3-primary text-white hover:bg-m3-primary/90 font-bold text-xs sm:text-sm rounded-full shadow-m3-2 transition cursor-pointer"
                    >
                      <Github className="w-4 h-4" />
                      <span>زيارة حساب GitHub للمطور</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'tech' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-3"
              >
                <h3 className="text-xs font-bold text-m3-onSurface-variant uppercase tracking-wider">
                  البنية البرمجية والتقنيات المستخدمة
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-medium">
                  {[
                    { title: 'React 19 + TypeScript', desc: 'أحدث معمارية برمجية' },
                    { title: 'Material Design 3', desc: 'واجهة عصرية مرنة' },
                    { title: 'Tailwind CSS v3', desc: 'تنسيق سلس ومتجاوب' },
                    { title: 'PDF.js Renderer', desc: 'عرض المستندات فائق السرعة' },
                    { title: 'Zustand Engine', desc: 'إدارة الحالة والتخزين' },
                    { title: 'Live Telemetry', desc: 'متابعة الأداء وتتبع الأخطاء' },
                  ].map((tech, i) => (
                    <div
                      key={i}
                      className="p-3 bg-m3-surface-container/60 rounded-2xl border border-m3-outline-variant/20 flex flex-col gap-1"
                    >
                      <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{tech.title}</span>
                      </div>
                      <span className="text-[10px] text-m3-onSurface-variant">{tech.desc}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer Action */}
          <div className="pt-3 border-t border-m3-outline-variant/20 flex justify-end shrink-0">
            <button
              onClick={() => setAboutModalOpen(false)}
              className="w-full sm:w-auto px-6 py-2.5 bg-m3-surface-container text-m3-onSurface font-bold text-xs sm:text-sm rounded-full hover:bg-m3-surface-high transition cursor-pointer"
            >
              إغلاق النافذة
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AboutModal;

