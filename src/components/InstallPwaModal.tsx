import React, { useEffect, useState } from 'react';
import { Download, X, Smartphone, BookOpen, Check, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const InstallPwaModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState<boolean>(false);

  useEffect(() => {
    // Check if app is already running in standalone mode (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    const isDismissed = localStorage.getItem('pwa_install_prompt_dismissed');

    if (isStandalone || isDismissed) {
      return;
    }

    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(iosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Trigger modal after a slight delay on first interaction/page load
      setTimeout(() => {
        setIsOpen(true);
      }, 1500);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If iOS or browser doesn't fire beforeinstallprompt right away, trigger prompt for first-time visitors
    if (iosDevice && !isDismissed) {
      setTimeout(() => {
        setIsOpen(true);
      }, 2000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('PWA installed successfully');
      }
      setDeferredPrompt(null);
      setIsOpen(false);
    } else {
      // For desktop or browsers where native prompt isn't supported directly
      setIsOpen(false);
      localStorage.setItem('pwa_install_prompt_dismissed', 'true');
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem('pwa_install_prompt_dismissed', 'true');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-arabic" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          className="bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant/30 w-full max-w-md rounded-3xl p-6 shadow-m3-5 space-y-5 relative overflow-hidden"
        >
          {/* Top Close Icon */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 left-4 p-2 text-m3-onSurface-variant hover:bg-m3-surface-container rounded-full transition"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon Header */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-m3-2 flex-shrink-0">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 bg-m3-primary-container text-m3-primary-onContainer rounded-full text-[11px] font-bold">
                تطبيق الويب العصري (PWA)
              </span>
              <h3 className="text-lg font-black text-m3-onSurface mt-1">
                تثبيت منصة "الرحيق المختوم"
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-m3-onSurface-variant leading-relaxed">
            أضف المنصة لشاشتك الرئيسية لتصفح السيرة النبوية والاستفادة من القارئ والاختبارات كأنه تطبيق مستقل بدون إنترنت وبسرعة فائقة.
          </p>

          {/* Key Advantages */}
          <div className="space-y-2 bg-m3-surface-container dark:bg-m3-surface-darkContainer p-3.5 rounded-2xl border border-m3-outline-variant/20 text-xs">
            <div className="flex items-center gap-2 text-m3-onSurface font-semibold">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>قراءة سريعة وبدون الحاجة لفتح المتصفح في كل مرة</span>
            </div>
            <div className="flex items-center gap-2 text-m3-onSurface font-semibold">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>وصول مباشر للأقسام وحفظ تلقائي لتقدم القراءة</span>
            </div>
          </div>

          {/* iOS Safari Instruction hint */}
          {isIos && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>لتثبيت التطبيق على آيفون: اضغط زر المشاركة <strong className="underline">Share</strong> ثم اختر <strong className="underline">إضافة للشاشة الرئيسية Add to Home Screen</strong>.</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={handleDismiss}
              className="px-5 py-2.5 text-m3-onSurface-variant hover:bg-m3-surface-container rounded-full text-xs font-bold transition"
            >
              تخطي الآن
            </button>

            <button
              onClick={handleInstallClick}
              className="flex items-center gap-2 px-6 py-2.5 bg-m3-primary text-white rounded-full text-xs font-bold shadow-m3-2 hover:bg-m3-primary/90 transition active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>تثبيت التطبيق الآن</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
