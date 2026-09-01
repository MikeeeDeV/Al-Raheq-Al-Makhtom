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

export const App: React.FC = () => {
  const { currentView } = useAppStore();

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
    </div>
  );
};

export default App;
