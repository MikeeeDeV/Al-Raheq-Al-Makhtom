import React, { useEffect } from 'react';
import { useAppStore, getInitialViewFromUrl } from './store/useAppStore';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { ReaderView } from './views/ReaderView';
import { QuizArenaView } from './views/QuizArenaView';
import { MistakesBankView } from './views/MistakesBankView';
import { AnalyticsView } from './views/AnalyticsView';
import { ShareModal } from './components/ShareModal';
import { AboutModal } from './components/AboutModal';
import { InstallPwaModal } from './components/InstallPwaModal';
import { GiftDedicationModal } from './components/GiftDedicationModal';
import { ContactModal } from './components/ContactModal';
import { BookCompletionModal } from './components/BookCompletionModal';
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { BadgeUnlockModal } from './components/BadgeUnlockModal';
import { SeoMeta } from './components/SeoMeta';
import { trackNewVisitorSession, sendErrorTelemetryToTelegram } from './services/telegramTelemetry';
import { initGoogleAnalytics } from './services/googleAnalytics';
import { motion, AnimatePresence } from 'framer-motion';

export const App: React.FC = () => {
  const {
    currentView,
    isShareModalOpen,
    isAboutModalOpen,
    isGiftModalOpen,
    isContactModalOpen,
    isCompletionModalOpen,
  } = useAppStore();

  // Sync URL changes, track new visitor session, & register real-time error telemetry
  useEffect(() => {
    initGoogleAnalytics();

    // Defer network telemetry so initial page render and animations are 60fps fast
    const timer = setTimeout(() => {
      trackNewVisitorSession();
    }, 2500);

    const handleUrlChange = () => {
      const view = getInitialViewFromUrl();
      useAppStore.getState().setCurrentViewWithoutUrlUpdate(view);
    };

    // Global Error Handlers (Sentry replacement dispatching alerts directly to Telegram)
    const handleGlobalError = (event: ErrorEvent) => {
      if (
        event.message?.includes('ResizeObserver loop') ||
        event.message?.includes('Script error') ||
        event.message?.includes('Worker was destroyed')
      ) {
        return;
      }

      sendErrorTelemetryToTelegram({
        message: event.message || 'خطأ برمجي غير محدد',
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error ? event.error.stack : undefined,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      sendErrorTelemetryToTelegram({
        message: typeof reason === 'string' ? reason : reason?.message || 'وعد مرفوض غير معالج (Unhandled Rejection)',
        stack: reason?.stack,
      });
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const getSeoDetails = () => {
    switch (currentView) {
      case 'home':
        return {
          title: 'الرحيق المختوم | المنصة التفاعلية الموثقة للسيرة النبوية الشريفة',
          description: 'منصة تفاعلية عصرية لقراءة ودراسة كتاب الرحيق المختوم وإجراء اختبارات تفاعلية في السيرة النبوية.',
          path: '/',
        };
      case 'reader':
        return {
          title: 'القارئ الرقمي المتطور | الرحيق المختوم',
          description: 'تصفح صفحات كتاب الرحيق المختوم كاملاً بوضع القراءة الفاخر، وضع الليل، العلامات المرجعية والتكبير.',
          path: '/reader',
        };
      case 'quiz':
        return {
          title: 'ساحة الاختبارات والتحديات | الرحيق المختوم',
          description: 'اختبر معرفتك في السيرة النبوية الشريفة عبر أكثر من 1200 سؤال وجواب تفاعلي وموثق.',
          path: '/quiz',
        };
      case 'mistakes':
        return {
          title: 'بنك المراجعة الذكي وتصحيح الأخطاء | الرحيق المختوم',
          description: 'راجع الأخطاء السابقة وحسّن مستواك في اختبارات السيرة النبوية لتثبيت الفهم والحفظ.',
          path: '/mistakes',
        };
      case 'analytics':
        return {
          title: 'لوحة الإحصائيات والأوسمة الماسية | الرحيق المختوم',
          description: 'تابع تقدمك في مسارات السيرة النبوية وافتح الأوسمة البرونزية والفضية والذهبية والماسية.',
          path: '/analytics',
        };
      default:
        return {
          title: 'الرحيق المختوم | المنصة التفاعلية للسيرة النبوية',
          description: 'منصة تفاعلية لقراءة ودراسة السيرة النبوية الشريفة.',
          path: '/',
        };
    }
  };

  const seo = getSeoDetails();

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'reader':
        return <ReaderView />;
      case 'quiz':
        return <QuizArenaView />;
      case 'mistakes':
        return <MistakesBankView />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-m3-surface text-m3-onSurface dark:bg-m3-surface-dark dark:text-m3-onSurface-dark transition-colors duration-300 font-arabic selection:bg-m3-primary-container selection:text-m3-primary-onContainer">
      {/* Dynamic SEO Meta & JSON-LD Structured Data */}
      <SeoMeta title={seo.title} description={seo.description} path={seo.path} />

      {/* Top Sticky Header */}
      <Navbar />

      {/* Main Animated View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Footer */}
      <Footer />

      {/* Dynamic Animated Modals */}
      <AnimatePresence>
        {isShareModalOpen && <ShareModal key="share-modal" />}
        {isAboutModalOpen && <AboutModal key="about-modal" />}
        <InstallPwaModal key="pwa-modal" />
        {isGiftModalOpen && <GiftDedicationModal key="gift-modal" />}
        {isContactModalOpen && <ContactModal key="contact-modal" />}
        {isCompletionModalOpen && <BookCompletionModal key="completion-modal" />}
        <DailyChallengeModal key="daily-challenge-modal" />
        <BadgeUnlockModal key="badge-modal" />
      </AnimatePresence>
    </div>
  );
};

export default App;
