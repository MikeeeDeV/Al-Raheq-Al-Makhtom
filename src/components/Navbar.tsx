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
  MessageSquare,
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
    { id: 'home', label: 'الرئيسية', icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'reader', label: 'القارئ', icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'quiz', label: 'الاختبارات', icon: <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" /> },
    {
      id: 'mistakes',
      label: 'المراجعة',
      icon: <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />,
      badge: mistakesCount > 0 ? mistakesCount : undefined,
    },
    { id: 'analytics', label: 'الإحصائيات', icon: <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" /> },
  ];

  return (
    <>
      {/* Top Header Bar (Desktop & Mobile Supercharged) */}
      <header className="sticky top-0 z-40 bg-m3-surface/90 dark:bg-m3-surface-dark/90 backdrop-blur-xl border-b border-m3-outline-variant/30 transition-all shadow-xs font-arabic dir-rtl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Title */}
          <div
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0 border border-emerald-400/30">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            </div>
            <div>
              <h1 className="font-black text-sm sm:text-lg leading-tight tracking-tight text-m3-primary dark:text-m3-primary-dark flex items-center gap-1">
                <span>الرحيق المختوم</span>
              </h1>
              <p className="hidden sm:block text-[10px] sm:text-[11px] text-m3-onSurface-variant dark:text-m3-onSurface-darkVariant font-medium">
                السيرة النبوية التفاعلية الموثقة
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-m3-surface-container/60 dark:bg-m3-surface-darkContainer/60 p-1.5 rounded-full border border-m3-outline-variant/20 shadow-inner">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'text-emerald-950 dark:text-emerald-100'
                      : 'text-m3-onSurface-variant hover:text-m3-onSurface hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeDesktopNavPill"
                      className="absolute inset-0 bg-gradient-to-r from-emerald-200 to-teal-200 dark:from-emerald-900/70 dark:to-teal-900/70 rounded-full shadow-xs border border-emerald-400/40"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {item.icon}
                    <span>{item.label === 'المراجعة' ? 'بنك المراجعة' : item.label}</span>
                    {item.badge !== undefined && (
                      <span className="flex items-center justify-center min-w-[18px] h-4 px-1 text-[10px] font-black bg-rose-600 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Top Actions & Badges */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Streak Counter Pill */}
            <div
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-amber-500/15 dark:bg-amber-400/15 text-amber-900 dark:text-amber-300 rounded-full border border-amber-500/30 text-xs font-black shrink-0"
              title="سلسلة الأيام المتتالية (Streak)"
            >
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400 fill-amber-500 animate-bounce-gentle" />
              <span>{streak}d</span>
            </div>

            {/* Social Share Button */}
            <button
              onClick={() => setShareModalOpen(true)}
              className="p-2 sm:p-2.5 text-m3-onSurface-variant hover:text-m3-primary hover:bg-m3-primary-container/40 rounded-full transition cursor-pointer"
              title="مشاركة الإنجازات"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Contact Form Button */}
            <button
              onClick={() => useAppStore.getState().setContactModalOpen(true)}
              className="p-2 sm:p-2.5 text-m3-onSurface-variant hover:text-m3-primary hover:bg-m3-primary-container/40 rounded-full transition cursor-pointer"
              title="تواصل مع المطور"
            >
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
            </button>

            {/* About & Developer Info */}
            <button
              onClick={() => setAboutModalOpen(true)}
              className="p-2 sm:p-2.5 text-m3-onSurface-variant hover:text-m3-primary hover:bg-m3-primary-container/40 rounded-full transition cursor-pointer"
              title="عن التطبيق والمطور"
            >
              <Info className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Ergonomic & Glassmorphic) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-m3-surface/95 dark:bg-m3-surface-dark/95 backdrop-blur-2xl border-t border-m3-outline-variant/30 px-1 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] flex items-center justify-around shadow-2xl font-arabic dir-rtl">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`relative flex flex-col items-center gap-1 px-2 py-1 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'text-emerald-700 dark:text-emerald-300 font-black'
                  : 'text-m3-onSurface-variant/70 hover:text-m3-onSurface font-medium'
              }`}
            >
              <div className="relative p-1 rounded-full">
                {isActive && (
                  <motion.div
                    layoutId="activeMobileNavPill"
                    className="absolute inset-0 bg-emerald-500/20 dark:bg-emerald-400/20 rounded-full shadow-xs border border-emerald-500/30"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center">
                  {item.icon}
                </span>
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 z-20 flex items-center justify-center min-w-[18px] h-4 px-1 text-[10px] font-black bg-rose-600 text-white rounded-full shadow-xs animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] leading-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default Navbar;
