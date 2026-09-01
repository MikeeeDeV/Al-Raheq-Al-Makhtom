import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { useAppStore } from '../store/useAppStore';
import { Loader2, AlertCircle } from 'lucide-react';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface PdfCanvasViewerProps {
  pdfUrl?: string;
}

export const PdfCanvasViewer: React.FC<PdfCanvasViewerProps> = ({ pdfUrl = '/book.pdf' }) => {
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const canvasRef1 = useRef<HTMLCanvasElement | null>(null);
  const canvasRef2 = useRef<HTMLCanvasElement | null>(null);
  const renderTask1 = useRef<any>(null);
  const renderTask2 = useRef<any>(null);

  // Load PDF Document
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const loadingTask = pdfjsLib.getDocument(pdfUrl);

    loadingTask.promise
      .then((pdf) => {
        if (!isMounted) return;
        setPdfDocument(pdf);
        setTotalPages(pdf.numPages);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading PDF document:', err);
        if (isMounted) {
          setError('تعذر تحميل ملف PDF الخاص بكتاب الرحيق المختوم. يرجى التأكد من الملقف وحجم الصفحة.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
      loadingTask.destroy();
    };
  }, [pdfUrl, setTotalPages]);

  // Render Page to Canvas
  const renderPage = async (
    pageNumber: number,
    canvas: HTMLCanvasElement | null,
    renderTaskRef: React.MutableRefObject<any>
  ) => {
    if (!pdfDocument || !canvas) return;

    if (renderTaskRef.current) {
      try {
        renderTaskRef.current.cancel();
      } catch (e) {
        // ignore cancellation error
      }
    }

    try {
      const page = await pdfDocument.getPage(pageNumber);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Base viewport at scale 1.0 to check original dimensions
      const unscaledViewport = page.getViewport({ scale: 1.0 });

      // Responsive scale based on screen width
      const containerWidth = Math.min(window.innerWidth - 64, viewMode === 'double' ? 600 : 850);
      const baseScale = containerWidth / unscaledViewport.width;
      const finalScale = baseScale * zoomLevel;

      const viewport = page.getViewport({ scale: finalScale });

      // Device Pixel Ratio for crisp rendering
      const dpr = window.devicePixelRatio || 1;
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
    } catch (err: any) {
      if (err.name !== 'RenderingCancelledException') {
        console.error('Error rendering page:', err);
      }
    }
  };

  useEffect(() => {
    if (!pdfDocument) return;

    renderPage(currentPage, canvasRef1.current, renderTask1);

    if (viewMode === 'double' && currentPage < totalPages) {
      renderPage(currentPage + 1, canvasRef2.current, renderTask2);
    }
  }, [pdfDocument, currentPage, zoomLevel, viewMode, totalPages]);

  // Keyboard Navigation & Touch Swiping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        // Next page in RTL
        if (currentPage < totalPages) setCurrentPage(currentPage + (viewMode === 'double' ? 2 : 1));
      } else if (e.key === 'ArrowRight') {
        // Previous page in RTL
        if (currentPage > 1) setCurrentPage(currentPage - (viewMode === 'double' ? 2 : 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, viewMode, setCurrentPage]);

  // Theme Wrapper CSS
  const themeClassMap = {
    paper: 'theme-paper bg-white text-slate-900',
    sepia: 'theme-sepia bg-[#F7F1E1] text-[#432C0D]',
    night: 'theme-night bg-[#121614] text-[#E0E7E3]',
  };

  return (
    <div className={`relative flex flex-col items-center justify-center min-h-[70vh] p-3 md:p-6 rounded-3xl transition-colors duration-300 ${themeClassMap[readingTheme]}`}>
      {loading && (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <Loader2 className="w-12 h-12 text-m3-primary animate-spin mb-4" />
          <p className="text-lg font-medium">جاري تحميل صفحات الكتاب العطرة...</p>
          <span className="text-sm opacity-70 mt-1">الرحيق المختوم في سيرة النبي الكريم ﷺ</span>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-2xl border border-red-200 dark:border-red-800 text-center max-w-md">
          <AlertCircle className="w-10 h-10 mb-3 text-red-600" />
          <p className="font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-5 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-full overflow-x-auto py-2">
          {/* Main Canvas (Current Page) */}
          <div className="relative shadow-m3-3 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 transition-transform duration-200">
            <canvas ref={canvasRef1} className="block mx-auto max-w-full" />
            <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs rounded-full font-sans dir-ltr">
              الصفحة {currentPage}
            </div>
          </div>

          {/* Second Canvas for Double Page Mode */}
          {viewMode === 'double' && currentPage < totalPages && (
            <div className="relative shadow-m3-3 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 transition-transform duration-200">
              <canvas ref={canvasRef2} className="block mx-auto max-w-full" />
              <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs rounded-full font-sans dir-ltr">
                الصفحة {currentPage + 1}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
