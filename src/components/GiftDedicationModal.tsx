import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  X,
  Copy,
  Check,
  Share2,
  Download,
  BookOpen,
  Sparkles,
  Send,
  Heart,
  Palette,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

type CardTheme = 'emerald' | 'royal' | 'warm' | 'dark_gold' | 'rose' | 'cyan';

interface PresetMessage {
  label: string;
  text: string;
}

export const GiftDedicationModal: React.FC = () => {
  const { isGiftModalOpen, setGiftModalOpen } = useAppStore();

  const [senderName, setSenderName] = useState('محب السيرة النبوية');
  const [recipientName, setRecipientName] = useState('أخي الغالي');
  const [selectedMsgIndex, setSelectedMsgIndex] = useState(0);
  const [customMsg, setCustomMsg] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>('emerald');
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewImageUri, setPreviewImageUri] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const presetMessages: PresetMessage[] = [
    {
      label: 'محبة وود',
      text: 'أهديك رابط هذه المنصة المباركة لقراءة وتدارس سيرة نبينا الكريم ﷺ',
    },
    {
      label: 'تهادوا تحابوا',
      text: 'تهادوا تحابوا — أتمنى لك قراءة ممتعة واستفادة كبيرة من كتاب الرحيق المختوم',
    },
    {
      label: 'هدية من القلب',
      text: 'هدية بسيطة من القلب.. منصة رائعة لقراءة السيرة النبوية وحل اختباراتها',
    },
    {
      label: 'دعاء وتبريك',
      text: 'أسأل الله أن يرزقك حب النبي ﷺ والعمل بسنته الشريفة، وأن يبارك لك في علمك',
    },
    {
      label: 'تشجيع وترحيب',
      text: 'دعوة طيبة لتصفح وقراءة السيرة النبوية الشريفة واكتشاف معالمها المباركة',
    },
  ];

  const activeMessage = customMsg.trim() || presetMessages[selectedMsgIndex].text;
  const appLink = window.location.origin || 'https://al-raheq-al-makhtom.vercel.app';

  // Render High-Res Canvas Card with Clean Text & 6 Distinct Visual Frame Designs
  const drawCardOnCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1200;
    const height = 670;
    canvas.width = width;
    canvas.height = height;

    const themesConfig = {
      emerald: {
        bg: '#044E3A',
        outerBorder: '#34D399',
        innerFrame: '#F59E0B',
        titleColor: '#FDE68A',
        subtitleColor: '#A7F3D0',
        toColor: '#6EE7B7',
        fromColor: '#FBBF24',
        boxBg: '#065F46',
        boxBorder: 'rgba(245, 158, 11, 0.4)',
        textColor: '#FFFFFF',
        footerLink: '#FDE68A',
        ornament: '#F59E0B',
      },
      royal: {
        bg: '#0F172A',
        outerBorder: '#F59E0B',
        innerFrame: '#60A5FA',
        titleColor: '#FBBF24',
        subtitleColor: '#93C5FD',
        toColor: '#93C5FD',
        fromColor: '#FBBF24',
        boxBg: '#1E293B',
        boxBorder: 'rgba(245, 158, 11, 0.4)',
        textColor: '#FFFFFF',
        footerLink: '#FBBF24',
        ornament: '#F59E0B',
      },
      warm: {
        bg: '#FDF6E2',
        outerBorder: '#78350F',
        innerFrame: '#B45309',
        titleColor: '#78350F',
        subtitleColor: '#92400E',
        toColor: '#78350F',
        fromColor: '#B45309',
        boxBg: '#FFFBEB',
        boxBorder: 'rgba(180, 83, 9, 0.4)',
        textColor: '#451A03',
        footerLink: '#78350F',
        ornament: '#B45309',
      },
      dark_gold: {
        bg: '#090D16',
        outerBorder: '#F59E0B',
        innerFrame: '#FBBF24',
        titleColor: '#FBBF24',
        subtitleColor: '#FDE68A',
        toColor: '#F59E0B',
        fromColor: '#38BDF8',
        boxBg: '#1E293B',
        boxBorder: 'rgba(245, 158, 11, 0.4)',
        textColor: '#F8FAFC',
        footerLink: '#FBBF24',
        ornament: '#FBBF24',
      },
      rose: {
        bg: '#4C0519',
        outerBorder: '#FB7185',
        innerFrame: '#F59E0B',
        titleColor: '#FFE4E6',
        subtitleColor: '#FECDD3',
        toColor: '#FECDD3',
        fromColor: '#FBBF24',
        boxBg: '#881337',
        boxBorder: 'rgba(251, 113, 133, 0.4)',
        textColor: '#FFFFFF',
        footerLink: '#FFE4E6',
        ornament: '#FB7185',
      },
      cyan: {
        bg: '#062C38',
        outerBorder: '#22D3EE',
        innerFrame: '#F59E0B',
        titleColor: '#CFFAFE',
        subtitleColor: '#A5F3FC',
        toColor: '#A5F3FC',
        fromColor: '#FBBF24',
        boxBg: '#083344',
        boxBorder: 'rgba(34, 211, 238, 0.4)',
        textColor: '#FFFFFF',
        footerLink: '#CFFAFE',
        ornament: '#22D3EE',
      },
    };

    const cfg = themesConfig[selectedTheme];

    // Background Fill
    ctx.fillStyle = cfg.bg;
    ctx.fillRect(0, 0, width, height);

    // Frame Geometry Styles according to theme
    if (selectedTheme === 'cyan') {
      // Chamfered Polygon Corners
      ctx.strokeStyle = cfg.outerBorder;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(55, 30);
      ctx.lineTo(width - 55, 30);
      ctx.lineTo(width - 30, 55);
      ctx.lineTo(width - 30, height - 55);
      ctx.lineTo(width - 55, height - 30);
      ctx.lineTo(55, height - 30);
      ctx.lineTo(30, height - 55);
      ctx.lineTo(30, 55);
      ctx.closePath();
      ctx.stroke();
    } else if (selectedTheme === 'rose') {
      // Rounded Pill Outer Frame
      ctx.strokeStyle = cfg.outerBorder;
      ctx.lineWidth = 6;
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(28, 28, width - 56, height - 56, 28);
        ctx.stroke();
      } else {
        ctx.strokeRect(28, 28, width - 56, height - 56);
      }
    } else {
      // Classic Double Rect Frame
      ctx.strokeStyle = cfg.outerBorder;
      ctx.lineWidth = 8;
      ctx.strokeRect(28, 28, width - 56, height - 56);

      ctx.strokeStyle = cfg.innerFrame;
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, width - 80, height - 80);

      // Corner Stars
      const drawCornerStar = (x: number, y: number) => {
        ctx.fillStyle = cfg.ornament;
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fill();
      };
      drawCornerStar(40, 40);
      drawCornerStar(width - 40, 40);
      drawCornerStar(40, height - 40);
      drawCornerStar(width - 40, height - 40);
    }

    // Header Calligraphy & Title (Exact Requested Clean Text)
    ctx.fillStyle = cfg.titleColor;
    ctx.font = 'bold 24px Readex Pro, Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('« الرحيق المختوم — كارت إهداء »', width / 2, 105);

    ctx.fillStyle = cfg.subtitleColor;
    ctx.font = 'bold 36px Readex Pro, Cairo, sans-serif';
    ctx.fillText('منصة السيرة النبوية التفاعلية', width / 2, 160);

    // Elegant Divider Line
    ctx.strokeStyle = cfg.innerFrame;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(220, 195);
    ctx.lineTo(width - 220, 195);
    ctx.stroke();

    // To & From Names Block
    ctx.font = 'bold 26px Readex Pro, Cairo, sans-serif';

    ctx.textAlign = 'right';
    ctx.fillStyle = cfg.toColor;
    ctx.fillText(`إلى:  ${recipientName || 'أخي الغالي'}`, width - 120, 252);

    ctx.textAlign = 'left';
    ctx.fillStyle = cfg.fromColor;
    ctx.fillText(`من:  ${senderName || 'محب السيرة'}`, 120, 252);

    // Dedicated Message Container Box
    ctx.fillStyle = cfg.boxBg;
    ctx.fillRect(80, 290, width - 160, 215);
    ctx.strokeStyle = cfg.boxBorder;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(80, 290, width - 160, 215);

    // Wrap Message Text Lines
    ctx.fillStyle = cfg.textColor;
    ctx.font = '500 25px Readex Pro, Cairo, sans-serif';
    ctx.textAlign = 'center';

    const words = activeMessage.split(' ');
    let line = '';
    let y = 360;
    const maxWidth = width - 240;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, width / 2, y);
        line = words[n] + ' ';
        y += 42;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, width / 2, y);

    // Footer Platform Branding Watermark & Link (Clean)
    ctx.fillStyle = cfg.footerLink;
    ctx.font = 'bold 22px Readex Pro, Cairo, sans-serif';
    ctx.fillText(`🔗 ${appLink}`, width / 2, 558);

    ctx.fillStyle = cfg.subtitleColor;
    ctx.font = '17px Readex Pro, Cairo, sans-serif';
    ctx.fillText('بطاقة إهداء رقمية ✦ منصة قراءة واختبارات السيرة النبوية', width / 2, 594);

    try {
      const uri = canvas.toDataURL('image/png');
      setPreviewImageUri(uri);
    } catch {
      // Ignore
    }
  }, [senderName, recipientName, activeMessage, appLink, selectedTheme]);

  useEffect(() => {
    if (isGiftModalOpen) {
      setTimeout(drawCardOnCanvas, 60);
    }
  }, [isGiftModalOpen, drawCardOnCanvas]);

  const handleDownloadImage = () => {
    setIsDownloading(true);
    drawCardOnCanvas();

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const imageURI = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `كارت_إهداء_الرحيق_المختوم.png`;
        link.href = imageURI;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setIsDownloading(false);
    }, 100);
  };

  const fullShareText =
    `📜 *إهداء كارت السيرة النبوية* 📜\n\n` +
    `👤 *من:* ${senderName}\n` +
    `👤 *إلى:* ${recipientName}\n\n` +
    `💬 *الرسالة:*\n${activeMessage}\n\n` +
    `📖 *رابط المنصة:*\n${appLink}`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(fullShareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = async () => {
    const canvas = canvasRef.current;
    if (navigator.share && canvas) {
      try {
        const dataUrl = canvas.toDataURL('image/png');
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], 'كارت_إهداء_الرحيق_المختوم.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'إهداء كارت السيرة النبوية',
            text: fullShareText,
          });
          return;
        }
      } catch {
        // Fallback
      }
    }
    const url = `https://wa.me/?text=${encodeURIComponent(fullShareText)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    const canvas = canvasRef.current;
    if (navigator.share) {
      try {
        if (canvas) {
          const dataUrl = canvas.toDataURL('image/png');
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          const file = new File([blob], 'كارت_إهداء_الرحيق_المختوم.png', { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'إهداء كارت السيرة النبوية',
              text: fullShareText,
            });
            return;
          }
        }
        await navigator.share({
          title: 'إهداء كارت السيرة النبوية',
          text: fullShareText,
          url: appLink,
        });
      } catch {
        handleCopyText();
      }
    } else {
      handleCopyText();
    }
  };

  if (!isGiftModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 font-arabic dir-rtl overflow-hidden">
        <canvas ref={canvasRef} className="hidden" />

        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={() => setGiftModalOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
          className="bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant/30 w-full max-w-xl rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh] z-10 my-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-4 sm:p-5 flex items-center justify-between shadow-xs shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-800 rounded-2xl flex items-center justify-center text-amber-300 shadow-md shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg leading-tight flex items-center gap-2">
                  <span>إهداء كارت السيرة النبوية</span>
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse" />
                </h3>
                <p className="text-xs text-emerald-200/90 font-medium">
                  اصنع كارت إهداء بسيط وجميل لأحبابك مع رابط المنصة
                </p>
              </div>
            </div>

            <button
              onClick={() => setGiftModalOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition text-white/80 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Clean Scrollable Content */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
            {/* Theme Pills Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-m3-onSurface">
                <span className="flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>شكل وتصميم الكارت:</span>
                </span>
                <span className="text-m3-onSurface-variant text-[11px] font-normal">اختر الألوان المناسبة</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {[
                  { id: 'emerald', name: 'الأخضر', class: 'bg-emerald-800 text-white border-emerald-500' },
                  { id: 'royal', name: 'الملكي', class: 'bg-blue-950 text-amber-300 border-amber-500' },
                  { id: 'warm', name: 'الورقي', class: 'bg-amber-100 text-amber-900 border-amber-600' },
                  { id: 'dark_gold', name: 'الفخم', class: 'bg-slate-950 text-amber-300 border-amber-400' },
                  { id: 'rose', name: 'الزهري', class: 'bg-rose-900 text-rose-100 border-rose-400' },
                  { id: 'cyan', name: 'السايان', class: 'bg-cyan-900 text-cyan-100 border-cyan-400' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTheme(t.id as CardTheme)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition border flex items-center justify-center cursor-pointer ${t.class} ${
                      selectedTheme === t.id
                        ? 'ring-2 ring-emerald-500 shadow-md scale-105 font-black'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Card Preview */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-m3-onSurface">
                <span>معاينة الكارت الحية:</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-[11px] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>دقة عالية جاهزة للتحميل</span>
                </span>
              </div>

              <div className="rounded-2xl overflow-hidden border border-m3-outline-variant/30 shadow-md">
                {previewImageUri ? (
                  <img
                    src={previewImageUri}
                    alt="معاينة كارت الإهداء"
                    className="w-full h-auto object-cover rounded-2xl"
                  />
                ) : (
                  <div className="p-6 text-center text-xs text-m3-onSurface-variant bg-m3-surface-container">
                    جاري تجهيز الكارت...
                  </div>
                )}
              </div>
            </div>

            {/* Inputs: Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-m3-onSurface mb-1">
                  اسمك (من):
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="اسمك هنا..."
                  className="w-full px-3.5 py-2.5 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-xl text-xs font-medium focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-m3-onSurface mb-1">
                  اسم صديقك/أختك (إلى):
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="اسم المُهدى إليه..."
                  className="w-full px-3.5 py-2.5 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-xl text-xs font-medium focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            {/* Preset Messages */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-m3-onSurface">
                اختر رسالة الإهداء:
              </label>

              <div className="space-y-1.5">
                {presetMessages.map((msg, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedMsgIndex(idx);
                      setCustomMsg('');
                    }}
                    className={`w-full p-2.5 rounded-xl text-right text-xs transition border cursor-pointer ${
                      selectedMsgIndex === idx && !customMsg
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-600 text-emerald-900 dark:text-emerald-200 font-bold shadow-xs'
                        : 'bg-m3-surface-container dark:bg-m3-surface-darkContainer border-m3-outline-variant/20 text-m3-onSurface-variant hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-md">
                        {msg.label}
                      </span>
                      <span>{msg.text}</span>
                    </div>
                  </button>
                ))}
              </div>

              <textarea
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="أو اكتب كلامك الخاص هنا..."
                rows={2}
                className="w-full p-3 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-xl text-xs focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 mt-1"
              />
            </div>
          </div>

          {/* Action Bar */}
          <div className="p-4 bg-m3-surface-container dark:bg-m3-surface-darkContainer border-t border-m3-outline-variant/20 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDownloadImage}
              disabled={isDownloading}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-bold rounded-2xl text-xs shadow-md transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>{isDownloading ? 'جاري التحميل...' : 'تحميل الكارت (صورة PNG)'}</span>
            </motion.button>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCopyText}
                className="flex items-center gap-1.5 px-3.5 py-2.5 border border-m3-outline-variant/40 rounded-2xl text-xs font-bold text-m3-onSurface hover:bg-m3-surface-variant transition cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ النص'}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleWhatsAppShare}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl text-xs shadow-sm transition cursor-pointer"
              >
                <Send className="w-4 h-4 text-emerald-200" />
                <span>واتساب</span>
              </motion.button>

              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleNativeShare}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 bg-m3-primary text-white font-bold rounded-2xl text-xs shadow-sm transition cursor-pointer"
                  title="مشاركة عبر تطبيقات الهاتف"
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GiftDedicationModal;
