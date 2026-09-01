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

  // Primary fast geolocation endpoint (ipwho.is)
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

  // Secondary fallback endpoint (ipapi.co)
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
  const { token, chatId } = getTelegramCredentials();

  if (!token || !chatId) {
    console.warn('Telegram Credentials missing in .env (VITE_TELEGRAM_BOT_TOKEN / VITE_TELEGRAM_CHAT_ID)');
    return false;
  }

  const endpoint = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: textMessage,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const resJson = await response.json();
    if (!response.ok || !resJson.ok) {
      console.error('Telegram API Error:', resJson);
      return false;
    }

    return true;
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
