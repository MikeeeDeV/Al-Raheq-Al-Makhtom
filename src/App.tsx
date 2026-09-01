import React from 'react';
import { useAppStore } from './store/useAppStore';
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
import { SeoMeta } from './components/SeoMeta';

export const App: React.FC = () => {
  const { currentView } = useAppStore();

  const getSeoDetails = () => {
    switch (currentView) {
      case 'home':
        return {
          title: 'الرحيق المختوم | المنصة التفاعلية للسيرة النبوية المطهرة',
          description: 'منظومة تفاعلية عصرية لقراءة ودراسة واختبار كتاب الرحيق المختوم في السيرة النبوية للمباركفوري. تضم 1200 سؤال موثق.',
          path: '/',
        };
      case 'reader':
        return {
          title: 'قارئ الكتاب التفاعلي | الرحيق المختوم',
          description: 'اقرأ صفحات كتاب الرحيق المختوم بعالي الدقة مع الوضع الليلي والعلامات المرجعية.',
          path: '/reader',
        };
      case 'quiz':
        return {
          title: 'ساحة المسابقات والتحديات | الرحيق المختوم',
          description: 'اختبر حصيلتك في السيرة النبوية مع 1200 سؤال وجواب تفاعلي وموثق مقسمة على كافة فصول الكتاب.',
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
      {/* Dynamic Dynamic SEO Meta Management */}
      <SeoMeta title={seo.title} description={seo.description} path={seo.path} />

      {/* Top Sticky Header */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {renderView()}
      </main>

      {/* Bottom Footer */}
      <Footer />

      {/* Dynamic Modals */}
      <ShareModal />
      <AboutModal />
      <InstallPwaModal />
      <GiftDedicationModal />
    </div>
  );
};

export default App;
