import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import screenfull from 'screenfull';
import { useAppStore } from '../store/useAppStore';
import {
  Loader2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  RotateCw,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
} from 'lucide-react';

// Configure PDF.js worker using stable CDN worker URL
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface PdfCanvasViewerProps {
  pdfUrl?: string;
  isFullscreen?: boolean;
}

// Synthesize authentic paper page-flip sound using Web Audio API
const playPaperFlipSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;
    noise.connect(filter);
    filter.connect(ctx.destination);
    noise.start();
  } catch (e) {
    // Audio Context optional
  }
};

export const PdfCanvasViewer: React.FC<PdfCanvasViewerProps> = ({
  pdfUrl = '/book.pdf',
  isFullscreen = false,
}) => {
  const {
    currentPage,
    totalPages,
    setTotalPages,
    zoomLevel,
    setZoomLevel,
    viewMode,
    readingTheme,
    setCurrentPage,
  } = useAppStore();

  const [pdfDocument, setPdfDocument] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [docLoading, setDocLoading] = useState<boolean>(true);
  const [pageRendering, setPageRendering] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isOrientationLocked, setIsOrientationLocked] = useState<boolean>(false);
  const [isLandscape, setIsLandscape] = useState<boolean>(
    typeof window !== 'undefined' && window.innerWidth > window.innerHeight
  );

  const canvasRef1 = useRef<HTMLCanvasElement | null>(null);
  const canvasRef2 = useRef<HTMLCanvasElement | null>(null);
  const renderTask1 = useRef<any>(null);
  const renderTask2 = useRef<any>(null);

  // Multi-Touch Pinch & Swipe State
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const initialPinchDist = useRef<number | null>(null);
  const lastTapTime = useRef<number>(0);

  // Detect Orientation Change
  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Force Lock Orientation to Landscape on Mobile
  const toggleOrientationLock = async () => {
    try {
      if ('orientation' in screen && 'lock' in (screen as any).orientation) {
        if (!isOrientationLocked) {
          await (screen as any).orientation.lock('landscape');
          setIsOrientationLocked(true);
        } else {
          await (screen as any).orientation.unlock();
          setIsOrientationLocked(false);
        }
      } else {
        alert('خاصية قفل التدوير الآلي غير مدعومة مباشرة في متصفحك الحالي. يرجى تدوير شاشة الهاتف يدويًا.');
      }
    } catch (err) {
      console.log('Orientation lock error:', err);
    }
  };

  // Load PDF Document progressively (range requests / 64KB chunk streaming)
  useEffect(() => {
    let isMounted = true;
    setDocLoading(true);
    setError(null);

    const loadingTask = pdfjsLib.getDocument({
      url: pdfUrl,
      rangeChunkSize: 65536,
      disableStream: false,
      disableAutoFetch: false,
    });

    loadingTask.promise
      .then((pdf) => {
        if (!isMounted) return;
        setPdfDocument(pdf);
        setTotalPages(pdf.numPages);
        setDocLoading(false);
      })
      .catch((err) => {
        console.error('Error loading PDF document:', err);
        if (isMounted) {
          setError('تعذر تحميل ملف PDF الخاص بكتاب الرحيق المختوم. يرجى التأكد من اتصال الإنترنت.');
          setDocLoading(false);
        }
      });

    return () => {
      isMounted = false;
      loadingTask.destroy();
    };
  }, [pdfUrl, setTotalPages]);

  // Play flip sound when page changes
  useEffect(() => {
    if (soundEnabled && !docLoading) {
      playPaperFlipSound();
    }
  }, [currentPage, soundEnabled, docLoading]);

  // Render a specific page asynchronously to a canvas
  const renderPage = useCallback(
    async (
      pageNumber: number,
      canvas: HTMLCanvasElement | null,
      renderTaskRef: React.MutableRefObject<any>
    ) => {
      if (!pdfDocument || !canvas) return;

      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (e) {
          // ignore cancellation
        }
      }

      setPageRendering(true);

      try {
        const page = await pdfDocument.getPage(pageNumber);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const unscaledViewport = page.getViewport({ scale: 1.0 });

        const isMobileScreen = window.innerWidth < 768;
        const landscapeMode = window.innerWidth > window.innerHeight;

        let availableWidth = window.innerWidth - 16;
        if (isFullscreen) {
          availableWidth = landscapeMode ? window.innerWidth - 24 : window.innerWidth - 12;
        } else if (landscapeMode && isMobileScreen) {
          availableWidth = window.innerWidth - 24;
        } else if (!isMobileScreen) {
          availableWidth = Math.min(window.innerWidth - 64, viewMode === 'double' ? 620 : 920);
        }

        const baseScale = availableWidth / unscaledViewport.width;
        const finalScale = baseScale * zoomLevel;

        const viewport = page.getViewport({ scale: finalScale });
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = viewport.width * dpr;
        canvas.height = viewport.height * dpr;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        ctx.scale(dpr, dpr);

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        const task = page.render(renderContext);
        renderTaskRef.current = task;
        await task.promise;

        setPageRendering(false);

        // Pre-fetch next page silently
        if (pageNumber < pdfDocument.numPages) {
          pdfDocument.getPage(pageNumber + 1).catch(() => {});
        }
      } catch (err: any) {
        if (err.name !== 'RenderingCancelledException') {
          console.error('Error rendering PDF page:', err);
        }
        setPageRendering(false);
      }
    },
    [pdfDocument, zoomLevel, viewMode, isFullscreen]
  );

  // Trigger page render when currentPage, zoom, or viewMode changes
  useEffect(() => {
    if (!pdfDocument) return;

    renderPage(currentPage, canvasRef1.current, renderTask1);

    if (viewMode === 'double' && window.innerWidth >= 768 && currentPage < totalPages) {
      renderPage(currentPage + 1, canvasRef2.current, renderTask2);
    }
  }, [pdfDocument, currentPage, zoomLevel, viewMode, totalPages, renderPage, isLandscape]);

  // Touch Swipe & Pinch-to-Zoom Event Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
    } else if (e.touches.length === 2) {
      // Pinch Gesture Start
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialPinchDist.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchEndX.current = e.touches[0].clientX;
    } else if (e.touches.length === 2 && initialPinchDist.current !== null) {
      // Pinch Gesture Move
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleDiff = currentDist / initialPinchDist.current;

      if (scaleDiff > 1.1) {
        setZoomLevel(Math.min(zoomLevel + 0.05, 2.5));
        initialPinchDist.current = currentDist;
      } else if (scaleDiff < 0.9) {
        setZoomLevel(Math.max(zoomLevel - 0.05, 0.7));
        initialPinchDist.current = currentDist;
      }
    }
  };

  const handleTouchEnd = () => {
    // Handle Double Tap to Reset Zoom
    const now = Date.now();
    if (now - lastTapTime.current < 300) {
      setZoomLevel(zoomLevel === 1.0 ? 1.4 : 1.0);
      lastTapTime.current = 0;
      return;
    }
    lastTapTime.current = now;

    // Handle Swipe Gestures
    if (touchStartX.current && touchEndX.current) {
      const distance = touchStartX.current - touchEndX.current;
      const isSwipeLeft = distance > 50;
      const isSwipeRight = distance < -50;

      if (isSwipeLeft && currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      } else if (isSwipeRight && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
    initialPinchDist.current = null;
  };

  // Theme Wrapper CSS
  const themeClassMap = {
    paper: 'theme-paper bg-white text-slate-900',
    sepia: 'theme-sepia bg-[#F7F1E1] text-[#432C0D]',
    night: 'theme-night bg-[#121614] text-[#E0E7E3]',
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[75vh] p-1 sm:p-4 rounded-3xl transition-colors duration-300 ${
        themeClassMap[readingTheme]
      } ${isFullscreen ? 'w-full h-full min-h-screen rounded-none p-0' : ''} select-none`}
    >
      {/* Document Loading State */}
      {docLoading && (
        <div className="flex flex-col items-center justify-center p-10 sm:p-16 text-center space-y-4">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
            <Sparkles className="w-5 h-5 text-amber-500 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div className="space-y-1">
            <p className="text-base sm:text-lg font-black">جاري تحميل صفحات الكتاب بالتدريج...</p>
            <p className="text-xs text-slate-500 font-light">
              تحميل سريع ومباشر لصفحات كتاب الرحيق المختوم
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-3xl border border-red-200 dark:border-red-800 text-center max-w-md my-auto">
          <AlertCircle className="w-10 h-10 mb-3 text-red-600" />
          <p className="font-semibold text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white text-xs font-bold rounded-full hover:bg-red-700 transition cursor-pointer"
          >
            إعادة التنشيط
          </button>
        </div>
      )}

      {/* Rendered Book Pages Display */}
      {!docLoading && !error && (
        <div className="w-full flex flex-col items-center justify-center relative">
          {/* Top Floating Mobile Toolbar Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
            {/* Landscape Status & Lock Toggle Button */}
            <button
              onClick={toggleOrientationLock}
              className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                isLandscape
                  ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800/10 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-800/20'
              }`}
              title="قفل/فك تدوير الشاشة أفقياً"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isOrientationLocked ? 'animate-spin' : ''}`} />
              <span>
                {isLandscape ? 'وضع الشاشة الأفقية مفعّل' : 'تدوير أفقياً'}
              </span>
            </button>

            {/* Flip Sound Toggle Button */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                soundEnabled
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-800/10 dark:bg-white/10 text-slate-500 opacity-60'
              }`}
              title={soundEnabled ? 'صوت تقليب الورق مفعّل' : 'تفعيل صوت الورق'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-500" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{soundEnabled ? 'صوت الورق' : 'مكتوم'}</span>
            </button>

            {/* Native Fullscreen Library Toggle */}
            <button
              onClick={() => {
                if (screenfull.isEnabled) {
                  screenfull.toggle();
                }
              }}
              className="px-2.5 py-1 bg-slate-800/10 dark:bg-white/10 text-slate-700 dark:text-slate-200 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 hover:bg-slate-800/20 transition cursor-pointer"
              title="ملء الشاشة عبر screenfull"
            >
              <Maximize className="w-3.5 h-3.5 text-teal-500" />
              <span>ملء الشاشة</span>
            </button>
          </div>

          {/* Quick Page Render Indicator Overlay */}
          {pageRendering && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 px-3 py-1 bg-slate-900/80 backdrop-blur-md text-emerald-300 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shadow-lg border border-emerald-500/30">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>جاري تقديم الصفحة {currentPage}...</span>
            </div>
          )}

          {/* Canvas Wrapper */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full max-w-full overflow-x-auto py-1">
            {/* Primary Page Canvas */}
            <div className="relative shadow-2xl rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-white transition-transform duration-200 w-full sm:w-auto flex justify-center">
              <canvas ref={canvasRef1} className="block mx-auto max-w-full h-auto" />
              <div className="absolute bottom-2 left-2 px-2.5 py-0.5 bg-black/70 backdrop-blur-md text-white text-[10px] sm:text-xs rounded-full font-mono dir-ltr z-10">
                صفحة {currentPage}
              </div>
            </div>

            {/* Secondary Canvas for Double Page Mode (Desktop Only) */}
            {viewMode === 'double' && window.innerWidth >= 768 && currentPage < totalPages && (
              <div className="relative shadow-2xl rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-white transition-transform duration-200">
                <canvas ref={canvasRef2} className="block mx-auto max-w-full h-auto" />
                <div className="absolute bottom-2 left-2 px-2.5 py-0.5 bg-black/70 backdrop-blur-md text-white text-[10px] sm:text-xs rounded-full font-mono dir-ltr z-10">
                  صفحة {currentPage + 1}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Quick Tap Side Navigation Overlay */}
          <div className="md:hidden flex items-center justify-between w-full px-2 pt-3 text-xs font-bold text-slate-500">
            <button
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-800/10 dark:bg-white/10 rounded-full disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
              <span>السابقة</span>
            </button>

            <span className="text-[10px] font-semibold opacity-75">
              انقر مرتين للتكبير • اسحب للتصفح 👈👉
            </span>

            <button
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-800/10 dark:bg-white/10 rounded-full disabled:opacity-30 cursor-pointer"
            >
              <span>التالية</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfCanvasViewer;
