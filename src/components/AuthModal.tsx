import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  signInUser,
  signUpUser,
  sendTelegramPasswordResetOtp,
  verifyOtpAndResetPassword,
} from '../services/authService';
import {
  X,
  UserPlus,
  ShieldCheck,
  LogIn,
  Send,
  KeyRound,
  CheckCircle2,
  Lock,
  Mail,
  User,
  AtSign,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, setUserProfile, userProfile } = useAppStore();

  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');

  // Form States for Sign In / Sign Up
  const [readerName, setReaderName] = useState('');
  const [emailInput, setEmailInput] = useState(userProfile.email || '');
  const [telegramUsername, setTelegramUsername] = useState(userProfile.telegramUsername || '');
  const [password, setPassword] = useState('');

  // Form States for Password Reset via Telegram
  const [resetTelegramUsername, setResetTelegramUsername] = useState('');
  const [otpCodeInput, setOtpCodeInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isAuthModalOpen) return null;

  // Handle Sign In Submission (تسجيل الدخول - Restore stored name & avatar)
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const res = await signInUser({
      email: emailInput,
      password: password,
    });

    setIsLoading(false);

    if (res.success && res.user) {
      setUserProfile(res.user);
      setSuccessMessage(`أهلاً بك مجدداً يا ${res.user.name}! 🎉`);
      setTimeout(() => {
        setAuthModalOpen(false);
      }, 1000);
    } else if (res.error) {
      setErrorMessage(res.error);
    }
  };

  // Handle Sign Up Submission (إنشاء حساب جديد)
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!readerName.trim()) {
      setErrorMessage('يرجى إدخال اسم القارئ الكامل');
      return;
    }
    if (!emailInput.trim()) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const res = await signUpUser({
      name: readerName,
      email: emailInput,
      password: password,
      telegramUsername: telegramUsername,
    });

    setIsLoading(false);

    if (res.success && res.user) {
      setUserProfile(res.user);
      setSuccessMessage('تم إنشاء حسابك وتوثيقه بنجاح! 🎉');
      setTimeout(() => {
        setAuthModalOpen(false);
      }, 1200);
    } else if (res.error) {
      setErrorMessage(res.error);
    }
  };

  // Handle Requesting OTP Code via Telegram Bot
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTelegramUsername.trim()) {
      setErrorMessage('يرجى إدخال يوزر تليجرام الخاص بك (مثال: @username)');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const res = await sendTelegramPasswordResetOtp(resetTelegramUsername);
    setIsLoading(false);

    if (res.success) {
      setIsOtpSent(true);
      setSuccessMessage(res.message || 'تم إرسال كود التحقق بنجاح إلى تليجرام!');
    } else if (res.error) {
      setErrorMessage(res.error);
    }
  };

  // Handle OTP Verification & Password Reset
  const handleVerifyOtpAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCodeInput.trim() || !newPassword.trim()) {
      setErrorMessage('يرجى إدخال كود التحقق وكلمة المرور الجديدة');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const res = await verifyOtpAndResetPassword(resetTelegramUsername, otpCodeInput, newPassword);
    setIsLoading(false);

    if (res.success) {
      setSuccessMessage(res.message || 'تم تغيير كلمة المرور بنجاح!');
      setTimeout(() => {
        setAuthModalOpen(false);
      }, 1500);
    } else if (res.error) {
      setErrorMessage(res.error);
    }
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
              {mode === 'login' ? (
                <LogIn className="w-5 h-5" />
              ) : mode === 'signup' ? (
                <UserPlus className="w-5 h-5" />
              ) : (
                <KeyRound className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-black text-base leading-tight">
                {mode === 'login'
                  ? 'تسجيل الدخول (Sign In)'
                  : mode === 'signup'
                  ? 'إنشاء حساب جديد (Sign Up)'
                  : 'استعادة كلمة المرور'}
              </h3>
              <p className="text-xs text-emerald-200/90 font-light">
                منصة الرحيق المختوم — حفظ البيانات موثق محلياً وعبر تليجرام
              </p>
            </div>
          </div>

          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 hover:bg-white/10 rounded-full transition text-white/80 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs (Sign In / Sign Up / Reset) */}
        <div className="grid grid-cols-3 border-b border-m3-outline-variant/20 bg-m3-surface-container dark:bg-m3-surface-darkContainer p-1 text-center">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`py-2 text-xs font-bold rounded-2xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-m3-onSurface-variant hover:text-m3-onSurface'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>تسجيل الدخول</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`py-2 text-xs font-bold rounded-2xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'signup'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-m3-onSurface-variant hover:text-m3-onSurface'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>إنشاء حساب</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('reset');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`py-2 text-xs font-bold rounded-2xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'reset'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-m3-onSurface-variant hover:text-m3-onSurface'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>استعادة الرمز</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Direct Telegram Bot Deep Link Button */}
          <a
            href="https://t.me/te_data_bot?start=auth"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 bg-gradient-to-r from-sky-700 via-teal-700 to-emerald-800 hover:from-sky-800 hover:to-emerald-900 text-white font-bold rounded-2xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer group"
          >
            <Send className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition" />
            <span>تسجيل الدخول والتسجيل الفوري من داخل البوت (@te_data_bot)</span>
          </a>

          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs rounded-xl font-semibold">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              /* Mode 1: Sign In Form (Email + Password ONLY) */
              <motion.form
                key="signin-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleSignInSubmit}
                className="space-y-3.5"
              >
                <div>
                  <label className="block text-xs font-bold text-m3-onSurface mb-1">
                    البريد الإلكتروني الحساب: <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 pr-10 py-2.5 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-xl text-xs focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-bold"
                    />
                    <Mail className="w-4 h-4 absolute right-3 top-3 text-m3-onSurface-variant/50" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-m3-onSurface">كلمة المرور:</label>
                    <button
                      type="button"
                      onClick={() => setMode('reset')}
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                    >
                      نسيت كلمة المرور؟
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 pr-10 py-2.5 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-xl text-xs focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-bold"
                    />
                    <Lock className="w-4 h-4 absolute right-3 top-3 text-m3-onSurface-variant/50" />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <LogIn className="w-4 h-4 text-emerald-200" />
                  <span>{isLoading ? 'جاري التحقق والربط...' : 'تسجيل الدخول واستعادة الحساب (Sign In)'}</span>
                </motion.button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-xs text-m3-onSurface-variant hover:text-emerald-600 dark:hover:text-emerald-400 font-bold transition cursor-pointer"
                  >
                    ليس لديك حساب مسجّل؟ <span className="underline text-emerald-600 dark:text-emerald-400">إنشاء حساب جديد (Sign Up)</span>
                  </button>
                </div>
              </motion.form>
            ) : mode === 'signup' ? (
              /* Mode 2: Sign Up Form */
              <motion.form
                key="signup-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleSignUpSubmit}
                className="space-y-3.5"
              >
                <div>
                  <label className="block text-xs font-bold text-m3-onSurface mb-1">
                    اسم القارئ الكامل: <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={readerName}
                      onChange={(e) => setReaderName(e.target.value)}
                      placeholder="مثال: أحمد وسيصبح: القارئ أحمد"
                      className="w-full px-4 pr-10 py-2.5 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-xl text-xs font-bold focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    />
                    <User className="w-4 h-4 absolute right-3 top-3 text-m3-onSurface-variant/50" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-m3-onSurface mb-1">
                    البريد الإلكتروني: <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 pr-10 py-2.5 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-xl text-xs focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-bold"
                    />
                    <Mail className="w-4 h-4 absolute right-3 top-3 text-m3-onSurface-variant/50" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-m3-onSurface mb-1">
                    اسم مستخدم تليجرام (لاستعادة كلمة المرور):
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={telegramUsername}
                      onChange={(e) => setTelegramUsername(e.target.value)}
                      placeholder="مثال: @MohamedAyman"
                      className="w-full px-4 pr-10 py-2.5 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-xl text-xs font-bold focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    />
                    <AtSign className="w-4 h-4 absolute right-3 top-3 text-m3-onSurface-variant/50" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-m3-onSurface mb-1">
                    كلمة المرور: <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 pr-10 py-2.5 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-xl text-xs focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-bold"
                    />
                    <Lock className="w-4 h-4 absolute right-3 top-3 text-m3-onSurface-variant/50" />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <UserPlus className="w-4 h-4 text-emerald-200" />
                  <span>{isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب جديد (Sign Up)'}</span>
                </motion.button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-xs text-m3-onSurface-variant hover:text-emerald-600 dark:hover:text-emerald-400 font-bold transition cursor-pointer"
                  >
                    لديك حساب بالفعل؟ <span className="underline text-emerald-600 dark:text-emerald-400">تسجيل الدخول (Sign In)</span>
                  </button>
                </div>
              </motion.form>
            ) : (
              /* Mode 3: Password Reset via Telegram OTP */
              <motion.div
                key="reset-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {!isOtpSent ? (
                  /* Step 1: Request OTP */
                  <form onSubmit={handleRequestOtp} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-m3-onSurface mb-1">
                        أدخل اسم مستخدم تليجرام الخاص بك:
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={resetTelegramUsername}
                          onChange={(e) => setResetTelegramUsername(e.target.value)}
                          placeholder="مثال: @username"
                          className="w-full px-4 pr-10 py-2.5 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-xl text-xs font-bold focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                        />
                        <AtSign className="w-4 h-4 absolute right-3 top-3 text-m3-onSurface-variant/50" />
                      </div>
                    </div>

                    <p className="text-[11px] text-m3-onSurface-variant leading-relaxed">
                      سيتم إرسال كود تحقق سري (OTP من 6 أرقام) عبر بوت تليجرام الخاص بالمنصة لإعادة تعيين كلمة المرور فوراً.
                    </p>

                    <a
                      href="https://t.me/te_data_bot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-500" />
                      <span>افتـح البـوت لبدء استلام الرسائل (@te_data_bot)</span>
                    </a>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 text-white font-bold rounded-2xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-amber-300" />
                      <span>{isLoading ? 'جاري إرسال الكود...' : 'إرسال كود التحقق إلى تليجرام'}</span>
                    </motion.button>
                  </form>
                ) : (
                  /* Step 2: Enter OTP & New Password */
                  <form onSubmit={handleVerifyOtpAndReset} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-m3-onSurface mb-1">
                        أدخل كود التحقق (OTP) المرسل إلى تليجرام:
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otpCodeInput}
                        onChange={(e) => setOtpCodeInput(e.target.value)}
                        placeholder="مثال: 749201"
                        className="w-full px-4 py-2.5 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-xl text-center tracking-widest font-mono text-base font-bold focus:outline-hidden focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-m3-onSurface mb-1">
                        كلمة المرور الجديدة:
                      </label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="أدخل كلمة المرور الجديدة"
                        className="w-full px-4 py-2.5 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-xl text-xs focus:outline-hidden focus:border-emerald-600 font-bold"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Lock className="w-4 h-4 text-emerald-200" />
                      <span>{isLoading ? 'جاري التأكيد...' : 'تأكيد كلمة المرور الجديدة'}</span>
                    </motion.button>

                    <button
                      type="button"
                      onClick={() => setIsOtpSent(false)}
                      className="w-full text-center text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                    >
                      إعادة إرسال كود تحقق جديد
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-2 text-center text-[11px] text-m3-onSurface-variant flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>بياناتك تشفر وتخزن وتتراسل بأمان عبر بوت تليجرام</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
