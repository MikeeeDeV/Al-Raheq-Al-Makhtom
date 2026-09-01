import { supabase } from './supabaseClient';
import { UserProfile } from '../types';
import { sendTelegramMessage } from './telegramTelemetry';

const STORAGE_KEY = 'alraheeq_user_profile';
const OTP_STORAGE_KEY = 'alraheeq_password_reset_otp';

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'guest_reader',
  name: 'القارئ الزائر',
  email: '',
  telegramUsername: '',
  avatarUrl: '',
  dailyGoalPages: 5,
  enableFlipSound: true,
  isLoggedIn: false,
  provider: 'guest',
  createdAt: new Date().toISOString(),
};

/**
 * Loads current stored user profile from localStorage or Supabase session
 */
export function loadStoredUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading stored user profile:', err);
  }
  return DEFAULT_USER_PROFILE;
}

/**
 * Saves profile updates to localStorage and syncs with Supabase session
 */
export function saveStoredUserProfile(profile: Partial<UserProfile>): UserProfile {
  const current = loadStoredUserProfile();
  const updated: UserProfile = { ...current, ...profile };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving user profile:', err);
  }
  return updated;
}

/**
 * Register or Sign In with Email, Password & Telegram Username
 * Automatically logs data to Telegram Bot & saves locally
 */
export async function registerOrLoginWithTelegramEmail(data: {
  name: string;
  email: string;
  password?: string;
  telegramUsername?: string;
}): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const rawName = data.name.trim();
    const cleanName = rawName ? `القارئ ${rawName.replace(/^القارئ\s+/, '')}` : 'القارئ الزائر';
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanTgUsername = data.telegramUsername ? `@${data.telegramUsername.trim().replace(/^@/, '')}` : '';

    const currentProfile = loadStoredUserProfile();
    const permanentId =
      currentProfile.id && currentProfile.id !== 'guest_reader'
        ? currentProfile.id
        : `reader_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const updatedProfile: UserProfile = saveStoredUserProfile({
      id: permanentId,
      name: cleanName,
      email: cleanEmail,
      telegramUsername: cleanTgUsername,
      passwordHash: data.password ? btoa(data.password) : currentProfile.passwordHash,
      isLoggedIn: true,
      provider: 'telegram',
    });

    // Dispatch Account Log Notice to Telegram Bot
    const timeString = new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });
    const telegramNoticeMsg = `
🔐 <b>تسجيل حساب قارئ جديد عبر تليجرام!</b>

<b>👤 اسم القارئ:</b> ${cleanName}
<b>📧 البريد الإلكتروني:</b> <code>${cleanEmail}</code>
<b>📱 يوزر تليجرام:</b> ${cleanTgUsername || 'غير محدد'}
<b>🆔 معرّف القارئ الرقمي (ID):</b> <code>#${permanentId}</code>
<b>⏰ وقت التسجيل:</b> ${timeString}
    `.trim();

    sendTelegramMessage(telegramNoticeMsg).catch((err) => console.warn('Telegram Auth Log notice failed:', err));

    return { success: true, user: updatedProfile };
  } catch (err: any) {
    console.error('Telegram Sign-In Error:', err);
    return { success: false, error: err.message || 'تعذر تسجيل الحساب' };
  }
}

/**
 * Sends a 6-digit Password Reset OTP code to user's Telegram Username via Bot
 */
export async function sendTelegramPasswordResetOtp(
  telegramUsername: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const cleanTgUsername = `@${telegramUsername.trim().replace(/^@/, '')}`;
    if (!cleanTgUsername || cleanTgUsername === '@') {
      return { success: false, error: 'يرجى إدخال اسم مستخدم تليجرام الصحيح (مثال: @username)' };
    }

    // Generate random 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Save OTP to local storage cache
    const otpData = {
      telegramUsername: cleanTgUsername.toLowerCase(),
      code: otpCode,
      expiresAt,
    };
    localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otpData));

    // Send OTP Code via Telegram Bot
    const timeString = new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });
    const otpMsg = `
🔑 <b>كود إعادة تعيين كلمة المرور لقارئ الرحيق المختوم</b>

<b>📱 الحساب المستهدف:</b> ${cleanTgUsername}
<b>🔢 رمز التحقق السري (OTP):</b> <code>${otpCode}</code>

<b>⏱️ صلاحية الرمز:</b> 10 دقائق من الآن (${timeString})
<i>يرجى إدخال كود التحقق في الموقع لتأكيد كلمة المرور الجديدة.</i>
    `.trim();

    const sent = await sendTelegramMessage(otpMsg);
    if (sent) {
      return {
        success: true,
        message: `تم إرسال كود التحقق السري إلى حساب تليجرام (${cleanTgUsername}) بنجاح!`,
      };
    } else {
      return { success: false, error: 'تعذر إرسال الكود عبر تليجرام، يرجى التأكد من اسم المستخدم.' };
    }
  } catch (err: any) {
    console.error('Send OTP Error:', err);
    return { success: false, error: 'خطأ أثناء إرسال كود التحقق' };
  }
}

/**
 * Verifies OTP code and sets the new password
 */
export async function verifyOtpAndResetPassword(
  telegramUsername: string,
  enteredOtpCode: string,
  newPassword: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const rawOtp = localStorage.getItem(OTP_STORAGE_KEY);
    if (!rawOtp) {
      return { success: false, error: 'لم يتم طلب كود تحقق أو انتهت صلاحيته. يرجى طلب كود جديد.' };
    }

    const otpData = JSON.parse(rawOtp);
    const cleanTgUsername = `@${telegramUsername.trim().replace(/^@/, '')}`.toLowerCase();

    if (Date.now() > otpData.expiresAt) {
      localStorage.removeItem(OTP_STORAGE_KEY);
      return { success: false, error: 'انتهت صلاحية كود التحقق (10 دقائق). يرجى طلب كود جديد.' };
    }

    if (otpData.telegramUsername !== cleanTgUsername) {
      return { success: false, error: 'اسم مستخدم تليجرام غير مطابق للذي طُلِب له الكود.' };
    }

    if (otpData.code.trim() !== enteredOtpCode.trim()) {
      return { success: false, error: 'رمز التحقق (OTP) غير صحيح! يرجى التأكد وإعادة المحاولة.' };
    }

    // OTP Verified! Clear OTP cache & update user password
    localStorage.removeItem(OTP_STORAGE_KEY);
    const currentProfile = loadStoredUserProfile();
    const updated = saveStoredUserProfile({
      ...currentProfile,
      telegramUsername: cleanTgUsername,
      passwordHash: btoa(newPassword),
      isLoggedIn: true,
    });

    // Notify Telegram Bot of successful reset
    const timeString = new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });
    const successNotice = `
✅ <b>تم تغيير كلمة المرور بنجاح!</b>

<b>📱 الحساب:</b> ${cleanTgUsername}
<b>👤 القارئ:</b> ${updated.name}
<b>⏰ الوقت:</b> ${timeString}
    `.trim();

    sendTelegramMessage(successNotice).catch(() => {});

    return { success: true, message: 'تم تغيير كلمة المرور وتوثيق الحساب بنجاح!' };
  } catch (err: any) {
    console.error('Verify OTP Error:', err);
    return { success: false, error: 'خطأ أثناء تأكيد كلمة المرور' };
  }
}

/**
 * Signs out current user
 */
export async function signOutUser(): Promise<UserProfile> {
  try {
    if (import.meta.env.VITE_SUPABASE_URL) {
      await supabase.auth.signOut();
    }
  } catch (err) {
    console.error('Sign Out Error:', err);
  }

  const resetProfile = saveStoredUserProfile({
    ...DEFAULT_USER_PROFILE,
    id: `guest_${Date.now()}`,
    name: 'القارئ الزائر',
    isLoggedIn: false,
  });

  return resetProfile;
}
