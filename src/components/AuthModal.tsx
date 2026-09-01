import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  registerOrLoginWithTelegramEmail,
  sendTelegramPasswordResetOtp,
  verifyOtpAndResetPassword,
} from '../services/authService';
import { X, UserCheck, ShieldCheck, LogIn, Send, KeyRound, CheckCircle2, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, setUserProfile, userProfile } = useAppStore();

  const [activeTab, setActiveTab] = useState<'auth' | 'reset'>('auth');

  // Form States for Register/Login
  const [readerName, setReaderName] = useState(userProfile.name?.replace(/^القارئ\s+/, '') || '');
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

  // Handle Account Register / Login
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const res = await registerOrLoginWithTelegramEmail({
      name: readerName,
      email: emailInput,
      password: password,
      telegramUsername: telegramUsername,
    });

    setIsLoading(false);

    if (res.success && res.user) {
      setUserProfile(res.user);
      setAuthModalOpen(false);
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
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base leading-tight">حساب القارئ وتوثيق تليجرام</h3>
              <p className="text-xs text-emerald-200/90 font-light">مزامنة التقدم واستعادة الحساب عبر بوت تليجرام</p>
            </div>
          </div>

          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 hover:bg-white/10 rounded-full transition text-white/80 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-m3-outline-variant/20 bg-m3-surface-container dark:bg-m3-surface-darkContainer p-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('auth');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'auth'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-m3-onSurface-variant hover:text-m3-onSurface'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>تسجيل / دخول الحساب</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('reset');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'reset'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-m3-onSurface-variant hover:text-m3-onSurface'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>نسيت كلمة المرور</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
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
            {activeTab === 'auth' ? (
              /* Tab 1: Account Login / Register Form */
              <motion.form
                key="auth-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleAuthSubmit}
                className="space-y-3.5"
              >
                <div>
                  <label className="block text-xs font-bold text-m3-onSurface mb-1">
                    اسم القارئ الرسمي:
                  </label>
                  <input
                    type="text"
                    value={readerName}
                    onChange={(e) => setReaderName(e.target.value)}
                    placeholder="مثال: أحمد (سيصبح: القارئ أحمد)"
                    className="w-full px-4 py-2.5 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-xl text-xs font-bold focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-m3-onSurface mb-1">
                    البريد الإلكتروني: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-xl text-xs focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-m3-onSurface mb-1">
                    اسم مستخدم تليجرام (ربط واستعادة الحساب):
                  </label>
                  <input
                    type="text"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                    placeholder="مثال: @MohamedAyman"
                    className="w-full px-4 py-2.5 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-xl text-xs font-bold focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-m3-onSurface mb-1">
                    كلمة المرور:
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-xl text-xs focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <UserCheck className="w-4 h-4 text-emerald-200" />
                  <span>{isLoading ? 'جاري حفظ وبيان الحساب...' : 'حفظ وتأكيد دخول القارئ'}</span>
                </motion.button>
              </motion.form>
            ) : (
              /* Tab 2: Password Reset via Telegram OTP */
              <motion.div
                key="reset-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                {!isOtpSent ? (
                  /* Step 1: Request OTP */
                  <form onSubmit={handleRequestOtp} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-m3-onSurface mb-1">
                        أدخل اسم مستخدم تليجرام الخاص بك:
                      </label>
                      <input
                        type="text"
                        required
                        value={resetTelegramUsername}
                        onChange={(e) => setResetTelegramUsername(e.target.value)}
                        placeholder="مثال: @username"
                        className="w-full px-4 py-2.5 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-xl text-xs font-bold focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>

                    <p className="text-[11px] text-m3-onSurface-variant leading-relaxed">
                      سيتم إرسال كود تحقق سري (OTP من 6 أرقام) عبر بوت تليجرام الخاص بالمنصة لإعادة تعيين كلمة المرور فوراً.
                    </p>

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
