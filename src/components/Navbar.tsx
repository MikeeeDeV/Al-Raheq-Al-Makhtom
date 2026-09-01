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
  Sparkles,
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
    { id: 'home', label: 'الرئيسية', icon: <Home className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> },
    { id: 'reader', label: 'القارئ', icon: <BookOpen className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> },
    { id: 'quiz', label: 'الاختبارات', icon: <HelpCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> },
    {
      id: 'mistakes',
      label: 'المراجعة',
      icon: <AlertTriangle className="w-4 h-4 sm:w-4.5 sm:h-4.5" />,
      badge: mistakesCount > 0 ? mistakesCount : undefined,
    },
    { id: 'analytics', label: 'الإحصائيات', icon: <BarChart3 className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> },
  ];

  return (
    <>
      {/* Top Header Bar - Next-Gen Mobile-Optimized Glassmorphic Header */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-950/85 backdrop-blur-2xl border-b border-slate-200/60 dark:border-slate-800/60 transition-all shadow-xs font-arabic dir-rtl pt-[env(safe-area-inset-top,0px)]">
        {/* Subtle Top Ambient Glow Accent */}
        <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500/0 via-emerald-500/80 to-teal-500/0" />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-15 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Brand Emblem */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group shrink-0 select-none"
          >
            <div className="relative">
              <div className="w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-emerald-700 via-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:shadow-emerald-500/40 transition-all border border-emerald-400/40">
                <BookOpen className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-amber-300 transform group-hover:rotate-6 transition-transform" />
              </div>
              <Sparkles className="w-3 h-3 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-sm sm:text-lg leading-tight tracking-tight bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-700 dark:from-emerald-300 dark:via-teal-200 dark:to-emerald-400 bg-clip-text text-transparent">
                  الرحيق المختوم
                </h1>
              </div>
              <p className="hidden sm:block text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none">
                السيرة النبوية العطرة كاملة
              </p>
            </div>
          </motion.div>

          {/* Desktop Floating Pill Navigation Dock */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/80 p-1.5 rounded-full border border-slate-200/80 dark:border-slate-800/80 shadow-inner">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer select-none ${
                    isActive
                      ? 'text-emerald-950 dark:text-emerald-50'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeDesktopNavPill"
                      className="absolute inset-0 bg-gradient-to-r from-emerald-300/80 via-teal-300/80 to-emerald-200/80 dark:from-emerald-800/90 dark:via-teal-800/90 dark:to-emerald-900/90 rounded-full shadow-md border border-emerald-400/50"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {item.icon}
                    <span>{item.label === 'المراجعة' ? 'بنك المراجعة' : item.label}</span>
                    {item.badge !== undefined && (
                      <span className="flex items-center justify-center min-w-[18px] h-4 px-1 text-[10px] font-black bg-rose-600 text-white rounded-full shadow-xs animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools Capsule */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Streak Counter Glowing Pill */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 text-amber-900 dark:text-amber-300 rounded-full border border-amber-500/30 text-xs font-black shrink-0 shadow-xs cursor-default"
              title="سلسلة أيام القراءة المتتالية"
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce-gentle" />
              <span className="font-mono">{streak}d</span>
            </motion.div>

            {/* Mobile Icon Capsule Container */}
            <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-100/70 dark:bg-slate-900/70 p-1 sm:p-1 rounded-full border border-slate-200/60 dark:border-slate-800/60 shadow-xs">
              {/* Social Share Button */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.88 }}
                onClick={() => setShareModalOpen(true)}
                className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-full transition cursor-pointer"
                title="مشاركة الإنجازات التطبيق"
              >
                <Share2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </motion.button>

              {/* Contact Developer Button */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.88 }}
                onClick={() => useAppStore.getState().setContactModalOpen(true)}
                className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-full transition cursor-pointer"
                title="تواصل مع المطور"
              >
                <MessageSquare className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-600 dark:text-emerald-400" />
              </motion.button>

              {/* About Info Button */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.88 }}
                onClick={() => setAboutModalOpen(true)}
                className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-full transition cursor-pointer"
                title="عن التطبيق والمطور"
              >
                <Info className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Island Mobile Bottom Navigation Dock */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-40 font-arabic dir-rtl pointer-events-none">
        <nav className="pointer-events-auto bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-2xl border border-white/20 dark:border-slate-800/80 rounded-3xl px-2 py-2 flex items-center justify-around shadow-2xl shadow-black/40">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all cursor-pointer select-none ${
                  isActive
                    ? 'text-emerald-400 font-black'
                    : 'text-slate-400 hover:text-slate-200 font-medium'
                }`}
              >
                <div className="relative flex items-center justify-center p-1">
                  {isActive && (
                    <motion.div
                      layoutId="activeMobileDock"
                      className="absolute inset-0 bg-emerald-500/25 rounded-2xl border border-emerald-500/40 shadow-xs"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center">
                    {item.icon}
                  </span>
                  {item.badge !== undefined && (
                    <span className="absolute -top-1 -right-1 z-20 flex items-center justify-center min-w-[16px] h-3.5 px-1 text-[9px] font-black bg-rose-600 text-white rounded-full shadow-xs animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] leading-none font-bold">{item.label}</span>

                {/* Subtle active glow dot */}
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-emerald-400 shadow-xs shadow-emerald-400" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Navbar;

