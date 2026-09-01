import React, { useEffect, Suspense, lazy } from 'react';
import { useAppStore, getInitialViewFromUrl } from './store/useAppStore';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { SeoMeta } from './components/SeoMeta';
import { trackNewVisitorSession, sendErrorTelemetryToTelegram } from './services/telegramTelemetry';
import { initGoogleAnalytics } from './services/googleAnalytics';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';

// Lazy-loaded Views for Instant Initial Paint & Code Splitting (Lighthouse 90+ Score)
const ReaderView = lazy(() => import('./views/ReaderView'));
const QuizArenaView = lazy(() => import('./views/QuizArenaView').then(m => ({ default: m.QuizArenaView })));
const MistakesBankView = lazy(() => import('./views/MistakesBankView'));
const AnalyticsView = lazy(() => import('./views/AnalyticsView'));

// Lazy-loaded Modals
const ShareModal = lazy(() => import('./components/ShareModal'));
const AboutModal = lazy(() => import('./components/AboutModal'));
const InstallPwaModal = lazy(() => import('./components/InstallPwaModal').then(m => ({ default: m.InstallPwaModal })));
const GiftDedicationModal = lazy(() => import('./components/GiftDedicationModal'));
const ContactModal = lazy(() => import('./components/ContactModal'));
const BookCompletionModal = lazy(() => import('./components/BookCompletionModal'));
const DailyChallengeModal = lazy(() => import('./components/DailyChallengeModal'));
const BadgeUnlockModal = lazy(() => import('./components/BadgeUnlockModal'));

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
          description:
            'منظومة تفاعلية شاملة لقراءة ودراسة كتاب الرحيق المختوم للمباركفوري مع 1200 سؤال وجواب، قارئ PDF متطور، وبنك مراجعة للاختبارات.',
          path: '/',
        };
      case 'reader':
        return {
          title: 'قارئ كتاب الرحيق المختوم PDF التفاعلي | المنصة الرسمية',
          description:
            'اقرأ وتصفح كتاب الرحيق المختوم كاملاً بدقة عالية، مع إمكانية التظليل، وضع الفواصل، والتنقل الذكي بين الفصول والصفحات.',
          path: '/reader',
        };
      case 'quiz':
        return {
          title: 'ساحة مسابقات واختبارات السيرة النبوية (1200 سؤال وجواب)',
          description:
            'اختبر حصيلتك في سيرة النبي محمد ﷺ عبر 1200 سؤال وجواب موثق مقسمة حسب الفصول التاريخية مع نظام نقاط وأوسمة تفاعلي.',
          path: '/quiz',
        };
      case 'mistakes':
        return {
          title: 'بنك المراجعة والتصحيح الذكي | منصة الرحيق المختوم',
          description:
            'سجل مراجعاتك الشخصية والأسئلة غير المجابة لإعادة مراجعتها وتثبيت المعلومات الحفظية والتاريخية للسيرة النبوية.',
          path: '/mistakes',
        };
      case 'analytics':
        return {
          title: 'لوحة الإحصائيات والإنجاز الشخصي | منصة الرحيق المختوم',
          description:
            'تتبع نسبة تقدمك في قراءة الكتاب، دقة إجاباتك في المسابقات، ونسبة إنجاز المراحل التاريخية للسيرة النبوية.',
          path: '/analytics',
        };
      default:
        return {
          title: 'الرحيق المختوم | المنصة التفاعلية للسيرة النبوية',
          description: 'منظومة تفاعلية لقراءة ودراسة السيرة النبوية الشريفة واختبار معلوماتك.',
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

  const LoadingFallback = () => (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3 py-12">
      <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-xs font-bold text-m3-onSurface-variant animate-pulse">جاري التحميل...</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-m3-surface text-m3-onSurface dark:bg-m3-surface-dark dark:text-m3-onSurface-dark transition-colors duration-300 font-arabic selection:bg-m3-primary-container selection:text-m3-primary-onContainer">
      {/* Dynamic SEO Meta & JSON-LD Structured Data */}
      <SeoMeta title={seo.title} description={seo.description} path={seo.path} />

      {/* Top Sticky Header */}
      <Navbar />

      {/* Main Animated View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        <Suspense fallback={<LoadingFallback />}>
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
        </Suspense>
      </main>

      {/* Bottom Footer */}
      <Footer />

      {/* Dynamic Animated Modals */}
      <Suspense fallback={null}>
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
      </Suspense>

      {/* Vercel Web Analytics */}
      <Analytics />
    </div>
  );
};

export default App;
