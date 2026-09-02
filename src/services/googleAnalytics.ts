/**
 * Google Analytics 4 (GA4) Telemetry Service
 *
 * ⚠️ الملاحظة المهمة:
 * يتم تحميل سكريبت GA الأساسي مباشرة في index.html عبر:
 *   <script id="ga-gtag-script" async src="gtag/js?id=G-F9RSXHRTBC">
 * هذه الخدمة لا تُعيد تحميل السكريبت، بل تعمل مع ما هو محمَّل بالفعل.
 */

declare global {
  interface Window {
    dataLayer: IArguments[];
    gtag: (...args: any[]) => void;
  }
}

const GA_MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-F9RSXHRTBC').trim();

/**
 * يضمن وجود dataLayer وgtag على window.
 * لا يُعيد حقن السكريبت لأنه محمَّل بالفعل من index.html.
 * يُستدعى مرة واحدة من App.tsx عند بدء التطبيق.
 */
export function initGoogleAnalytics(): void {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  // ✅ الإعداد الصحيح لـ gtag: يجب استخدام 'arguments' object وليس spread array
  window.dataLayer = window.dataLayer || [];

  if (typeof window.gtag !== 'function') {
    // هذا هو التعريف الصحيح الذي تتوقعه Google بالضبط
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments as unknown as IArguments);
    };
  }

  // ✅ السكريبت موجود بالفعل في index.html — لا نحتاج لإعادة الحقن
  // فقط نتحقق من أن التهيئة (config) تمت بشكل صحيح
  const scriptAlreadyPresent = document.getElementById('ga-gtag-script');

  if (!scriptAlreadyPresent) {
    // fallback: إذا لم يُحمَّل السكريبت لأي سبب، نحقنه هنا
    console.warn('[GA] السكريبت غير موجود في index.html، يتم الحقن الآن كـ fallback...');
    const script = document.createElement('script');
    script.id = 'ga-gtag-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.onload = () => {
      window.gtag('js', new Date());
      window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: true });
    };
    document.head.appendChild(script);
  }
  // إذا كان السكريبت موجود، فـ index.html سبق واستدعى gtag('config') — لا شيء آخر مطلوب
}

/**
 * Track custom user events in GA4 (Reading progress, Quiz score, Book completion)
 */
export function trackGAEvent(eventName: string, eventParams: Record<string, any> = {}): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  window.gtag('event', eventName, {
    platform: 'Al-Raheeq Al-Makhtom',
    timestamp: new Date().toISOString(),
    ...eventParams,
  });
}

/**
 * Track Page Views (for SPA navigation)
 */
export function trackGAPageView(path: string, title?: string): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title || document.title,
  });
}

/**
 * Track Book Page Read
 */
export function trackGABookRead(pageNumber: number, totalPages: number): void {
  trackGAEvent('read_book_page', {
    page_number: pageNumber,
    total_pages: totalPages,
    progress_percentage: Math.round((pageNumber / totalPages) * 100),
  });
}

/**
 * Track Quiz Section Completion
 */
export function trackGAQuizCompleted(sectionId: number, scorePercentage: number): void {
  trackGAEvent('complete_quiz_section', {
    section_id: sectionId,
    score_percentage: scorePercentage,
  });
}
