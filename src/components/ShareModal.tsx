import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { X, Share2, Check, Send, Sparkles, Trophy, Award, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ShareModal: React.FC = () => {
  const { isShareModalOpen, setShareModalOpen, streak, answeredQuestions, currentPage } = useAppStore();
  const [copied, setCopied] = useState(false);

  if (!isShareModalOpen) return null;

  const correctCount = Object.values(answeredQuestions).filter((a) => a.isCorrect).length;
  const appUrl = window.location.origin;

  const shareText = `📖 أتدارس سيرة النبي الكريم ﷺ عبر منصة "الرحيق المختوم" التفاعلية!
🔥 وصلت لسلسلة ${streak} أيام من التعلم.
✅ أجبت على ${correctCount} سؤال في السيرة النبوية.
📚 أقرأ حالياً في الصفحة ${currentPage}.

انضم إلي وشارك في الاختبارات وقراءة السيرة العطرة:
${appUrl}`;

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleWhatsAppShare = () => {
    triggerConfetti();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleTelegramShare = () => {
    triggerConfetti();
    const url = `https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'الرحيق المختوم - منصة السيرة النبوية',
          text: shareText,
          url: appUrl,
        });
        triggerConfetti();
      } catch (err) {
        console.log('Share canceled', err);
      }
    } else {
      handleCopyText();
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    triggerConfetti();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant/30 w-full max-w-md rounded-3xl p-6 shadow-m3-5 relative space-y-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-m3-primary dark:text-m3-primary-dark font-bold text-lg">
            <Sparkles className="w-5 h-5" />
            <span>مشاركة إنجازاتك المباركة</span>
          </div>
          <button
            onClick={() => setShareModalOpen(false)}
            className="p-2 text-m3-onSurface-variant hover:bg-m3-surface-container rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic M3 Scorecard Preview */}
        <div className="relative p-5 bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-2xl shadow-m3-3 border border-emerald-500/30 overflow-hidden space-y-4">
          <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold px-3 py-1 bg-emerald-500/30 text-emerald-200 rounded-full border border-emerald-400/30">
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
              <Trophy className="w-6 h-6 text-amber-400" />
              <div>
                <span className="block text-[11px] text-emerald-200">إجابات صحيحة</span>
                <span className="text-base font-bold">{correctCount} سؤال</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-3">
              <Award className="w-6 h-6 text-emerald-400" />
              <div>
                <span className="block text-[11px] text-emerald-200">تقدم القراءة</span>
                <span className="text-base font-bold">صفحة {currentPage}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <p className="text-xs text-m3-onSurface-variant font-medium text-center">
            اختر الوسيلة لمشاركة إنجازك وتشجيع غيرك على قراءة السيرة
          </p>

          <div className="grid grid-cols-2 gap-3">
            {/* WhatsApp */}
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-medium text-sm transition shadow-m3-1"
            >
              <Send className="w-4 h-4" />
              <span>واتساب</span>
            </button>

            {/* Telegram */}
            <button
              onClick={handleTelegramShare}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-medium text-sm transition shadow-m3-1"
            >
              <Share2 className="w-4 h-4" />
              <span>تلغرام</span>
            </button>
          </div>

          {/* Web Share API & Copy */}
          <button
            onClick={handleNativeShare}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-m3-primary-container text-m3-primary-onContainer hover:bg-m3-primary/20 rounded-2xl font-medium text-sm transition"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'تم نسخ النص والرابط بنجاح!' : 'مشاركة عبر الهاتف / نسخ النص'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
