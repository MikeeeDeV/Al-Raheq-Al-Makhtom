import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { X, Copy, Check, Share2, Download, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const GiftDedicationModal: React.FC = () => {
  const { isGiftModalOpen, setGiftModalOpen } = useAppStore();

  const [senderName, setSenderName] = useState('محب السيرة النبوية');
  const [recipientName, setRecipientName] = useState('أخي الكريم');
  const [selectedMsgIndex, setSelectedMsgIndex] = useState(0);
  const [customMsg, setCustomMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const predefinedMessages = [
    '«تهادوا تحابوا — أهديك هذه المنصة لنقرأ ونستفيد من سيرة الحبيب المصطفى ﷺ.»',
    '«إهداء مبارك لقراءة وتدارس كتاب الرحيق المختوم في السيرة النبوية العطرة.»',
    '«إهداء محبة في الله — أسأل الله أن يجعل هذا العلم نافعاً ومباركاً لنا جميعاً.»',
    '«دعوة طيبة لتصفح سيرة نبينا الكريم ﷺ والاستفادة من القارئ التفاعلي والاختبارات.»'
  ];

  const activeMessage = customMsg.trim() || predefinedMessages[selectedMsgIndex];
  const appLink = window.location.origin || 'https://al-raheeq-al-makhtom.vercel.app';

  // Render a clean, elegant, minimalist Islamic Card on Canvas
  const drawCardOnCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1200;
    const height = 630;
    canvas.width = width;
    canvas.height = height;

    // Background: Soft Warm Parchment
    ctx.fillStyle = '#FAF8F5';
    ctx.fillRect(0, 0, width, height);

    // Subtle Outer Border (Emerald)
    ctx.strokeStyle = '#0F5132';
    ctx.lineWidth = 8;
    ctx.strokeRect(35, 35, width - 70, height - 70);

    // Inner Thin Line (Gold/Bronze)
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 45, width - 90, height - 90);

    // Header Emblem
    ctx.fillStyle = '#0F5132';
    ctx.font = 'bold 24px Cairo, Readex Pro, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('« الرحيق المختوم — إهداء مبارك »', width / 2, 115);

    ctx.fillStyle = '#111827';
    ctx.font = 'bold 38px Cairo, Readex Pro, sans-serif';
    ctx.fillText('منصة السيرة النبوية التفاعلية', width / 2, 170);

    // Divider Line
    ctx.strokeStyle = 'rgba(15, 81, 50, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(200, 205);
    ctx.lineTo(width - 200, 205);
    ctx.stroke();

    // To & From Block
    ctx.font = 'bold 26px Cairo, Readex Pro, sans-serif';

    ctx.textAlign = 'right';
    ctx.fillStyle = '#0F5132';
    ctx.fillText(`إلى:  ${recipientName || 'أخي الكريم'}`, width - 140, 265);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#D97706';
    ctx.fillText(`من:  ${senderName || 'محب السيرة'}`, 140, 265);

    // Dedicated Text Box
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(100, 310, width - 200, 180);
    ctx.strokeStyle = 'rgba(15, 81, 50, 0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(100, 310, width - 200, 180);

    ctx.fillStyle = '#1F2937';
    ctx.font = '500 26px Cairo, Readex Pro, sans-serif';
    ctx.textAlign = 'center';

    const words = activeMessage.split(' ');
    let line = '';
    let y = 375;
    const maxWidth = width - 260;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, width / 2, y);
        line = words[n] + ' ';
        y += 40;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, width / 2, y);

    // Footer Link
    ctx.fillStyle = '#0F5132';
    ctx.font = 'bold 22px Cairo, Readex Pro, sans-serif';
    ctx.fillText(`🔗 ${appLink}`, width / 2, 545);

    ctx.fillStyle = '#6B7280';
    ctx.font = '18px Cairo, Readex Pro, sans-serif';
    ctx.fillText('تهادوا تحابوا — دراسة وقراءة سيرة النبي الكريم ﷺ', width / 2, 580);
  }, [senderName, recipientName, activeMessage, appLink]);

  useEffect(() => {
    if (isGiftModalOpen) {
      setTimeout(drawCardOnCanvas, 80);
    }
  }, [isGiftModalOpen, drawCardOnCanvas]);

  const handleDownloadImage = () => {
    setIsDownloading(true);
    drawCardOnCanvas();

    setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const imageURI = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `إهداء_الرحيق_المختوم.png`;
        link.href = imageURI;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setIsDownloading(false);
    }, 150);
  };

  const fullShareText = `📜 *إهداء مبارك — منصة الرحيق المختوم* 📜\n\n` +
    `👤 *من:* ${senderName}\n` +
    `👤 *إلى:* ${recipientName}\n\n` +
    `💬 *الرسالة:*\n${activeMessage}\n\n` +
    `📖 *رابط المنصة:*\n${appLink}`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(fullShareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(fullShareText)}`;
    window.open(url, '_blank');
  };

  if (!isGiftModalOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-arabic"
        dir="rtl"
      >
        <canvas ref={canvasRef} className="hidden" />

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant/30 w-full max-w-lg rounded-3xl shadow-xl relative overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-base">إهداء كارت المنصة 📜</h3>
            </div>
            <button
              onClick={() => setGiftModalOpen(false)}
              className="p-1.5 hover:bg-emerald-800 rounded-full transition text-white/80 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 overflow-y-auto space-y-4">
            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-m3-onSurface mb-1">
                  اسم المُهدي (من):
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-3 py-2 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-xl text-xs font-medium focus:outline-hidden focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-m3-onSurface mb-1">
                  اسم المُهدى إليه (إلى):
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-xl text-xs font-medium focus:outline-hidden focus:border-emerald-700"
                />
              </div>
            </div>

            {/* Template Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-m3-onSurface">
                صيغ الإهداء:
              </label>
              <div className="space-y-1.5">
                {predefinedMessages.map((msg, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedMsgIndex(idx);
                      setCustomMsg('');
                    }}
                    className={`w-full p-2.5 rounded-xl text-right text-xs transition border ${
                      selectedMsgIndex === idx && !customMsg
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-700 text-emerald-900 dark:text-emerald-200 font-bold'
                        : 'bg-m3-surface-container dark:bg-m3-surface-darkContainer border-m3-outline-variant/20 text-m3-onSurface-variant'
                    }`}
                  >
                    {msg}
                  </button>
                ))}
              </div>

              <textarea
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="أو اكتب صيغة مخصصة..."
                rows={2}
                className="w-full p-2.5 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/30 rounded-xl text-xs focus:outline-hidden focus:border-emerald-700 mt-1"
              />
            </div>

            {/* Minimalist Card Preview */}
            <div className="p-4 bg-[#FAF8F5] dark:bg-emerald-950/30 border border-emerald-800/30 rounded-2xl space-y-3 text-xs text-slate-800 dark:text-slate-200">
              <div className="text-center font-bold text-emerald-800 dark:text-emerald-400 text-xs border-b border-emerald-800/10 pb-2">
                « الرحيق المختوم — إهداء مبارك »
              </div>

              <div className="flex items-center justify-between text-xs font-bold">
                <span>إلى: <span className="text-emerald-900 dark:text-emerald-300">{recipientName}</span></span>
                <span>من: <span className="text-amber-800 dark:text-amber-400">{senderName}</span></span>
              </div>

              <div className="p-3 bg-white dark:bg-black/30 rounded-xl border border-slate-200 dark:border-emerald-900/40 text-center italic leading-relaxed text-xs">
                {activeMessage}
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 text-center font-medium">
                🔗 {appLink}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 bg-m3-surface-container dark:bg-m3-surface-darkContainer border-t border-m3-outline-variant/20 flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={handleDownloadImage}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'جاري التحميل...' : 'تحميل الكارت (صورة PNG)'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyText}
                className="flex items-center gap-1 px-3 py-2 border border-m3-outline-variant/40 rounded-xl text-xs font-bold text-m3-onSurface hover:bg-m3-surface-variant transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ' : 'نسخ النص'}</span>
              </button>

              <button
                onClick={handleWhatsAppShare}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>واتساب</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
