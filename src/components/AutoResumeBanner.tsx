import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Bookmark, Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AutoResumeBanner: React.FC = () => {
  const { currentPage, hasResumeBanner, dismissResumeBanner, setCurrentView } = useAppStore();

  if (!hasResumeBanner || currentPage <= 1) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-7xl mx-auto px-4 mb-4"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-m3-primary-container text-m3-primary-onContainer rounded-2xl shadow-m3-1 border border-m3-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-m3-primary/10 rounded-full text-m3-primary">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm sm:text-base">
                مرحباً بك مجدداً! لقد توقفت عند <span className="font-bold underline decoration-m3-primary underline-offset-4">الصفحة {currentPage}</span>
              </p>
              <p className="text-xs sm:text-sm text-m3-primary-onContainer/80 mt-0.5">
                يمكنك مواصلة رحلة القراءة والاستمتاع بصفحات السيرة العطرة في أي وقت.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                setCurrentView('reader');
                dismissResumeBanner();
              }}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-m3-primary text-white hover:bg-m3-primary/90 font-medium text-sm rounded-full shadow-m3-2 transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>استئناف القراءة</span>
            </button>

            <button
              onClick={dismissResumeBanner}
              className="p-2 text-m3-primary-onContainer/60 hover:text-m3-primary-onContainer hover:bg-m3-primary/10 rounded-full transition"
              title="إغلاق التنبيه"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
