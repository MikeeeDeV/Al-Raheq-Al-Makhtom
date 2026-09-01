/**
 * Google Analytics 4 (GA4) & Google Tag Manager (GTM) Telemetry Service
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

const GA_MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-F9RSXHRTBC').trim();

/**
 * Initializes Google Analytics 4 dynamically (Deferred for peak performance / 95+ score)
 */
export function initGoogleAnalytics() {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  // Avoid injecting script twice
  if (document.getElementById('ga-gtag-script')) return;

  const loadScript = () => {
    if (document.getElementById('ga-gtag-script')) return;

    const script = document.createElement('script');
    script.id = 'ga-gtag-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      page_path: window.location.pathname,
      anonymize_ip: true,
      send_page_view: true,
    });
  };

  // Defer injection until browser is idle or post-load to free initial critical render path
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => loadScript(), { timeout: 3500 });
  } else {
    setTimeout(loadScript, 2500);
  }
}

/**
 * Track custom user events in GA4 (Reading progress, Quiz score, Book completion)
 */
export function trackGAEvent(eventName: string, eventParams: Record<string, any> = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      platform: 'Al-Raheeq Al-Makhtom',
      timestamp: new Date().toISOString(),
      ...eventParams,
    });
  }
}

/**
 * Track Page Views
 */
export function trackGAPageView(path: string, title?: string) {
  trackGAEvent('page_view', {
    page_path: path,
    page_title: title || document.title,
  });
}

/**
 * Track Book Page Read
 */
export function trackGABookRead(pageNumber: number, totalPages: number) {
  trackGAEvent('read_book_page', {
    page_number: pageNumber,
    total_pages: totalPages,
    progress_percentage: Math.round((pageNumber / totalPages) * 100),
  });
}

/**
 * Track Quiz Section Completion
 */
export function trackGAQuizCompleted(sectionId: number, scorePercentage: number) {
  trackGAEvent('complete_quiz_section', {
    section_id: sectionId,
    score_percentage: scorePercentage,
  });
}
