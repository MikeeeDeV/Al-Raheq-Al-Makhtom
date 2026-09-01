import React from 'react';
import { useAppStore, AppView } from '../store/useAppStore';
import {
  BookOpen,
  HelpCircle,
  AlertTriangle,
  BarChart3,
  Flame,
  Share2,
  Info,
  Home,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    streak,
    mistakesBank,
    setShareModalOpen,
    setAboutModalOpen,
  } = useAppStore();

  const mistakesCount = Object.keys(mistakesBank).length;

  const navItems: { id: AppView; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'الرئيسية', icon: <Home className="w-5 h-5" /> },
    { id: 'reader', label: 'القارئ', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'quiz', label: 'الاختبارات', icon: <HelpCircle className="w-5 h-5" /> },
    {
      id: 'mistakes',
      label: 'بنك المراجعة',
      icon: <AlertTriangle className="w-5 h-5" />,
      badge: mistakesCount > 0 ? mistakesCount : undefined,
    },
    { id: 'analytics', label: 'الإحصائيات', icon: <BarChart3 className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Desktop Top Header Bar */}
      <header className="sticky top-0 z-40 bg-m3-surface/90 dark:bg-m3-surface-dark/90 backdrop-blur-md border-b border-m3-outline-variant/30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Right Logo & Title */}
          <div
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center shadow-m3-2 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight text-m3-primary dark:text-m3-primary-dark">
                الرحيق المختوم
              </h1>
              <p className="text-xs text-m3-onSurface-variant dark:text-m3-onSurface-darkVariant font-medium">
                السيرة النبوية التفاعلية
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links with Animated Sliding Active Pill */}
          <nav className="hidden md:flex items-center gap-1 bg-m3-surface-dim/70 dark:bg-m3-surface-darkContainer p-1.5 rounded-full border border-m3-outline-variant/20">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'text-m3-primary-onContainer font-bold'
                      : 'text-m3-onSurface-variant hover:text-m3-onSurface hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeDesktopNavPill"
                      className="absolute inset-0 bg-m3-primary-container rounded-full shadow-xs"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold bg-amber-600 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Left Actions & Badges */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak Counter Pill */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 dark:bg-amber-400/10 text-amber-700 dark:text-amber-300 rounded-full border border-amber-500/20 text-xs sm:text-sm font-bold"
              title="سلسلة الأيام المتتالية"
            >
              <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-amber-500 animate-bounce" />
              <span>{streak} أيام</span>
            </div>

            {/* Social Share Button */}
            <button
              onClick={() => setShareModalOpen(true)}
              className="p-2.5 text-m3-onSurface-variant hover:text-m3-primary hover:bg-m3-primary-container/40 rounded-full transition cursor-pointer"
              title="مشاركة الإنجازات"
            >
              <Share2 className="w-5 h-5" />
            </button>

            {/* About & Developer Info */}
            <button
              onClick={() => setAboutModalOpen(true)}
              className="p-2.5 text-m3-onSurface-variant hover:text-m3-primary hover:bg-m3-primary-container/40 rounded-full transition cursor-pointer"
              title="عن التطبيق والمطور"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (M3 Standard with Animated Active Pill) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-m3-surface/95 dark:bg-m3-surface-dark/95 backdrop-blur-lg border-t border-m3-outline-variant/30 px-2 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-colors cursor-pointer ${
                isActive
                  ? 'text-m3-primary dark:text-m3-primary-dark font-bold'
                  : 'text-m3-onSurface-variant/70 hover:text-m3-onSurface'
              }`}
            >
              <div className="relative p-1.5 rounded-full">
                {isActive && (
                  <motion.div
                    layoutId="activeMobileNavPill"
                    className="absolute inset-0 bg-m3-primary-container rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center">
                  {item.icon}
                </span>
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 z-20 flex items-center justify-center min-w-[18px] h-4 px-1 text-[10px] font-bold bg-amber-600 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] leading-none">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default Navbar;
