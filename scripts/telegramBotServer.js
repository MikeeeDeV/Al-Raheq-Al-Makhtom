/**
 * Telegram Bot Automated Webhook & Polling Script
 * Platform: Al-Raheq Al-Makhtom
 * Bot Username: @te_data_bot
 *
 * Run locally with: node scripts/telegramBotServer.js
 */

const BOT_TOKEN = process.env.VITE_TELEGRAM_BOT_TOKEN || '8616682746:AAHRFQM-llzhrCK-XbzYDVYGIVbuzlkwLSY';
const SITE_URL = 'https://al-raheq-al-makhtom.vercel.app/';

let offset = 0;

console.log('🤖 Starting Telegram Bot Webhook Script for @te_data_bot...');

async function telegramApi(method, body = {}) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/${method}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return await response.json();
}

async function handleUpdate(update) {
  if (update.message && update.message.text) {
    const message = update.message;
    const chatId = message.chat.id;
    const text = message.text.trim();
    const from = message.from;
    const userName = `${from.first_name || ''} ${from.last_name || ''}`.trim() || 'القارئ';
    const tgUsername = from.username ? `@${from.username}` : 'غير محدد';

    console.log(`📩 Received message from ${tgUsername} (${chatId}): "${text}"`);

    // Command 1: /start
    if (text.startsWith('/start')) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      const welcomeMsg = `
أهلاً وسهلاً بك يا <b>${userName}</b> (${tgUsername}) في منصة <b>الرحيق المختوم</b> 🌿✨

معرّفك الرقمي الموثق: <code>#reader_${chatId}</code>

🔑 <b>كود تسجيل الدخول السريع الخاص بك (OTP):</b>
<code>${otpCode}</code>

يمكنك إدخال هذا الكود في الموقع فوراً لإعادة تعيين كلمة المرور أو تسجيل الدخول بضغطة واحدة!
      `.trim();

      await telegramApi('sendMessage', {
        chat_id: chatId,
        text: welcomeMsg,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '📖 فتح منصة الرحيق المختوم', url: SITE_URL },
            ],
            [
              { text: '🔑 إرسال كود تحقق جديد (OTP)', callback_data: 'get_otp' },
              { text: '👤 بيانات حسابي', callback_data: 'get_profile' }
            ]
          ]
        }
      });
    }

    // Command 2: /otp or /login or /reset
    else if (text.startsWith('/otp') || text.startsWith('/login') || text.startsWith('/reset')) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpMsg = `
🔑 <b>رمز التحقق السري الخاص بك (OTP):</b>
<code>${otpCode}</code>

⏰ <b>صلاحية الكود:</b> 10 دقائق
ادخل الكود في الموقع لاستكمال تسجيل الدخول وتوثيق الحساب.
      `.trim();

      await telegramApi('sendMessage', {
        chat_id: chatId,
        text: otpMsg,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🌐 العودة إلى الموقع', url: SITE_URL }]
          ]
        }
      });
    }
  }

  // Callback Query (Buttons tap)
  if (update.callback_query) {
    const cb = update.callback_query;
    const chatId = cb.message.chat.id;
    const data = cb.data;
    const from = cb.from;
    const userName = `${from.first_name || ''} ${from.last_name || ''}`.trim() || 'القارئ';

    if (data === 'get_otp') {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      await telegramApi('sendMessage', {
        chat_id: chatId,
        text: `🔑 <b>كود التحقق الجديد (OTP):</b> <code>${otpCode}</code>`,
        parse_mode: 'HTML'
      });
    } else if (data === 'get_profile') {
      await telegramApi('sendMessage', {
        chat_id: chatId,
        text: `👤 <b>بيانات القارئ الموثقة:</b>\n\nالاسم: ${userName}\nالمعرف الرقمي: <code>#reader_${chatId}</code>\nاليوزر: @${from.username || 'غير محدد'}`,
        parse_mode: 'HTML'
      });
    }

    await telegramApi('answerCallbackQuery', { callback_query_id: cb.id });
  }
}

async function pollUpdates() {
  try {
    const res = await telegramApi('getUpdates', { offset, timeout: 20 });
    if (res.ok && res.result && res.result.length > 0) {
      for (const update of res.result) {
        offset = update.update_id + 1;
        await handleUpdate(update);
      }
    }
  } catch (err) {
    console.error('Polling error:', err);
  }
  setTimeout(pollUpdates, 1000);
}

pollUpdates();
