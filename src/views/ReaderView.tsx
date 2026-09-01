import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { PdfCanvasViewer } from '../components/PdfCanvasViewer';
import { AutoResumeBanner } from '../components/AutoResumeBanner';
import {
  ChevronRight,
  ChevronLeft,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  Coffee,
  BookmarkPlus,
  Bookmark as BookmarkIcon,
  Columns,
  Square,
  X,
  Trash2,
  BookOpen,
} from 'lucide-react';
import { ReaderTheme } from '../types';

export const ReaderView: React.FC = () => {
  const {
    currentPage,
    totalPages,
    setCurrentPage,
    zoomLevel,
    setZoomLevel,
    viewMode,
    setViewMode,
    readingTheme,
    setReadingTheme,
    bookmarks,
    addBookmark,
    removeBookmark,
  } = useAppStore();

  const [pageInput, setPageInput] = useState<string>('');
  const [showBookmarksDrawer, setShowBookmarksDrawer] = useState<boolean>(false);
  const [isAddingBookmark, setIsAddingBookmark] = useState<boolean>(false);
  const [bookmarkTitle, setBookmarkTitle] = useState<string>('');
  const [bookmarkNote, setBookmarkNote] = useState<string>('');

  const progressPercentage = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(pageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setPageInput('');
    }
  };

  const handleSaveBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    const title = bookmarkTitle.trim() || `علامة الصفحة ${currentPage}`;
    addBookmark(currentPage, title, bookmarkNote);
    setBookmarkTitle('');
    setBookmarkNote('');
    setIsAddingBookmark(false);
  };

  const isCurrentPageBookmarked = bookmarks.some((b) => b.pageNumber === currentPage);

  const themeOptions: { id: ReaderTheme; label: string; icon: React.ReactNode }[] = [
    { id: 'paper', label: 'ورقي', icon: <Sun className="w-4 h-4" /> },
    { id: 'sepia', label: 'دافئ', icon: <Coffee className="w-4 h-4" /> },
    { id: 'night', label: 'ليلي', icon: <Moon className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-3 sm:space-y-6 pb-20 px-0 sm:px-0">
      {/* Auto Resume Banner */}
      <AutoResumeBanner />

      {/* Reader Control Toolbar (Sticky Glassmorphic Container) */}
      <div className="sticky top-14 sm:top-16 z-30 bg-m3-surface/95 dark:bg-m3-surface-dark/95 backdrop-blur-md p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-m3-outline-variant/30 shadow-m3-2 space-y-2 sm:space-y-3">
        {/* Top Control Line */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Right: Page Stepper Navigation */}
          <div className="flex items-center gap-1 bg-m3-surface-dim dark:bg-m3-surface-darkContainer p-1 rounded-full border border-m3-outline-variant/20">
            {/* Next in RTL */}
            <button
              onClick={() => setCurrentPage(currentPage + (viewMode === 'double' ? 2 : 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 sm:p-2 rounded-full text-m3-onSurface hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
              title="الصفحة التالية"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Jump Input */}
            <form onSubmit={handlePageSubmit} className="flex items-center gap-1 px-1 sm:px-2 text-xs font-semibold">
              <input
                type="number"
                min={1}
                max={totalPages}
                placeholder={`${currentPage}`}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                className="w-10 sm:w-12 h-7 sm:h-8 text-center bg-white dark:bg-m3-surface-darkDim border border-m3-outline-variant/40 rounded-lg text-m3-onSurface focus:outline-hidden focus:border-m3-primary text-xs"
              />
              <span className="text-m3-onSurface-variant text-[11px] sm:text-xs">/ {totalPages}</span>
            </form>

            {/* Prev in RTL */}
            <button
              onClick={() => setCurrentPage(currentPage - (viewMode === 'double' ? 2 : 1))}
              disabled={currentPage <= 1}
              className="p-1.5 sm:p-2 rounded-full text-m3-onSurface hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
              title="الصفحة السابقة"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Center: Zoom & View Mode Controls */}
          <div className="flex items-center gap-1.5">
            {/* Zoom Out */}
            <button
              onClick={() => setZoomLevel(zoomLevel - 0.15)}
              disabled={zoomLevel <= 0.6}
              className="p-1.5 sm:p-2.5 bg-m3-surface-dim dark:bg-m3-surface-darkContainer rounded-full text-m3-onSurface hover:bg-m3-primary-container/40 disabled:opacity-30 transition cursor-pointer"
              title="تصغير"
            >
              <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <span className="text-xs font-bold w-10 sm:w-12 text-center text-m3-onSurface font-mono">
              {Math.round(zoomLevel * 100)}%
            </span>

            {/* Zoom In */}
            <button
              onClick={() => setZoomLevel(zoomLevel + 0.15)}
              disabled={zoomLevel >= 2.2}
              className="p-1.5 sm:p-2.5 bg-m3-surface-dim dark:bg-m3-surface-darkContainer rounded-full text-m3-onSurface hover:bg-m3-primary-container/40 disabled:opacity-30 transition cursor-pointer"
              title="تكبير"
            >
              <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* View Mode Toggle (Desktop only) */}
            <button
              onClick={() => setViewMode(viewMode === 'single' ? 'double' : 'single')}
              className="hidden md:flex p-2.5 bg-m3-surface-dim dark:bg-m3-surface-darkContainer rounded-full text-m3-onSurface hover:bg-m3-primary-container/40 transition cursor-pointer"
              title={viewMode === 'single' ? 'عرض صفحتين' : 'عرض صفحة واحدة'}
            >
              {viewMode === 'single' ? <Columns className="w-4 h-4" /> : <Square className="w-4 h-4" />}
            </button>
          </div>

          {/* Left: Themes & Bookmarks */}
          <div className="flex items-center gap-1.5">
            {/* Theme Picker */}
            <div className="flex items-center p-1 bg-m3-surface-dim dark:bg-m3-surface-darkContainer rounded-full border border-m3-outline-variant/20">
              {themeOptions.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setReadingTheme(t.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                    readingTheme === t.id
                      ? 'bg-m3-primary-container text-m3-primary-onContainer font-bold shadow-xs'
                      : 'text-m3-onSurface-variant hover:text-m3-onSurface'
                  }`}
                >
                  {t.icon}
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              ))}
            </div>

            {/* Add Bookmark Action */}
            <button
              onClick={() => setIsAddingBookmark(true)}
              className={`p-2 sm:p-2.5 rounded-full transition cursor-pointer ${
                isCurrentPageBookmarked
                  ? 'bg-amber-500 text-white'
                  : 'bg-m3-surface-dim dark:bg-m3-surface-darkContainer text-m3-onSurface hover:bg-m3-primary-container/40'
              }`}
              title="حفظ علامة مرجعية"
            >
              <BookmarkPlus className="w-4 h-4" />
            </button>

            {/* Bookmarks Drawer Toggle */}
            <button
              onClick={() => setShowBookmarksDrawer(!showBookmarksDrawer)}
              className="relative p-2 sm:p-2.5 bg-m3-surface-dim dark:bg-m3-surface-darkContainer rounded-full text-m3-onSurface hover:bg-m3-primary-container/40 transition cursor-pointer"
              title="قائمة العلامات المرجعية"
            >
              <BookmarkIcon className="w-4 h-4" />
              {bookmarks.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {bookmarks.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Persistent Linear Reading Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] sm:text-xs text-m3-onSurface-variant font-medium">
            <span>نسبة الإنجاز: {progressPercentage}%</span>
            <span>الصفحة {currentPage} من أصل {totalPages}</span>
          </div>
          <div className="w-full h-1.5 sm:h-2 bg-m3-surface-dim dark:bg-m3-surface-darkDim rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Canvas Viewer */}
      <PdfCanvasViewer pdfUrl="/book.pdf" />

      {/* Add Bookmark Modal Dialog */}
      {isAddingBookmark && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-arabic dir-rtl">
          <div className="bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant/30 w-full max-w-md rounded-3xl p-6 shadow-m3-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base sm:text-lg text-m3-onSurface">
                إضافة فاصل مرجعي (صفحة {currentPage})
              </h3>
              <button
                onClick={() => setIsAddingBookmark(false)}
                className="p-2 text-m3-onSurface-variant hover:bg-m3-surface-container rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBookmark} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-m3-onSurface-variant mb-1">
                  عنوان الفاصل / المبحث
                </label>
                <input
                  type="text"
                  placeholder={`مثال: نسب النبي الشريف (صفحة ${currentPage})`}
                  value={bookmarkTitle}
                  onChange={(e) => setBookmarkTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-m3-surface-container dark:bg-m3-surface-darkContainer rounded-xl border border-m3-outline-variant/30 text-m3-onSurface text-xs focus:outline-hidden focus:border-m3-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-m3-onSurface-variant mb-1">
                  ملاحظة خاصة (اختياري)
                </label>
                <textarea
                  rows={3}
                  placeholder="اكتب أي تدوين أو فائذة استوقفتك في هذه الصفحة..."
                  value={bookmarkNote}
                  onChange={(e) => setBookmarkNote(e.target.value)}
                  className="w-full px-4 py-2.5 bg-m3-surface-container dark:bg-m3-surface-darkContainer rounded-xl border border-m3-outline-variant/30 text-m3-onSurface text-xs focus:outline-hidden focus:border-m3-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingBookmark(false)}
                  className="px-5 py-2 text-xs text-m3-onSurface-variant hover:bg-m3-surface-container rounded-full cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-m3-primary text-white font-bold text-xs rounded-full hover:bg-m3-primary/90 shadow-m3-1 cursor-pointer"
                >
                  حفظ الفاصل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bookmarks Drawer Overlay */}
      {showBookmarksDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs font-arabic dir-rtl">
          <div className="bg-m3-surface dark:bg-m3-surface-dark w-full max-w-sm h-full p-6 shadow-m3-5 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-m3-outline-variant/20">
                <div className="flex items-center gap-2 text-m3-primary dark:text-m3-primary-dark font-bold text-base sm:text-lg">
                  <BookmarkIcon className="w-5 h-5" />
                  <span>الفواصل المرجعية ({bookmarks.length})</span>
                </div>
                <button
                  onClick={() => setShowBookmarksDrawer(false)}
                  className="p-2 text-m3-onSurface-variant hover:bg-m3-surface-container rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {bookmarks.length === 0 ? (
                <div className="text-center py-12 text-m3-onSurface-variant space-y-2">
                  <BookmarkIcon className="w-12 h-12 mx-auto opacity-30" />
                  <p className="font-semibold text-sm">لا توجد فواصل محفوطة بعد</p>
                  <p className="text-xs">اضغط على أيقونة الإضافة في شريط الأدوات لحفظ صفحتك الحالية.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookmarks.map((bm) => (
                    <div
                      key={bm.id}
                      className="p-4 bg-m3-surface-container dark:bg-m3-surface-darkContainer rounded-2xl border border-m3-outline-variant/30 space-y-2 group hover:border-m3-primary/50 transition"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-m3-onSurface">{bm.title}</h4>
                          <span className="text-xs text-m3-primary dark:text-m3-primary-dark font-semibold">
                            الصفحة {bm.pageNumber}
                          </span>
                        </div>
                        <button
                          onClick={() => removeBookmark(bm.id)}
                          className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-full transition opacity-70 group-hover:opacity-100 cursor-pointer"
                          title="حذف الفاصل"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {bm.note && (
                        <p className="text-xs text-m3-onSurface-variant bg-white/50 dark:bg-black/20 p-2 rounded-lg italic">
                          "{bm.note}"
                        </p>
                      )}

                      <button
                        onClick={() => {
                          setCurrentPage(bm.pageNumber);
                          setShowBookmarksDrawer(false);
                        }}
                        className="w-full mt-2 py-1.5 bg-m3-primary-container text-m3-primary-onContainer rounded-full text-xs font-semibold hover:bg-m3-primary/20 transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>انتقال مباشر للصفحة</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowBookmarksDrawer(false)}
              className="w-full py-2.5 bg-m3-surface-dim text-m3-onSurface rounded-full text-xs font-bold cursor-pointer"
            >
              إغلاق النافذة
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReaderView;
