import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { useAppStore } from '../store/useAppStore';
import { Loader2, AlertCircle, Sparkles, ChevronRight, ChevronLeft, RotateCw } from 'lucide-react';

// Configure PDF.js worker using stable CDN worker URL
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface PdfCanvasViewerProps {
  pdfUrl?: string;
  isFullscreen?: boolean;
}

export const PdfCanvasViewer: React.FC<PdfCanvasViewerProps> = ({
  pdfUrl = '/book.pdf',
  isFullscreen = false,
}) => {
  const {
    currentPage,
    totalPages,
    setTotalPages,
    zoomLevel,
    viewMode,
    readingTheme,
    setCurrentPage,
  } = useAppStore();

  const [pdfDocument, setPdfDocument] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [docLoading, setDocLoading] = useState<boolean>(true);
  const [pageRendering, setPageRendering] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLandscape, setIsLandscape] = useState<boolean>(
    typeof window !== 'undefined' && window.innerWidth > window.innerHeight
  );

  const canvasRef1 = useRef<HTMLCanvasElement | null>(null);
  const canvasRef2 = useRef<HTMLCanvasElement | null>(null);
  const renderTask1 = useRef<any>(null);
  const renderTask2 = useRef<any>(null);

  // Touch Swipe State
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Detect Orientation Change (Portrait vs Landscape mode)
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

  // Load PDF Document progressively (range requests / streaming)
  useEffect(() => {
    let isMounted = true;
    setDocLoading(true);
    setError(null);

    const loadingTask = pdfjsLib.getDocument({
      url: pdfUrl,
      rangeChunkSize: 65536, // 64KB chunks for rapid streaming
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

        // Screen geometry calculation for Landscape & Fullscreen modes
        const isMobileScreen = window.innerWidth < 768;
        const landscapeMode = window.innerWidth > window.innerHeight;

        let availableWidth = window.innerWidth - 16;
        if (isFullscreen) {
          availableWidth = landscapeMode ? window.innerWidth - 24 : window.innerWidth - 12;
        } else if (landscapeMode && isMobileScreen) {
          // Phone turned sideways (Landscape) -> maximize reading width!
          availableWidth = window.innerWidth - 24;
        } else if (!isMobileScreen) {
          availableWidth = Math.min(window.innerWidth - 64, viewMode === 'double' ? 620 : 920);
        }

        const baseScale = availableWidth / unscaledViewport.width;
        const finalScale = baseScale * zoomLevel;

        const viewport = page.getViewport({ scale: finalScale });

        // Cap DPR at 2 for fast & crisp rendering
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

        // Pre-fetch next page in background memory
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

  // Touch Swipe Gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isSwipeLeft = distance > 50;
    const isSwipeRight = distance < -50;

    // RTL Layout: Swipe Left -> Next Page, Swipe Right -> Prev Page
    if (isSwipeLeft && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (isSwipeRight && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }

    touchStartX.current = null;
    touchEndX.current = null;
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
          {/* Landscape Orientation Active Badge */}
          {isLandscape && (
            <div className="mb-2 px-3 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1.5 shrink-0">
              <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
              <span>الشاشة الأفقية مفعّلة • عرض متسق للقصة</span>
            </div>
          )}

          {/* Quick Page Render Indicator Overlay */}
          {pageRendering && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 bg-slate-900/80 backdrop-blur-md text-emerald-300 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shadow-lg border border-emerald-500/30">
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

            <span className="text-[11px] font-semibold opacity-75">
              اسحب يميناً أو يساراً للتنقل 👈👉
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
