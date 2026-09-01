/**
 * Vercel Serverless Telegram Webhook Handler
 * Endpoint: /api/telegram-webhook
 */

const BOT_TOKEN = process.env.VITE_TELEGRAM_BOT_TOKEN || '8616682746:AAHRFQM-llzhrCK-XbzYDVYGIVbuzlkwLSY';
const SITE_URL = 'https://al-raheq-al-makhtom.vercel.app/';

async function telegramApi(method, body = {}) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/${method}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return await response.json();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send('Telegram Webhook Active!');
  }

  const update = req.body;

  if (update && update.message && update.message.text) {
    const message = update.message;
    const chatId = message.chat.id;
    const text = message.text.trim();
    const from = message.from;
    const userName = `${from.first_name || ''} ${from.last_name || ''}`.trim() || 'القارئ';
    const tgUsername = from.username ? `@${from.username}` : '';

    if (text.startsWith('/start') || text.startsWith('/login') || text.startsWith('/otp')) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      const msg = `
أهلاً بك يا <b>${userName}</b> (${tgUsername}) في منصة <b>الرحيق المختوم</b> 🌿✨

🔑 <b>رمز التحقق السري الخاص بك (OTP):</b>
<code>${otpCode}</code>

ادخل هذا الكود في الموقع فوراً لتأكيد حسابك أو إعادة تعيين كلمة المرور.
      `.trim();

      await telegramApi('sendMessage', {
        chat_id: chatId,
        text: msg,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{ text: '📖 فتح منصة الرحيق المختوم', url: SITE_URL }]
          ]
        }
      });
    }
  }

  return res.status(200).json({ ok: true });
}
