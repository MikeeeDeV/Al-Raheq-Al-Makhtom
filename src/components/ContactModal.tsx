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
  ShieldCheck,
  Tag,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { sendContactMessageToTelegram } from '../services/telegramTelemetry';

// Preset subject suggestions to accelerate filling the form without adding new input fields
const PRESET_SUBJECTS = [
  '💡 اقتراح لميزة جديدة',
  '🐛 الإبلاغ عن ملاحظة تقنية',
  '✨ كلمة طيبة وتشجيع',
  '📚 سؤال في السيرة النبوية',
  '🤝 استفسار عام',
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
  const [isAutofilled, setIsAutofilled] = useState(false);

  // Auto-fill saved credentials from localStorage on modal open
  useEffect(() => {
    if (isContactModalOpen) {
      const savedName = localStorage.getItem('alraheeq_contact_name') || '';
      const savedContact = localStorage.getItem('alraheeq_contact_info') || '';

      if (savedName || savedContact) {
        if (savedName && !name) setName(savedName);
        if (savedContact && !contactInfo) setContactInfo(savedContact);
        setIsAutofilled(true);
      }
    }
  }, [isContactModalOpen]);

  if (!isContactModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !message.trim()) {
      setErrorMessage('يرجى ملء الاسم الكريم ونص الرسالة على الأقل.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Save identity locally for instant zero-delay autofill next time
      localStorage.setItem('alraheeq_contact_name', name.trim());
      if (contactInfo.trim()) {
        localStorage.setItem('alraheeq_contact_info', contactInfo.trim());
      }

      const success = await sendContactMessageToTelegram({
        name: name.trim(),
        contactInfo: contactInfo.trim() || 'غير محدد',
        subject: subject.trim() || 'استفسار عام',
        message: message.trim(),
      });

      if (success) {
        setIsSuccess(true);
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
        });

        // Clear only subject & message for next use, keeping saved name/contact info ready
        setSubject('');
        setMessage('');
      } else {
        setErrorMessage('تعذر الإرسال حالياً. يرجى التأكد من الاتصال بالإنترنت وتجربة الإرسال مجدداً.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-arabic dir-rtl">
      {/* Backdrop with enhanced blur */}
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
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-6 z-10 my-auto overflow-hidden"
      >
        {/* Ambient Light Orbs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-gradient-to-tr from-emerald-900/60 to-emerald-800/40 border border-emerald-500/40 rounded-2xl flex items-center justify-center text-emerald-400 shadow-md shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>نموذج التواصل المباشر</span>
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
              </h3>
              <p className="text-xs text-slate-400 font-light">
                تواصل مباشر وآمن مع مطوّر المنصة لإرسال ملاحظاتك واستفساراتك
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Encryption & Security Badge */}
        <div className="flex items-center justify-between gap-2 p-2.5 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-xs text-emerald-300 relative z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold text-[11px] sm:text-xs">
              تشفير مباشر • اتصال آمن ومباشر لسرعة الاستجابة
            </span>
          </div>

          {isAutofilled && (
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded-full flex items-center gap-1 shrink-0">
              <Zap className="w-3 h-3" />
              <span>مُعبأ آلياً</span>
            </span>
          )}
        </div>

        {/* Success Screen View */}
        {isSuccess ? (
          <div className="py-8 text-center space-y-5 relative z-10">
            <div className="w-18 h-18 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40 shadow-xl animate-bounce-gentle">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2 max-w-sm mx-auto">
              <h4 className="text-xl font-black text-white">تم إرسال رسالتك بنجاح!</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                وصلت رسالتك بنجاح ومباشرة إلى مطوّر المنصة، وسوف يتم الرد والاهتمام بملاحظتك في أقرب وقت.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setIsSuccess(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                كتابة رسالة أخرى
              </button>
              <button
                onClick={handleClose}
                className="w-full sm:w-auto px-7 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        ) : (
          /* Form Inputs */
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {errorMessage && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Field 1: Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>الاسم الكريم</span>
                </span>
                <span className="text-amber-400 text-[11px] font-bold">* مطلوب</span>
              </label>
              <input
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسمك هنا..."
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition font-arabic"
              />
            </div>

            {/* Field 2: Contact Info */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>وسيلة التواصل</span>
                </span>
                <span className="text-slate-400 text-[10px] font-normal">(اختياري للرد عليك)</span>
              </label>
              <input
                type="text"
                autoComplete="email tel"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="مثال: email@domain.com أو 010xxxxxxxx"
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition font-arabic dir-rtl"
              />
            </div>

            {/* Field 3: Subject & Quick Preset Chips */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-400" />
                  <span>موضوع الرسالة</span>
                </span>
              </label>
              <input
                type="text"
                autoComplete="off"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="مثال: اقتراح ميزة جديدة / استفسار..."
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition font-arabic"
              />

              {/* Subject Quick Selector Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_SUBJECTS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSubject(preset)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition cursor-pointer ${
                      subject === preset
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Field 4: Message & Character Counter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>نص الرسالة</span>
                </span>
                <span className="text-amber-400 text-[11px] font-bold">* مطلوب</span>
              </label>
              <div className="relative">
                <textarea
                  required
                  rows={4}
                  maxLength={1000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اكتب ملاحظتك أو استفسارك بالتفصيل هنا..."
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition font-arabic resize-none"
                />
                <span className="absolute bottom-2.5 left-3 text-[10px] text-slate-500 font-mono">
                  {message.length} / 1000
                </span>
              </div>
            </div>

            {/* Submit & Cancel Actions */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800/80">
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
                className="flex items-center gap-2 px-7 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-emerald-500/20 transition cursor-pointer border border-emerald-400/30 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                    <span>جاري إرسال الرسالة...</span>
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
  );
};

export default ContactModal;
