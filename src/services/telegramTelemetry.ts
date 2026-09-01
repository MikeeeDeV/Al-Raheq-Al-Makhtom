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

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID || '';

/**
 * Safely fetches IP geolocation info without blocking app load.
 */
export async function getVisitorLocation(): Promise<VisitorInfo> {
  const ua = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const device = isMobile ? '📱 موبايل (Mobile)' : '💻 كومبيوتر (Desktop)';

  try {
    const response = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) });
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
    console.log('Location fetch fallback:', error);
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

/**
 * Converts 2-letter Country Code to Flag Emoji
 */
function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

/**
 * Sends HTML formatted message to Telegram Bot
 */
export async function sendTelegramMessage(textMessage: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('Telegram Credentials missing in .env (VITE_TELEGRAM_BOT_TOKEN / VITE_TELEGRAM_CHAT_ID)');
    return false;
  }

  const endpoint = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: textMessage,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    return false;
  }
}

/**
 * Track New Visitor Session
 */
export async function trackNewVisitorSession(): Promise<VisitorInfo | null> {
  const sessionKey = 'alraheeq_telemetry_sent';
  if (sessionStorage.getItem(sessionKey)) {
    return null; // Already logged for this session
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

  return location;
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
