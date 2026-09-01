import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { X, Copy, Check, Share2, Sparkles, Gift, Download, BookOpen, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const GiftDedicationModal: React.FC = () => {
  const { isGiftModalOpen, setGiftModalOpen } = useAppStore();

  const [senderName, setSenderName] = useState('محب السيرة النبوية');
  const [recipientName, setRecipientName] = useState('أخي الكريم / أختي الفاضلة');
  const [selectedMsgIndex, setSelectedMsgIndex] = useState(0);
  const [customMsg, setCustomMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const predefinedMessages = [
    '«تهادوا تحابوا — أهديك هذه المنصة التفاعلية لنقرأ وتدارس سيرة الحبيب المصطفى ﷺ ونستلهم منها العِبر والدروس.»',
    '«إهداء خاص ومبارك لقراءة وتصفح كتاب الرحيق المختوم في السيرة النبوية العطرة وتجربة اختباراتها التفاعلية.»',
    '«إهداء محبة وإخاء في الله — أسأل الله أن يجمعنا في ظله يوم لا ظل إلا ظله، وأن يجعل هذا العلم نافعاً لنا في الدارين.»',
    '«هدية إيمانية نفيظة — أدعوك لتدارس سيرة نبينا الكريم ﷺ والاستفادة من القارئ التفاعلي وبنك المراجعة الذكي.»'
  ];

  const activeMessage = customMsg.trim() || predefinedMessages[selectedMsgIndex];
  const appLink = window.location.origin || 'https://al-raheeq-al-makhtom.vercel.app';

  // Function to render card on Canvas for high-res PNG download
  const drawCardOnCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1200;
    const height = 675;
    canvas.width = width;
    canvas.height = height;

    // Background Gradient (Deep Emerald to Forest Green)
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#064E3B');
    bgGradient.addColorStop(0.5, '#0D6E4F');
    bgGradient.addColorStop(1, '#043427');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative Outer Border (Gold)
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 12;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 3;
    ctx.strokeRect(42, 42, width - 84, height - 84);

    // Inner Glass Panel
    ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.fillRect(60, 60, width - 120, height - 120);

    // Header Badge
    ctx.fillStyle = '#D97706';
    ctx.font = 'bold 28px Cairo, Readex Pro, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('📖  بطـاقـة إهـداء مبـارك  📖', width / 2, 120);

    // Header Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'black 46px Cairo, Readex Pro, sans-serif';
    ctx.fillText('الرحيق المختوم — المنصة التفاعلية للسيرة النبوية', width / 2, 180);

    // Divider Line
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, 210);
    ctx.lineTo(width - 150, 210);
    ctx.stroke();

    // Sender & Recipient Box
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(100, 240, width - 200, 100);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
    ctx.strokeRect(100, 240, width - 200, 100);

    // Sender Name (Right) & Recipient Name (Left)
    ctx.font = 'bold 30px Cairo, Readex Pro, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#FDE68A';
    ctx.fillText(`إلى:  ${recipientName || 'أخي الكريم'}`, width - 140, 300);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#6EE7B7';
    ctx.fillText(`من:  ${senderName || 'محب السيرة'}`, 140, 300);

    // Message Body Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(100, 370, width - 200, 170);

    ctx.fillStyle = '#065F46';
    ctx.font = '600 28px Cairo, Readex Pro, sans-serif';
    ctx.textAlign = 'center';

    // Wrap Message Text
    const words = activeMessage.split(' ');
    let line = '';
    let y = 430;
    const maxWidth = width - 260;

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

    // Footer Link & Copyright
    ctx.fillStyle = '#FDE68A';
    ctx.font = 'bold 24px Cairo, Readex Pro, sans-serif';
    ctx.fillText(`🔗 ${appLink}`, width / 2, 590);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '20px Cairo, Readex Pro, sans-serif';
    ctx.fillText('تهادوا تحابوا — دراسة وقراءة سيرة النبي الكريم ﷺ', width / 2, 625);
  }, [senderName, recipientName, activeMessage, appLink]);

  useEffect(() => {
    if (isGiftModalOpen) {
      setTimeout(drawCardOnCanvas, 100);
    }
  }, [isGiftModalOpen, drawCardOnCanvas]);

  const handleDownloadImage = () => {
    setIsGeneratingImage(true);
    drawCardOnCanvas();

    setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const imageURI = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `كارت_إهداء_الرحيق_المختوم_${Date.now()}.png`;
        link.href = imageURI;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setIsGeneratingImage(false);
    }, 200);
  };

  const fullShareText = `🎁 *بطاقة إهداء مبارك من منصة الرحيق المختوم* 🎁\n\n` +
    `👤 *من:* ${senderName}\n` +
    `❤️ *إلى:* ${recipientName}\n\n` +
    `💬 *نص الإهداء:*\n${activeMessage}\n\n` +
    `📖 *تصفح واقرأ المنصة التفاعلية عبر الرابط:*\n${appLink}`;

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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-arabic"
        dir="rtl"
      >
        {/* Hidden Canvas used for PNG image generation */}
        <canvas ref={canvasRef} className="hidden" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant/30 w-full max-w-xl rounded-3xl shadow-m3-5 relative overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 p-6 text-white relative">
            <button
              onClick={() => setGiftModalOpen(false)}
              className="absolute top-4 left-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/20 backdrop-blur-md rounded-2xl border border-amber-400/40 text-amber-300">
                <Gift className="w-7 h-7" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 bg-amber-500/30 text-amber-200 border border-amber-400/30 rounded-full text-[11px] font-bold">
                  مولّد كروت الإهداء الرقمية 📜
                </span>
                <h3 className="text-xl font-black mt-1 text-white">
                  إنشاء وإرسال كارت إهداء مبارك
                </h3>
              </div>
            </div>
          </div>

          {/* Form Controls */}
          <div className="p-6 overflow-y-auto space-y-5">
            {/* Input Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-m3-onSurface mb-1">
                  اسم المُهدي (من):
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-m3-onSurface-variant absolute right-3 top-3" />
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="اسمك أو صفك..."
                    className="w-full pr-9 pl-3 py-2 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/40 rounded-2xl text-xs font-semibold focus:outline-hidden focus:border-m3-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-m3-onSurface mb-1">
                  اسم المُهدى إليه (إلى):
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-m3-onSurface-variant absolute right-3 top-3" />
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="أخي الكريم / أستاذي الفاضل..."
                    className="w-full pr-9 pl-3 py-2 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/40 rounded-2xl text-xs font-semibold focus:outline-hidden focus:border-m3-primary"
                  />
                </div>
              </div>
            </div>

            {/* Template Messages Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-m3-onSurface">
                اختر صيغة الإهداء أو اكتب صيغتك الخاصة:
              </label>
              <div className="grid grid-cols-1 gap-2">
                {predefinedMessages.map((msg, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedMsgIndex(idx);
                      setCustomMsg('');
                    }}
                    className={`p-3 rounded-2xl text-right text-xs transition border ${
                      selectedMsgIndex === idx && !customMsg
                        ? 'bg-emerald-600/10 border-emerald-600 text-emerald-900 dark:text-emerald-200 font-bold'
                        : 'bg-m3-surface-container dark:bg-m3-surface-darkContainer border-m3-outline-variant/20 text-m3-onSurface-variant hover:border-m3-outline-variant/50'
                    }`}
                  >
                    {msg}
                  </button>
                ))}
              </div>

              <textarea
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="أو اكتب كلمة إهداء خاصة هنا..."
                rows={2}
                className="w-full p-3 bg-m3-surface-container dark:bg-m3-surface-darkContainer border border-m3-outline-variant/40 rounded-2xl text-xs focus:outline-hidden focus:border-m3-primary"
              />
            </div>

            {/* Live Prestigious Card Preview Box */}
            <div className="p-5 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl border-2 border-amber-500/50 shadow-m3-3 space-y-4 relative overflow-hidden">
              {/* Card Header Badge */}
              <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300">
                    الرحيق المختوم — بطاقة إهداء رقمية
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-400/40 rounded-full">
                  معاينة كارت الإهداء
                </span>
              </div>

              {/* To and From */}
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-amber-200">
                  إلى: <span className="text-white font-extrabold text-sm">{recipientName || '---'}</span>
                </span>
                <span className="text-emerald-300">
                  من: <span className="text-white font-extrabold text-sm">{senderName || '---'}</span>
                </span>
              </div>

              {/* Dedication Text */}
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-xs leading-relaxed text-amber-50 italic text-center">
                {activeMessage}
              </div>

              {/* App Link Footer */}
              <div className="flex items-center justify-between text-[11px] text-amber-300/90 pt-1 font-semibold">
                <span>🔗 {appLink}</span>
                <span>تهادوا تحابوا</span>
              </div>
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="p-4 bg-m3-surface-container dark:bg-m3-surface-darkContainer border-t border-m3-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <button
              onClick={handleDownloadImage}
              disabled={isGeneratingImage}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-full text-xs shadow-m3-1 transition active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingImage ? 'جاري إنشاء الصورة...' : 'تحميل الكارت كصورة PNG 📸'}</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleCopyText}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-m3-surface-containerHigh dark:bg-m3-surface-dark border border-m3-outline-variant/40 text-m3-onSurface rounded-full text-xs font-bold hover:bg-m3-surface-variant transition active:scale-95 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'تم النسخ' : 'نسخ النص'}</span>
              </button>

              <button
                onClick={handleWhatsAppShare}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-extrabold shadow-m3-2 transition active:scale-95 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>إرسال عبر واتساب 💬</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
