import React, { useState, useEffect } from 'react';
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
  Check,
  Sparkles,
  Award,
  Link2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    streak,
    mistakesBank,
    currentPage,
    totalPages,
    achievements,
    answeredQuestions,
    setShareModalOpen,
    setAboutModalOpen,
  } = useAppStore();

  const [tickerIndex, setTickerIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const mistakesCount = Object.keys(mistakesBank).length;
  const unlockedBadges = achievements.filter((a) => a.unlocked).length;
  const correctCount = Object.values(answeredQuestions).filter((q) => q.isCorrect).length;

  // Dynamic animated ticker data items for the bar link
  const tickerItems = [
    {
      id: 'link',
      icon: <Link2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />,
      text: 'رابط المنصة',
      highlight: '🔗 اضغط للنسخ',
      gradient: 'from-emerald-900/80 via-teal-900/80 to-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-emerald-900/30',
    },
    {
      id: 'page',
      icon: <BookOpen className="w-3.5 h-3.5 text-amber-400" />,
      text: 'التقدم الحالي',
      highlight: `ص ${currentPage} / ${totalPages}`,
      gradient: 'from-amber-950/80 via-amber-900/80 to-orange-950/90 text-amber-200 border-amber-500/40 shadow-amber-900/30',
    },
    {
      id: 'badges',
      icon: <Award className="w-3.5 h-3.5 text-yellow-400" />,
      text: 'الأوسمة المفتوحة',
      highlight: `${unlockedBadges} من ${achievements.length}`,
      gradient: 'from-yellow-950/80 via-amber-900/80 to-yellow-950/90 text-yellow-200 border-yellow-500/40 shadow-yellow-900/30',
    },
    {
      id: 'answers',
      icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400" />,
      text: 'إجابات صحيحة',
      highlight: `${correctCount} إجابة`,
      gradient: 'from-cyan-950/80 via-blue-900/80 to-cyan-950/90 text-cyan-200 border-cyan-500/40 shadow-cyan-900/30',
    },
  ];

  // Rotate ticker every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerItems.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [tickerItems.length]);

  const handleCopyLink = () => {
    const shareUrl = window.location.origin || 'https://al-raheeq-al-makhtom.vercel.app';
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setShareModalOpen(true);
    setTimeout(() => setCopied(false), 2500);
  };

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

  const currentItem = tickerItems[tickerIndex];

  return (
    <>
      {/* Desktop Top Header Bar */}
      <header className="sticky top-0 z-40 bg-m3-surface/90 dark:bg-m3-surface-dark/90 backdrop-blur-md border-b border-m3-outline-variant/30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Right Logo & Title */}
          <div
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center shadow-m3-2 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight text-m3-primary dark:text-m3-primary-dark">
                الرحيق المختوم
              </h1>
              <p className="text-xs text-m3-onSurface-variant dark:text-m3-onSurface-darkVariant font-medium hidden sm:block">
                السيرة النبوية التفاعلية
              </p>
            </div>
          </div>

          {/* Animated Live Data Link Bar Button */}
          <button
            onClick={handleCopyLink}
            className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-full border bg-gradient-to-r ${currentItem.gradient} backdrop-blur-md shadow-md hover:scale-105 active:scale-95 transition-all duration-300 group overflow-hidden cursor-pointer shrink-0`}
            title="انقر لنسخ ومشاركة رابط المنصة وحفظ الإنجازات"
          >
            {/* Shimmer Light Bar */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="copied"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5 text-xs font-black text-emerald-300"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>تم نسخ الرابط! ✨</span>
                </motion.div>
              ) : (
                <motion.div
                  key={currentItem.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-2 text-xs font-bold"
                >
                  {currentItem.icon}
                  <span className="text-[11px] opacity-90 hidden md:inline">{currentItem.text}:</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-white font-black text-[11px] tracking-wide shadow-xs">
                    {currentItem.highlight}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-m3-surface-dim/70 dark:bg-m3-surface-darkContainer p-1.5 rounded-full border border-m3-outline-variant/20">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-m3-primary-container text-m3-primary-onContainer shadow-sm font-semibold'
                      : 'text-m3-onSurface-variant hover:text-m3-onSurface hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold bg-amber-600 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Left Actions & Badges */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Streak Counter Pill */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 dark:bg-amber-400/10 text-amber-700 dark:text-amber-300 rounded-full border border-amber-500/20 text-xs font-bold"
              title="سلسلة الأيام المتتالية"
            >
              <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-amber-500 animate-bounce" />
              <span>{streak} أيام</span>
            </div>

            {/* Social Share Button */}
            <button
              onClick={() => setShareModalOpen(true)}
              className="p-2.5 text-m3-onSurface-variant hover:text-m3-primary hover:bg-m3-primary-container/40 rounded-full transition"
              title="مشاركة الإنجازات"
            >
              <Share2 className="w-5 h-5" />
            </button>

            {/* About & Developer Info */}
            <button
              onClick={() => setAboutModalOpen(true)}
              className="p-2.5 text-m3-onSurface-variant hover:text-m3-primary hover:bg-m3-primary-container/40 rounded-full transition"
              title="عن التطبيق والمطور"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (M3 Standard) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-m3-surface/95 dark:bg-m3-surface-dark/95 backdrop-blur-lg border-t border-m3-outline-variant/30 px-2 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all ${
                isActive
                  ? 'text-m3-primary dark:text-m3-primary-dark font-bold'
                  : 'text-m3-onSurface-variant/70 hover:text-m3-onSurface'
              }`}
            >
              <div
                className={`relative p-1.5 rounded-full transition-colors ${
                  isActive ? 'bg-m3-primary-container text-m3-primary-onContainer' : ''
                }`}
              >
                {item.icon}
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-4 px-1 text-[10px] font-bold bg-amber-600 text-white rounded-full">
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
