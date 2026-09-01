import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { signInWithGoogle, signInWithCustomName } from '../services/authService';
import { X, UserCheck, Sparkles, ArrowRight, ShieldCheck, Mail, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, setUserProfile } = useAppStore();
  const [readerName, setReaderName] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isAuthModalOpen) return null;

  const handleGoogleLogin = async () => {
    setIsLoadingGoogle(true);
    setErrorMessage('');
    const result = await signInWithGoogle();
    setIsLoadingGoogle(false);
    if (result.success && result.user) {
      setUserProfile(result.user);
      setAuthModalOpen(false);
    } else if (result.error) {
      setErrorMessage(result.error);
    }
  };

  const handleDirectNameLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const profile = await signInWithCustomName(readerName, emailInput);
    setUserProfile(profile);
    setAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-arabic dir-rtl">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setAuthModalOpen(false)}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant/30 w-full max-w-md rounded-3xl shadow-2xl relative overflow-hidden flex flex-col z-10 my-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-800/80 rounded-2xl flex items-center justify-center text-amber-300 shadow-inner">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base leading-tight">تسجيل الدخول / حفظ التقدم</h3>
              <p className="text-xs text-emerald-200/90 font-light">احفظ تقدمك وسجل إجاباتك على السحاب</p>
            </div>
          </div>

          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 hover:bg-white/10 rounded-full transition text-white/80 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs rounded-xl font-semibold">
              {errorMessage}
            </div>
          )}

          {/* Google Sign In Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            disabled={isLoadingGoogle}
            className="w-full py-3.5 px-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold rounded-2xl border border-slate-300 dark:border-slate-700 shadow-sm hover:shadow-md transition flex items-center justify-center gap-3 cursor-pointer text-xs sm:text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isLoadingGoogle ? 'جاري الاتصال بـ Google...' : 'المتابعة والتسجيل بـ Google'}</span>
          </motion.button>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-m3-outline-variant/30" />
            <span className="text-[11px] font-bold text-m3-onSurface-variant">أو أدخل اسم القارئ مباشرة</span>
            <div className="flex-1 h-px bg-m3-outline-variant/30" />
          </div>

          {/* Simple Direct Name Form */}
          <form onSubmit={handleDirectNameLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-m3-onSurface mb-1">
                اسم القارئ:
              </label>
              <input
                type="text"
                value={readerName}
                onChange={(e) => setReaderName(e.target.value)}
                placeholder="مثال: أحمد (سيظهر القارئ أحمد)"
                className="w-full px-4 py-2.5 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-xl text-xs focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-m3-onSurface mb-1">
                البريد الإلكتروني (اختياري للمزامنة):
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-xl text-xs focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-emerald-200" />
              <span>دخول باسم القارئ</span>
            </motion.button>
          </form>

          <div className="pt-2 text-center text-[11px] text-m3-onSurface-variant flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>بياناتك تشفر وتخزن بأمان لوجه الله تعالى</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
