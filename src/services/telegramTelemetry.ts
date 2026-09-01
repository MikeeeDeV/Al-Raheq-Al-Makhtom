export interface VisitorInfo {
  ip?: string;
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  flag?: string;
  device?: string;
  browser?: string;
  userAgent?: string;
}

export interface ContactFormData {
  name: string;
  contactInfo: string;
  subject: string;
  message: string;
}

export interface ErrorTelemetryData {
  message: string;
  source?: string;
  lineno?: number;
  colno?: number;
  stack?: string;
}

export interface BookCompletionData {
  startDate: string;
  endDate: string;
  totalPages: number;
  totalAnswered: number;
  correctAnswersCount: number;
  accuracyPercentage: number;
  streakDays: number;
}

const DEFAULT_BOT_TOKEN = '8616682746:AAHRFQM-llzhrCK-XbzYDVYGIVbuzlkwLSY';
const DEFAULT_CHAT_ID = '-1004405204712';

function getTelegramCredentials() {
  const token = (import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '').trim() || DEFAULT_BOT_TOKEN;
  const chatId = (import.meta.env.VITE_TELEGRAM_CHAT_ID || '').trim() || DEFAULT_CHAT_ID;
  return { token, chatId };
}

/**
 * Safely fetches IP geolocation info without blocking app load.
 */
export async function getVisitorLocation(): Promise<VisitorInfo> {
  const ua = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const device = isMobile ? '📱 موبايل (Mobile)' : '💻 كومبيوتر (Desktop)';

  try {
    const response = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(3500) });
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        return {
          ip: data.ip || 'غير محدد',
          city: data.city || 'غير محدد',
          region: data.region || '',
          country: data.country || 'غير محدد',
          countryCode: data.country_code || '',
          flag: data.flag?.emoji || (data.country_code ? getFlagEmoji(data.country_code) : '🌍'),
          device,
          userAgent: ua,
        };
      }
    }
  } catch (error) {
    console.log('Primary geolocation fetch error:', error);
  }

  try {
    const response = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
    if (response.ok) {
      const data = await response.json();
      return {
        ip: data.ip || 'غير محدد',
        city: data.city || 'غير محدد',
        region: data.region || '',
        country: data.country_name || 'غير محدد',
        countryCode: data.country_code || '',
        flag: data.country_code ? getFlagEmoji(data.country_code) : '🌍',
        device,
        userAgent: ua,
      };
    }
  } catch (error) {
    console.log('Secondary geolocation fetch error:', error);
  }

  return {
    ip: 'مجهول',
    city: 'غير محدد',
    country: 'غير محدد',
    flag: '🌍',
    device,
    userAgent: ua,
  };
}

function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

/**
 * Sends HTML formatted message directly to a target Telegram user (@username or chat_id).
 * Returns true ONLY if the direct DM to the user was successfully delivered by Telegram.
 */
export async function sendDirectTelegramUserMessage(
  textMessage: string,
  targetChatId: string
): Promise<boolean> {
  const { token } = getTelegramCredentials();

  if (!token || !targetChatId || !targetChatId.trim() || targetChatId.trim() === '@') {
    return false;
  }

  const cleanTarget = targetChatId.trim().startsWith('@')
    ? targetChatId.trim()
    : `@${targetChatId.trim()}`;

  const endpoint = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: cleanTarget,
        text: textMessage,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      }),
    });

    const resJson = await response.json();
    if (response.ok && resJson.ok) {
      return true;
    } else {
      console.warn(`Direct Telegram DM to ${cleanTarget} failed:`, resJson);
      return false;
    }
  } catch (error) {
    console.warn(`Failed to send direct DM to ${cleanTarget}:`, error);
    return false;
  }
}

/**
 * Sends HTML formatted message to Telegram Bot Channel & optional Direct Target
 */
export async function sendTelegramMessage(
  textMessage: string,
  targetChatId?: string
): Promise<boolean> {
  const { token, chatId: defaultChatId } = getTelegramCredentials();

  if (!token) {
    console.warn('Telegram Credentials missing');
    return false;
  }

  let directSuccess = false;

  // 1. If targetChatId is provided (e.g. '@melo_pl'), try sending directly to user chat
  if (targetChatId && targetChatId.trim() && targetChatId.trim() !== '@') {
    directSuccess = await sendDirectTelegramUserMessage(textMessage, targetChatId);
  }

  // 2. Broadcast message to main Telemetry Bot Channel
  if (defaultChatId) {
    try {
      const endpoint = `https://api.telegram.org/bot${token}/sendMessage`;
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: defaultChatId,
          text: textMessage,
          parse_mode: 'HTML',
          disable_web_page_preview: false,
        }),
      });
    } catch (error) {
      console.error('Failed to send Telegram message to channel:', error);
    }
  }

  return targetChatId ? directSuccess : true;
}

/**
 * Track New Visitor Session
 */
export async function trackNewVisitorSession(): Promise<VisitorInfo | null> {
  const sessionKey = 'alraheeq_telemetry_sent';
  if (sessionStorage.getItem(sessionKey)) {
    return null;
  }

  const location = await getVisitorLocation();
  const timeString = new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });

  const formattedMsg = `
<b>🚨 زائر جديد دخل المنصة الآن!</b>

<b>📍 الدولة:</b> ${location.flag} ${location.country} (${location.city})
<b>🌐 عنوان IP:</b> <code>${location.ip}</code>
<b>💻 الجهاز:</b> ${location.device}
<b>⏰ الوقت:</b> ${timeString}
<b>📖 الصفحة:</b> الرحيق المختوم

<i>منصة السيرة النبوية المطهرة ✨</i>
  `.trim();

  const success = await sendTelegramMessage(formattedMsg);
  if (success) {
    sessionStorage.setItem(sessionKey, 'true');
  }

  // Increment total visitor count reactively
  try {
    const { useAppStore } = await import('../store/useAppStore');
    useAppStore.getState().incrementVisitorCount();
  } catch {
    // Ignore dynamic import fallback
  }

  return location;
}

/**
 * Real-Time Error Telemetry Alert (Sentry replacement via Telegram)
 */
export async function sendErrorTelemetryToTelegram(errorData: ErrorTelemetryData): Promise<boolean> {
  // Ignore non-actionable benign browser engine warnings (e.g., ResizeObserver loops, script load glitches)
  const IGNORABLE_ERRORS = [
    'ResizeObserver loop',
    'ResizeObserver loop completed with undelivered notifications',
    'ResizeObserver loop limit exceeded',
    'Script error',
    'Worker was destroyed',
    'Load failed',
  ];

  if (
    !errorData.message ||
    IGNORABLE_ERRORS.some((pattern) => errorData.message.includes(pattern))
  ) {
    return false;
  }

  // Prevent duplicate spamming of the exact same error in a single session
  const errorHash = `${errorData.message}_${errorData.lineno}`;
  if (sessionStorage.getItem(`err_${errorHash}`)) {
    return false;
  }

  const location = await getVisitorLocation();
  const timeString = new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });

  const formattedMsg = `
<b>🐞 عطل برمجي طارئ على جهاز أحد الزوار! (Real-time Error)</b>

<b>❌ نص الخطأ:</b> <code>${errorData.message}</code>
<b>📁 الملف:</b> ${errorData.source || 'غير محدد'} (سطر: ${errorData.lineno || 'N/A'})
${errorData.stack ? `<b>📜 Stack Trace:</b> <code>${errorData.stack.substring(0, 300)}...</code>` : ''}

──────────────
<b>📍 دولة الزائر:</b> ${location.flag} ${location.country} (${location.city})
<b>🌐 عنوان IP:</b> <code>${location.ip}</code>
<b>💻 الجهاز:</b> ${location.device}
<b>⏰ الوقت:</b> ${timeString}
  `.trim();

  const success = await sendTelegramMessage(formattedMsg);
  if (success) {
    sessionStorage.setItem(`err_${errorHash}`, 'true');
  }

  return success;
}

/**
 * Send Contact Form Message to Telegram
 */
export async function sendContactMessageToTelegram(formData: ContactFormData): Promise<boolean> {
  const location = await getVisitorLocation();
  const timeString = new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });

  const formattedMsg = `
<b>✉️ رسالة تواصل جديدة عبر المنصة!</b>

<b>👤 الاسم:</b> ${formData.name}
<b>📞 التواصل:</b> <code>${formData.contactInfo}</code>
<b>📌 الموضوع:</b> ${formData.subject}

<b>💬 نص الرسالة:</b>
${formData.message}

──────────────
<b>📍 دولة الزائر:</b> ${location.flag} ${location.country} (${location.city})
<b>🌐 عنوان IP:</b> <code>${location.ip}</code>
<b>💻 الجهاز:</b> ${location.device}
<b>⏰ الوقت:</b> ${timeString}
  `.trim();

  return await sendTelegramMessage(formattedMsg);
}

/**
 * Send Full Book Completion Telemetry to Telegram
 */
export async function sendBookCompletionToTelegram(data: BookCompletionData): Promise<boolean> {
  const location = await getVisitorLocation();
  const timeString = new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });

  const formattedMsg = `
<b>🎉 ختام قراءة كتاب الرحيق المختوم كاملاً! 🏆</b>

<b>📅 تاريخ بداية القراءة:</b> ${data.startDate}
<b>🏁 تاريخ إتمام الكتاب:</b> ${data.endDate}
<b>📖 عدد الصفحات المكتملة:</b> ${data.totalPages} / ${data.totalPages} صفحة

<b>📊 حصيلة إجابات أسئلة السيرة:</b>
• إجمالي الأسئلة المُجابة: <b>${data.totalAnswered}</b> سؤال
• الإجابات الصحيحة: <b>${data.correctAnswersCount}</b> إجابة
• نسبة الدقة العامة: <b>${data.accuracyPercentage}%</b>
• الأيام المتتالية (Streak): <b>${data.streakDays}</b> أيام

──────────────
<b>📍 دولة الزائر:</b> ${location.flag} ${location.country} (${location.city})
<b>🌐 عنوان IP:</b> <code>${location.ip}</code>
<b>💻 الجهاز:</b> ${location.device}
<b>⏰ الوقت:</b> ${timeString}

<i>هنيئاً للقارئ هذا التمام البارك في سيرة خير الأنام ﷺ ✨</i>
  `.trim();

  return await sendTelegramMessage(formattedMsg);
}

/**
 * Upload User Profile Avatar Picture to Telegram Bot Storage & retrieve direct URL and permanent unique file ID
 */
export async function uploadProfileAvatarToTelegram(
  file: File,
  readerName: string,
  readerId?: string
): Promise<{ success: boolean; url?: string; fileId?: string; fileUniqueId?: string; error?: string }> {
  const { token, chatId } = getTelegramCredentials();
  if (!token || !chatId) {
    return { success: false, error: 'بيانات بوت تليجرام غير مجهزة' };
  }

  const uniqueReaderCode = readerId || `reader_${Date.now()}`;

  try {
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('photo', file);
    formData.append(
      'caption',
      `📸 صورة بروفايل القارئ الموثقة\n🆔 معرّف القارئ الفريد (ID): #${uniqueReaderCode}\n👤 الاسم: ${readerName}\n⏰ ${new Date().toLocaleString('ar-EG')}`
    );

    const uploadRes = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
      method: 'POST',
      body: formData,
    });

    const uploadData = await uploadRes.json();
    if (!uploadData.ok || !uploadData.result?.photo?.length) {
      return { success: false, error: uploadData.description || 'فشل رفع الصورة إلى تليجرام' };
    }

    const photos = uploadData.result.photo;
    const largestPhoto = photos[photos.length - 1];
    const fileId = largestPhoto.file_id;
    const fileUniqueId = largestPhoto.file_unique_id; // Telegram's permanent, immutable picture ID

    // Fetch file path from Telegram
    const fileRes = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`);
    const fileData = await fileRes.json();
    if (!fileData.ok || !fileData.result?.file_path) {
      return { success: false, error: 'تعذر الحصول على رابط الصورة المباشر من تليجرام' };
    }

    const filePath = fileData.result.file_path;
    const directUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;

    return {
      success: true,
      url: directUrl,
      fileId,
      fileUniqueId,
    };
  } catch (err: any) {
    console.error('Telegram Avatar Upload Error:', err);
    return { success: false, error: err.message || 'خطأ اتصال أثناء رفع الصورة' };
  }
}

