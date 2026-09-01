import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  X,
  Send,
  MessageSquare,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { sendContactMessageToTelegram } from '../services/telegramTelemetry';

const PRESET_SUBJECTS = [
  '💡 اقتراح ميزة',
  '🐛 بلاغ تقني',
  '✨ كلمة شكر',
  '🤝 استفسار',
];

export const ContactModal: React.FC = () => {
  const { isContactModalOpen, setContactModalOpen } = useAppStore();

  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isContactModalOpen) {
      const savedName = localStorage.getItem('alraheeq_contact_name') || '';
      const savedContact = localStorage.getItem('alraheeq_contact_info') || '';

      if (savedName && !name) setName(savedName);
      if (savedContact && !contactInfo) setContactInfo(savedContact);
    }
  }, [isContactModalOpen]);

  if (!isContactModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !message.trim()) {
      setErrorMessage('يرجى كتابة الاسم ونص الرسالة');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      localStorage.setItem('alraheeq_contact_name', name.trim());
      if (contactInfo.trim()) {
        localStorage.setItem('alraheeq_contact_info', contactInfo.trim());
      }

      const success = await sendContactMessageToTelegram({
        name: name.trim(),
        contactInfo: contactInfo.trim() || 'غير محدد',
        subject: subject.trim() || 'تواصل عام',
        message: message.trim(),
      });

      if (success) {
        setIsSuccess(true);
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
        });
        setSubject('');
        setMessage('');
      } else {
        setErrorMessage('تعذر الإرسال حالياً. يرجى إعادة المحاولة.');
      }
    } catch {
      setErrorMessage('حدث خطأ أثناء الإرسال. حاول مجدداً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setErrorMessage('');
    setContactModalOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 font-arabic dir-rtl overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          className="relative w-full max-w-md bg-slate-900/95 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-100 space-y-5 z-10 my-auto overflow-hidden backdrop-blur-2xl"
        >
          {/* Top Decorative Ambient Glow */}
          <div className="absolute top-0 right-1/2 translate-x-1/2 h-1 w-3/4 bg-gradient-to-r from-emerald-500/0 via-emerald-400 to-teal-500/0" />

          {/* Clean Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                  <span>تواصل مع المطور</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h3>
                <p className="text-[11px] text-slate-400">
                  رسالتك تصل مباشرة وسريعة للمطور
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </motion.button>
          </div>

          {/* Success Screen View */}
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 text-center space-y-4"
            >
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 shadow-lg">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-lg font-black text-white">وصلت رسالتك بنجاح!</h4>
                <p className="text-xs text-slate-300 font-medium">
                  شكراً لك، سيتم قراءة الرسالة والرد عليك في أقرب وقت.
                </p>
              </div>

              <div className="pt-3 flex items-center justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsSuccess(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  رسالة جديدة
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="px-6 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  تم
                </motion.button>
              </div>
            </motion.div>
          ) : (
            /* Clean Minimal Form */
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-semibold flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              {/* Name & Contact (2-Col Grid on Desktop) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                    <User className="w-3 h-3 text-emerald-400" />
                    <span>الاسم الكريم *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="اسمك..."
                    className="w-full px-3.5 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-400" />
                    <span>التواصل (اختياري)</span>
                  </label>
                  <input
                    type="text"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="بريد أو واتساب..."
                    className="w-full px-3.5 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 transition"
                  />
                </div>
              </div>

              {/* Subject Presets */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-300">موضوع الرسالة</label>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_SUBJECTS.map((preset) => (
                    <motion.button
                      key={preset}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSubject(preset)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                        subject === preset
                          ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 shadow-xs'
                          : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                      }`}
                    >
                      {preset}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Message Field */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">نص الرسالة *</label>
                <div className="relative">
                  <textarea
                    required
                    rows={3.5}
                    maxLength={800}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="اكتب ملاحظتك أو استفسارك هنا..."
                    className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 transition resize-none leading-relaxed"
                  />
                  <span className="absolute bottom-2 left-3 text-[9px] text-slate-500 font-mono">
                    {message.length}/800
                  </span>
                </div>
              </div>

              {/* Clean Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  إلغاء
                </button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer border border-emerald-400/30 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-200" />
                      <span>جاري الإرسال...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-emerald-200" />
                      <span>إرسال الآن</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ContactModal;

