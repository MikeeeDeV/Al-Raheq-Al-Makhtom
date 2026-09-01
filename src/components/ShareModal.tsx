import React, { useState, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { X, Share2, Check, Send, Sparkles, Trophy, Award, Flame, Download, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { toBlob, toPng } from 'html-to-image';
import { copyToClipboard } from '../utils/clipboard';

export const ShareModal: React.FC = () => {
  const { setShareModalOpen, streak, answeredQuestions, currentPage } = useAppStore();
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const correctCount = Object.values(answeredQuestions).filter((a) => a.isCorrect).length;
  const appUrl = 'https://al-raheq-al-makhtom.vercel.app/';

  const shareText = `✨ بطاقة إنجاز من منصة "الرحيق المختوم" للسيرة النبوية المطهرة:
🔥 مواظبة: ${streak} أيام متتالية
✅ أسئلة مجابة: ${correctCount} سؤال موثق
📖 صفحة القراءة: ${currentPage}

انضم ودرب معرفتك بالسيرة النبوية:
${appUrl}`;

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const getCardFile = async (): Promise<File | null> => {
    if (!cardRef.current) return null;
    try {
      const blob = await toBlob(cardRef.current, { pixelRatio: 2, cacheBust: true });
      if (blob) {
        return new File([blob], 'alraheeq-card.png', { type: 'image/png' });
      }
    } catch (err) {
      console.warn('Failed to render card image:', err);
    }
    return null;
  };

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
      const link = document.createElement('a');
      link.download = `alraheeq-achievement-page${currentPage}.png`;
      link.href = dataUrl;
      link.click();
      triggerConfetti();
    } catch (err) {
      console.error('Download card error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleWhatsAppShare = async () => {
    triggerConfetti();
    if (navigator.share && cardRef.current) {
      const cardFile = await getCardFile();
      if (cardFile && navigator.canShare && navigator.canShare({ files: [cardFile] })) {
        try {
          await navigator.share({
            files: [cardFile],
            title: 'بطاقة إنجاز - الرحيق المختوم',
            text: shareText,
          });
          return;
        } catch {
          // Fallback below
        }
      }
    }

    handleDownloadCard();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleTelegramShare = async () => {
    triggerConfetti();
    if (navigator.share && cardRef.current) {
      const cardFile = await getCardFile();
      if (cardFile && navigator.canShare && navigator.canShare({ files: [cardFile] })) {
        try {
          await navigator.share({
            files: [cardFile],
            title: 'بطاقة إنجاز - الرحيق المختوم',
            text: shareText,
          });
          return;
        } catch {
          // Fallback below
        }
      }
    }

    handleDownloadCard();
    const url = `https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    setIsGenerating(true);
    try {
      const cardFile = await getCardFile();
      if (navigator.share) {
        if (cardFile && navigator.canShare && navigator.canShare({ files: [cardFile] })) {
          await navigator.share({
            files: [cardFile],
            title: 'بطاقة إنجاز الرحيق المختوم',
            text: shareText,
          });
        } else {
          await navigator.share({
            title: 'الرحيق المختوم - منصة السيرة النبوية',
            text: shareText,
            url: appUrl,
          });
        }
        triggerConfetti();
      } else {
        await handleCopyText();
      }
    } catch (err) {
      console.log('Share canceled', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = async () => {
    const success = await copyToClipboard(shareText);
    if (success) {
      setCopied(true);
      triggerConfetti();
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-arabic dir-rtl">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={() => setShareModalOpen(false)}
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs"
      />

      {/* Modal Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 12 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant/30 w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl relative space-y-5 overflow-hidden z-10 my-auto text-m3-onSurface dark:text-m3-onSurface-dark"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-m3-primary dark:text-m3-primary-dark font-bold text-base sm:text-lg">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>مشاركة إنجازاتك المباركة</span>
          </div>
          <button
            onClick={() => setShareModalOpen(false)}
            className="p-2 text-m3-onSurface-variant hover:bg-m3-surface-container rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic M3 Scorecard Preview */}
        <div
          ref={cardRef}
          className="relative p-5 bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-2xl shadow-m3-3 border border-emerald-500/30 overflow-hidden space-y-4"
        >
          <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold px-3 py-1 bg-emerald-500/30 text-emerald-200 rounded-full border border-emerald-400/30">
              الرحيق المختوم
            </span>
            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>{streak} أيام مواظبة</span>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-lg font-extrabold text-white">بطاقة إنجاز في السيرة النبوية</h4>
            <p className="text-xs text-emerald-200">المنصة التفاعلية لدارسة كتاب الرحيق المختوم</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-3">
              <Trophy className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <span className="block text-[11px] text-emerald-200">إجابات صحيحة</span>
                <span className="text-base font-bold">{correctCount} سؤال</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-3">
              <Award className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <span className="block text-[11px] text-emerald-200">تقدم القراءة</span>
                <span className="text-base font-bold">صفحة {currentPage}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {/* WhatsApp */}
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs sm:text-sm transition shadow-m3-1 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>واتساب</span>
            </button>

            {/* Telegram */}
            <button
              onClick={handleTelegramShare}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-bold text-xs sm:text-sm transition shadow-m3-1 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>تلغرام</span>
            </button>
          </div>

          {/* Web Share API / Copy */}
          <button
            onClick={handleNativeShare}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-m3-primary-container text-m3-primary-onContainer hover:bg-m3-primary/20 rounded-2xl font-bold text-xs sm:text-sm transition cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
            <span>{copied ? 'تم نسخ النص والرابط بنجاح!' : 'مشاركة الكارت مع الكلام (المزيد)'}</span>
          </button>

          {/* Save Image Directly */}
          <button
            onClick={handleDownloadCard}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-semibold text-xs transition cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>حفظ الكارت كصورة PNG للجهاز</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ShareModal;
