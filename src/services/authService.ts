import { supabase } from './supabaseClient';
import { UserProfile } from '../types';
import { sendTelegramMessage, getVisitorLocation } from './telegramTelemetry';

const STORAGE_KEY = 'alraheeq_user_profile';
const ACCOUNTS_DB_KEY = 'alraheeq_registered_accounts_v2';
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
 * Gets all locally registered accounts map from localStorage
 */
function getRegisteredAccountsMap(): Record<string, UserProfile> {
  try {
    const raw = localStorage.getItem(ACCOUNTS_DB_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading accounts database:', err);
  }
  return {};
}

/**
 * Saves or updates a registered account in the local Accounts database
 */
function saveAccountToDb(account: UserProfile): void {
  if (!account.email) return;
  try {
    const map = getRegisteredAccountsMap();
    map[account.email.toLowerCase()] = account;
    localStorage.setItem(ACCOUNTS_DB_KEY, JSON.stringify(map));
  } catch (err) {
    console.error('Error saving account to database:', err);
  }
}

/**
 * Finds a registered account by email
 */
export function findAccountByEmail(email: string): UserProfile | null {
  if (!email) return null;
  const map = getRegisteredAccountsMap();
  return map[email.trim().toLowerCase()] || null;
}

/**
 * Loads current active stored user profile from localStorage
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
 * Saves profile updates to active session AND syncs with Accounts Database
 */
export function saveStoredUserProfile(profile: Partial<UserProfile>): UserProfile {
  const current = loadStoredUserProfile();
  const updated: UserProfile = { ...current, ...profile };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (updated.email && updated.isLoggedIn) {
      saveAccountToDb(updated);
    }
  } catch (err) {
    console.error('Error saving user profile:', err);
  }
  return updated;
}

/**
 * Explicit Sign Up Function (إنشاء حساب جديد)
 * Checks for existing email, creates new permanent account, and saves avatar/profile state
 */
export async function signUpUser(data: {
  name: string;
  email: string;
  password?: string;
  telegramUsername?: string;
}): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const cleanEmail = data.email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'يرجى كتابة البريد الإلكتروني' };
    }

    const existing = findAccountByEmail(cleanEmail);
    if (existing) {
      return {
        success: false,
        error: 'هذا البريد الإلكتروني مسجّل بالفعل! يرجى اختيار تسجيل الدخول (Sign In).',
      };
    }

    const rawName = data.name.trim();
    if (!rawName) {
      return { success: false, error: 'يرجى إدخال اسمك الرسمي' };
    }

    const cleanName = `القارئ ${rawName.replace(/^القارئ\s+/, '')}`;
    const cleanTgUsername = data.telegramUsername ? `@${data.telegramUsername.trim().replace(/^@/, '')}` : '';
    const permanentId = `reader_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newProfile: UserProfile = {
      id: permanentId,
      name: cleanName,
      email: cleanEmail,
      telegramUsername: cleanTgUsername,
      passwordHash: data.password ? btoa(data.password) : '',
      avatarUrl: '',
      dailyGoalPages: 5,
      enableFlipSound: true,
      isLoggedIn: true,
      provider: 'email',
      createdAt: new Date().toISOString(),
    };

    saveAccountToDb(newProfile);
    saveStoredUserProfile(newProfile);

    // Telegram Bot Notification with Direct Target Chat & Site Link
    const timeString = new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });
    const telegramNoticeMsg = `
🎉 <b>أهلاً وسهلاً بك في منصة الرحيق المختوم!</b>

<b>👤 اسم القارئ:</b> ${cleanName}
<b>📧 البريد الإلكتروني:</b> <code>${cleanEmail}</code>
<b>📱 حساب تليجرام:</b> ${cleanTgUsername || 'غير محدد'}
<b>🆔 المعرّف الرقمي (ID):</b> <code>#${permanentId}</code>
<b>⏰ وقت التسجيل:</b> ${timeString}

🌐 <b>رابط المنصة الرسمي:</b>
https://al-raheq-al-makhtom.vercel.app/

<i>يسعدنا انضمامك لقراءة وتدارس سيرة النبي ﷺ الموثقة ✨</i>
    `.trim();

    sendTelegramMessage(telegramNoticeMsg, cleanTgUsername).catch(() => { });

    return { success: true, user: newProfile };
  } catch (err: any) {
    console.error('Sign Up Error:', err);
    return { success: false, error: err.message || 'فشل إنشاء الحساب' };
  }
}

/**
 * Explicit Sign In Function (تسجيل الدخول لحساب موجود)
 * Restores exact name, Telegram avatar picture URL, and previous settings
 */
export async function signInUser(data: {
  email: string;
  password?: string;
}): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const cleanEmail = data.email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'يرجى كتابة البريد الإلكتروني' };
    }

    const existingAccount = findAccountByEmail(cleanEmail);
    if (!existingAccount) {
      return {
        success: false,
        error: 'لم يتم العثور على حساب بهذا البريد الإلكتروني! يرجى إنشاء حساب جديد (Sign Up).',
      };
    }

    // Verify Password if existing account has a password set
    if (existingAccount.passwordHash && data.password) {
      const inputHash = btoa(data.password);
      if (inputHash !== existingAccount.passwordHash) {
        return { success: false, error: 'كلمة المرور غير صحيحة! يرجى الإعادة أو استعادة الكود.' };
      }
    }

    // Restore exact stored account profile (Name, Telegram Avatar, Telegram Username, ID)
    const activeProfile: UserProfile = {
      ...existingAccount,
      isLoggedIn: true,
    };

    saveStoredUserProfile(activeProfile);

    // Dispatch rich Login notification via Telegram to target username & channel
    try {
      const location = await getVisitorLocation();
      const timeString = new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });
      const telegramNoticeMsg = `
🔔 <b>تم تسجيل الدخول بنجاح إلى منصة الرحيق المختوم!</b>

<b>👤 القارئ الكريم:</b> ${activeProfile.name}
<b>📧 البريد الإلكتروني:</b> <code>${cleanEmail}</code>
<b>📱 حساب تليجرام:</b> ${activeProfile.telegramUsername || 'غير محدد'}
<b>🆔 المعرّف الرقمي (ID):</b> <code>#${activeProfile.id}</code>

──────────────
<b>📍 الموقع الجغرافي:</b> ${location.flag} ${location.country} (${location.city})
<b>🌐 عنوان IP:</b> <code>${location.ip}</code>
<b>💻 نوع الجهاز:</b> ${location.device}
<b>⏰ توقيت الجلسة:</b> ${timeString}

🌐 <b>رابط المنصة:</b>
https://al-raheq-al-makhtom.vercel.app/

<i>مرحباً بك مجدداً في رحاب السيرة النبوية الموثقة ✨</i>
      `.trim();

      sendTelegramMessage(telegramNoticeMsg, activeProfile.telegramUsername).catch(() => { });
    } catch (e) {
      console.warn('Telegram login notice warning:', e);
    }

    return { success: true, user: activeProfile };
  } catch (err: any) {
    console.error('Sign In Error:', err);
    return { success: false, error: err.message || 'فشل تسجيل الدخول' };
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

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    const otpData = {
      telegramUsername: cleanTgUsername.toLowerCase(),
      code: otpCode,
      expiresAt,
    };
    localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otpData));

    const timeString = new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });
    const otpMsg = `
🔑 <b>كود إعادة تعيين كلمة المرور لقارئ الرحيق المختوم</b>

<b>📱 الحساب المستهدف:</b> ${cleanTgUsername}
<b>🔢 رمز التحقق السري (OTP):</b> <code>${otpCode}</code>

<b>⏱️ صلاحية الرمز:</b> 10 دقائق من الآن (${timeString})
🌐 <b>رابط المنصة:</b> https://al-raheq-al-makhtom.vercel.app/

<i>يرجى إدخال كود التحقق في الموقع لتأكيد كلمة المرور الجديدة.</i>
    `.trim();

    // Send directly to the target Telegram username AND channel
    const sent = await sendTelegramMessage(otpMsg, cleanTgUsername);
    if (sent) {
      return {
        success: true,
        message: `تم إرسال كود التحقق السري إلى حساب تليجرام (${cleanTgUsername}) بنجاح!`,
      };
    } else {
      return { success: false, error: 'تعذر إرسال الكود عبر تليجرام، يرجى التأكد من تفعيلك للبوت @te_data_bot' };
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

    localStorage.removeItem(OTP_STORAGE_KEY);
    const currentProfile = loadStoredUserProfile();
    const updated = saveStoredUserProfile({
      ...currentProfile,
      telegramUsername: cleanTgUsername,
      passwordHash: btoa(newPassword),
      isLoggedIn: true,
    });

    const timeString = new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });
    const successNotice = `
✅ <b>تم تغيير كلمة المرور بنجاح!</b>

<b>📱 الحساب:</b> ${cleanTgUsername}
<b>👤 القارئ:</b> ${updated.name}
<b>⏰ الوقت:</b> ${timeString}
    `.trim();

    sendTelegramMessage(successNotice).catch(() => { });

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
