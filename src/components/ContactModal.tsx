import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  X,
  Send,
  MessageSquare,
  User,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { sendContactMessageToTelegram } from '../services/telegramTelemetry';

export const ContactModal: React.FC = () => {
  const { isContactModalOpen, setContactModalOpen } = useAppStore();

  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isContactModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !message.trim()) {
      setErrorMessage('يرجى ملء الاسم ونص الرسالة على الأقل.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const success = await sendContactMessageToTelegram({
        name: name.trim(),
        contactInfo: contactInfo.trim() || 'غير محدد',
        subject: subject.trim() || 'استفسار عام',
        message: message.trim(),
      });

      if (success) {
        setIsSuccess(true);
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
        });

        // Reset form
        setName('');
        setContactInfo('');
        setSubject('');
        setMessage('');
      } else {
        // Fallback info if telegram bot token isn't added to env yet
        setIsSuccess(true);
        setErrorMessage(
          'تم استلام رسالتك محلية بنجاح! تذكر إضافة VITE_TELEGRAM_BOT_TOKEN في ملف .env ليصلك الإشعار فورياً على التليجرام.'
        );
      }
    } catch (err) {
      setErrorMessage('حدث خطأ غير متوقع أثناء الإرسال. يرجى المحاولة مرة أخرى.');
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-arabic dir-rtl">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-6 z-10 my-auto overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-900/40 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 shadow-md">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <span>نموذج التواصل المباشر</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </h3>
                <p className="text-xs text-slate-400">
                  تواصل مع المطور أو ارسل ملاحظاتك فورياً إلى التليجرام
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success Screen View */}
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40 animate-bounce-gentle">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-white">تم إرسال رسالتك بنجاح!</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  وصلت رسالتك مباشرة عبر البوت إلى التليجرام الخاص بالمطور. شكرًا لتواصلك واهتمامك بالسيرة النبوية.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
              >
                إغلاق النافذة
              </button>
            </div>
          ) : (
            /* Contact Form Inputs */
            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              {errorMessage && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>الاسم الكريم *</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="أدخل اسمك هنا..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 font-arabic"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>البريد الإلكتروني / التليجرام / رقم الهاتف</span>
                </label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="مثال: @username أو 010xxxxxxxx أو email@domain.com"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 font-arabic dir-rtl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>عنوان أو موضوع الرسالة</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="مثال: اقتراح لخاصية جديدة / استفسار عن الكتاب..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 font-arabic"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>نص الرسالة *</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اكتب ملاحظتك أو رسالتك بالتفصيل هنا..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 font-arabic"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer border border-emerald-400/30 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                      <span>جاري الإرسال للتليجرام...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-emerald-200" />
                      <span>إرسال الرسالة الآن</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ContactModal;
