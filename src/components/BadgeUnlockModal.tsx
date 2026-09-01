import React, { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Trophy, Award, Medal, Crown, Diamond, Sparkles, X, Share2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

import { copyToClipboard } from '../utils/clipboard';

export const BadgeUnlockModal: React.FC = () => {
  const { unlockedBadgeModal, clearUnlockedBadgeModal, setCurrentView } = useAppStore();

  useEffect(() => {
    if (unlockedBadgeModal) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch {
        // ignore fallback
      }
    }
  }, [unlockedBadgeModal]);

  if (!unlockedBadgeModal) return null;

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'bronze':
        return <Medal className="w-10 h-10 text-amber-500" />;
      case 'silver':
        return <Award className="w-10 h-10 text-slate-300" />;
      case 'gold':
        return <Crown className="w-10 h-10 text-amber-400" />;
      case 'diamond':
        return <Diamond className="w-10 h-10 text-emerald-400 animate-pulse" />;
      default:
        return <Trophy className="w-10 h-10 text-amber-400" />;
    }
  };

  const getTierGradient = (tier: string) => {
    switch (tier) {
      case 'bronze':
        return 'from-amber-900/60 via-amber-800/40 to-slate-900 border-amber-700/60';
      case 'silver':
        return 'from-slate-700/60 via-slate-600/40 to-slate-900 border-slate-500/60';
      case 'gold':
        return 'from-amber-600/60 via-yellow-600/40 to-slate-900 border-amber-400/80';
      case 'diamond':
        return 'from-emerald-600/60 via-teal-600/40 to-slate-900 border-emerald-400/80';
      default:
        return 'from-emerald-900/60 via-slate-800/60 to-slate-900 border-emerald-500/60';
    }
  };

  const handleShareBadge = async () => {
    const text = `🏆 نلت وساماً جديداً في سيرة النبي الكريم ﷺ على منصة الرحيق المختوم!
وسام: «${unlockedBadgeModal.title}» — ${unlockedBadgeModal.description}
تابع رحلتك مع السيرة النبوية: ${window.location.origin}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: `وسام جديد - ${unlockedBadgeModal.title}`, text });
        return;
      } catch {
        // Fallback below
      }
    }

    const copied = await copyToClipboard(text);
    if (copied) {
      alert('تم نسخ نص الوسام بنجاح للمشاركة!');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md dir-rtl font-arabic">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 30 }}
          className={`w-full max-w-md bg-gradient-to-b ${getTierGradient(
            unlockedBadgeModal.tier
          )} border rounded-3xl p-6 shadow-2xl text-center space-y-6 relative overflow-hidden text-white`}
        >
          {/* Ambient Glow */}
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-amber-400/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

          {/* Close button */}
          <button
            onClick={clearUnlockedBadgeModal}
            className="absolute left-4 top-4 p-2 text-slate-400 hover:text-white bg-slate-800/60 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Celebration Title */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-amber-300 text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
              <span>إنجاز جديد فتحته الآن!</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">مبروك الحصول على الوسام</h2>
          </div>

          {/* Animated Badge Icon Container */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
            className="w-24 h-24 mx-auto rounded-3xl bg-slate-900/90 border-2 border-amber-400/60 flex items-center justify-center shadow-2xl relative group"
          >
            {getTierIcon(unlockedBadgeModal.tier)}
            <Sparkles className="w-5 h-5 text-amber-300 absolute -top-2 -right-2 animate-bounce-gentle" />
          </motion.div>

          {/* Badge Details */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-300 block">{unlockedBadgeModal.trackTitle}</span>
            <h3 className="text-xl font-black text-white">{unlockedBadgeModal.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
              {unlockedBadgeModal.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleShareBadge}
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة الإنجاز</span>
            </button>

            <button
              onClick={() => {
                clearUnlockedBadgeModal();
                setCurrentView('analytics');
              }}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl flex items-center gap-1 transition cursor-pointer"
            >
              <span>معرض الأوسمة</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BadgeUnlockModal;
