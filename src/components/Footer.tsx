import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { BookOpen, Github, Heart, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setAboutModalOpen } = useAppStore();

  return (
    <footer className="w-full bg-m3-surface-container/60 dark:bg-m3-surface-darkContainer/60 border-t border-m3-outline-variant/20 mt-16 pb-20 md:pb-8 pt-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-right">
          {/* Col 1: About Book */}
          <div className="space-y-3">
            <div className="flex items-center justify-center md:justify-start gap-2 text-m3-primary dark:text-m3-primary-dark font-bold text-lg">
              <BookOpen className="w-5 h-5" />
              <span>الرحيق المختوم</span>
            </div>
            <p className="text-sm text-m3-onSurface-variant leading-relaxed">
              بحث في السيرة النبوية على صاحبها أفضل الصلاة والسلام، حاز على المركز الأول في مسابقة رابطة العالم الإسلامي بمكة المكرمة. مؤلفه الشيخ صفي الرحمن المباركفوري.
            </p>
          </div>

          {/* Col 2: Quick Features */}
          <div className="space-y-3">
            <h3 className="font-bold text-base text-m3-onSurface">مميزات المنصة</h3>
            <ul className="text-sm text-m3-onSurface-variant space-y-2">
              <li>• قارئ عالمي يستعرض صفحات الكتاب الأصلية بجودة عالية.</li>
              <li>• 1200 سؤال وجواب تفاعلي مقسمة على 4 أجزاء تاريخية.</li>
              <li>• بنك المراجعة الذكي لتقوية الأخطاء وتثبيت الفهم.</li>
              <li>• لوحة إحصائيات تفاعلية وشارات إنجاز مميزة.</li>
            </ul>
          </div>

          {/* Col 3: Developer & Credits */}
          <div className="space-y-3 flex flex-col items-center md:items-start">
            <h3 className="font-bold text-base text-m3-onSurface">المطور والحقوق</h3>
            <p className="text-sm text-m3-onSurface-variant">
              تم تطوير هذا العمل خصيصاً لنشر سيرة الحبيب المصطفى ﷺ وتسهيل تدارسها.
            </p>

            <button
              onClick={() => setAboutModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-m3-primary-container text-m3-primary-onContainer rounded-full text-xs font-semibold hover:bg-m3-primary/20 transition"
            >
              <Info className="w-4 h-4" />
              <span>تفاصيل التطبيق والمؤلف</span>
            </button>

            <a
              href="https://github.com/mohamed-ayman"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-m3-primary dark:text-m3-primary-dark hover:underline font-medium mt-1"
            >
              <Github className="w-4 h-4" />
              <span>تطوير: محمد أيمن (Mohamed Ayman)</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-m3-outline-variant/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-m3-onSurface-variant/80 text-center">
          <p>© {new Date().getFullYear()} المنصة التفاعلية للرحيق المختوم — جميع الحقوق محفوظة لكل مسلم.</p>
          <div className="flex items-center gap-1">
            <span>صُنع بحب</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span>خدمةً للسيرة النبوية العطرة</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
