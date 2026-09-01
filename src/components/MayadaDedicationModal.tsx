import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  Heart,
  X,
  Sparkles,
  Download,
  Copy,
  Check,
  Flower2,
  Palette,
  PenTool,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface RomanticMessageOption {
  title: string;
  text: string;
}

const DEDICATION_MESSAGES: RomanticMessageOption[] = [
  {
    title: 'إهداء المحبة والوفاء',
    text: 'إلى حبيبتي وملهمة الدرب.. أهديكِ هذا العمل المبارك بنية الصدقة الجارية والنور، دمتِ لي سكنًا ونورًا وأجمل نعم ربي',
  },
  {
    title: 'نور العين والروح',
    text: 'من أعماق القلب إلى من يُزهر بوجودها الفؤاد يا حبيبتي.. جعل الله هذا الجهد في ميزان حسناتنا وجمعنا دوماً على الطاعة والمحبة',
  },
  {
    title: 'الداعمة والملهمة الأولى',
    text: 'لولا تشجيعكِ ودعمكِ الدافئ يا حبيبتي ما كان لهذا العمل الشريف في سيرة النبي ﷺ أن يكتمل بهذه الروعة.. شكرًا من القلب',
  },
  {
    title: 'دعاء ورجاء مستجاب',
    text: 'أسأل الله أن يبارك في عمركِ يا حبيبتي، وأن يملأ قلبكِ بالفرح، وأن يرزقنا شفاعة نبينا الكريم ﷺ وصحبته في الفردوس الأعلى',
  },
];

const DEDICATION_THEMES = [
  { id: 'rose', name: 'وردي زاهر', bg: '#4A0E17', accent: '#FB7185', text: '#FFE4E6', border: '#F43F5E' },
  { id: 'velvet', name: 'ملكي مخملي', bg: '#2E0854', accent: '#F59E0B', text: '#FEF3C7', border: '#D97706' },
  { id: 'lavender', name: 'لافندر ناعم', bg: '#2D1B69', accent: '#A855F7', text: '#F3E8FF', border: '#C084FC' },
  { id: 'gold', name: 'ذهب وردي', bg: '#3B1219', accent: '#FBBF24', text: '#FFFBEB', border: '#F59E0B' },
];

export const MayadaDedicationModal: React.FC = () => {
  const { isMayadaModalOpen, setMayadaModalOpen } = useAppStore();

  const [selectedMsgIndex, setSelectedMsgIndex] = useState(0);
  const [customMsg, setCustomMsg] = useState('');
  const [selectedThemeId, setSelectedThemeId] = useState('rose');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeMessage = customMsg.trim() || DEDICATION_MESSAGES[selectedMsgIndex].text;
  const activeTheme = DEDICATION_THEMES.find((t) => t.id === selectedThemeId) || DEDICATION_THEMES[0];

  // Draw romantic canvas card
  const drawCanvasCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1200;
    const height = 670;
    canvas.width = width;
    canvas.height = height;

    // Background Gradient
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, activeTheme.bg);
    bgGradient.addColorStop(0.5, '#1C0509');
    bgGradient.addColorStop(1, '#0F0204');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative Outer Metallic Frame
    ctx.lineWidth = 6;
    ctx.strokeStyle = activeTheme.border;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.strokeRect(42, 42, width - 84, height - 84);

    // Corner Ornaments (Floating Hearts)
    const drawHeart = (x: number, y: number, size: number) => {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = activeTheme.accent;
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
      ctx.bezierCurveTo(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
      ctx.fill();
      ctx.restore();
    };

    drawHeart(70, 70, 16);
    drawHeart(width - 70, 70, 16);
    drawHeart(70, height - 85, 16);
    drawHeart(width - 70, height - 85, 16);

    // Header Stamp
    ctx.fillStyle = activeTheme.accent;
    ctx.font = 'bold 26px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('« إهداء خاص إلى ملهمة الدرب وحبيبة العمر »', width / 2, 105);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '16px "Cairo", sans-serif';
    ctx.fillText('✦ منصة السيرة النبوية المطهرة ✦', width / 2, 140);

    // Separator Line
    ctx.strokeStyle = activeTheme.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 200, 160);
    ctx.lineTo(width / 2 + 200, 160);
    ctx.stroke();

    // Main Message Body (Multi-line)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 30px "Readex Pro", "Cairo", sans-serif';
    ctx.textAlign = 'center';

    const words = activeMessage.split(' ');
    let currentLine = '';
    const lines: string[] = [];
    const maxLineWidth = 900;

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxLineWidth && i > 0) {
        lines.push(currentLine);
        currentLine = words[i] + ' ';
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);

    let startY = 270;
    lines.forEach((line) => {
      ctx.fillText(line.trim(), width / 2, startY);
      startY += 54;
    });

    // Signature Block at Bottom
    ctx.fillStyle = activeTheme.accent;
    ctx.font = 'bold 28px "Cairo", sans-serif';
    ctx.fillText('مِن المحبّ: محمد أيمن', width / 2, height - 130);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '16px "Cairo", sans-serif';
    ctx.fillText('المنصة التفاعلية للرحيق المختوم — عمل لوجه الله تعالى', width / 2, height - 80);
  };

  useEffect(() => {
    if (isMayadaModalOpen) {
      setTimeout(drawCanvasCard, 100);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F43F5E', '#FB7185', '#F59E0B', '#E11D48'],
      });
    }
  }, [isMayadaModalOpen, activeMessage, selectedThemeId]);

  const handleDownload = () => {
    setIsGenerating(true);
    drawCanvasCard();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `Dedication_Card.png`;
    link.href = dataUrl;
    link.click();
    setIsGenerating(false);
  };

  const handleCopyLink = () => {
    const textToShare = `${activeMessage}\n\nرابط المنصة: ${window.location.origin}`;
    navigator.clipboard.writeText(textToShare);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-arabic dir-rtl">
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={() => setMayadaModalOpen(false)}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
      />

      {/* Modal Window Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 12 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-3xl bg-gradient-to-b from-rose-950 via-slate-950 to-pink-950 border border-rose-500/40 rounded-3xl p-5 sm:p-8 shadow-2xl text-slate-100 space-y-6 overflow-hidden z-10 my-auto"
        >
          {/* Ambient Glowing Orbs */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }} />

          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-rose-500/20 pb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-600/30 border border-rose-400/40 rounded-2xl flex items-center justify-center text-rose-300 shadow-md animate-bounce-gentle">
                <Heart className="w-6 h-6 fill-rose-500 text-rose-400" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span>إهداء إلى ملهمتي</span>
                  <Flower2 className="w-5 h-5 text-rose-400 animate-spin-slow" />
                </h2>
                <p className="text-xs text-rose-200 font-light">
                  كارت إهداء وتوثيق مخصص برائحة الورد والوفاء لحبيبتي وملهمة العمر
                </p>
              </div>
            </div>

            <button
              onClick={() => setMayadaModalOpen(false)}
              className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-900/60 hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Live Canvas Card Preview */}
          <div className="space-y-2 relative z-10">
            <div className="flex items-center justify-between text-xs font-bold text-rose-200">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300" />
                معاينة كارت الإهداء الحي المباشر
              </span>
              <span className="text-[11px] text-slate-400 font-normal">دقة عالية 1200×670</span>
            </div>

            <div className="w-full overflow-hidden rounded-2xl border border-rose-500/30 shadow-2xl bg-slate-900/80 p-2">
              <canvas ref={canvasRef} className="w-full h-auto rounded-xl block shadow-lg" />
            </div>
          </div>

          {/* Theme Selector Options */}
          <div className="space-y-2 relative z-10">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-rose-400" />
              <span>اختر ثيم وطابع الكارت</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DEDICATION_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedThemeId(theme.id)}
                  className={`p-2.5 rounded-2xl text-xs font-bold transition border flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectedThemeId === theme.id
                      ? 'bg-rose-900/60 border-rose-400 text-white shadow-md ring-2 ring-rose-400/40'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-rose-500/40'
                  }`}
                >
                  <span>{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dedicated Message Preset Selector */}
          <div className="space-y-2 relative z-10">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <PenTool className="w-4 h-4 text-rose-400" />
              <span>اختر الكلمات أو اكتب رسالتك</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEDICATION_MESSAGES.map((msg, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedMsgIndex(idx);
                    setCustomMsg('');
                  }}
                  className={`p-3 rounded-2xl text-right text-xs transition border cursor-pointer ${
                    selectedMsgIndex === idx && !customMsg
                      ? 'bg-rose-950/80 border-rose-500 text-rose-100 font-bold shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-rose-500/30'
                  }`}
                >
                  <span className="font-bold text-rose-300 block mb-1">{msg.title}</span>
                  <p className="line-clamp-2 font-light text-[11px] leading-relaxed">{msg.text}</p>
                </button>
              ))}
            </div>

            {/* Custom text input */}
            <textarea
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="أو اكتب كلماتك الخاصة لحبيبتك هنا..."
              rows={2}
              className="w-full p-3 bg-slate-900/80 border border-rose-500/30 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-400 font-arabic"
            />
          </div>

          {/* Action Buttons: Download & Share */}
          <div className="pt-4 border-t border-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-2 text-xs text-rose-300 font-semibold">
              <Flower2 className="w-4 h-4 text-rose-400 animate-spin-slow" />
              <span>إهداء مخصص لحبيبتي</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleCopyLink}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ الإهداء'}</span>
              </button>

              <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer border border-rose-400/30"
              >
                <Download className="w-4 h-4 text-rose-200" />
                <span>تحميل كارت الإهداء</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
  );
};

export default MayadaDedicationModal;
