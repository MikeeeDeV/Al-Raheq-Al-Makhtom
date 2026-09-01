import { jwtDecode } from 'jwt-decode';
import { UserProfile } from '../types';
import { saveStoredUserProfile } from './authService';

export interface GoogleJwtPayload {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email?: string;
  email_verified?: boolean;
}

// Default fallback Google Web OAuth Client ID
const DEFAULT_GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '912401859367-demo.apps.googleusercontent.com';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (notification?: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          revoke: (hint: string, callback: () => void) => void;
        };
      };
    };
  }
}

let isGsiScriptLoaded = false;

/**
 * Dynamically loads official Google Identity Services SDK script
 */
export function loadGoogleIdentityScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.google?.accounts?.id) {
      resolve(true);
      return;
    }

    if (isGsiScriptLoaded) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      isGsiScriptLoaded = true;
      resolve(true);
    };
    script.onerror = () => {
      console.warn('Failed to load Google Identity Services SDK script');
      resolve(false);
    };
    document.head.appendChild(script);
  });
}

/**
 * Parse Google ID Token (JWT) into UserProfile
 */
export function parseGoogleCredential(credentialToken: string): UserProfile {
  try {
    const payload = jwtDecode<GoogleJwtPayload>(credentialToken);
    const fullName = payload.name || payload.given_name || 'قارئ Google';
    const cleanName = `القارئ ${fullName.replace(/^القارئ\s+/, '')}`;

    const profile: Partial<UserProfile> = {
      id: `google_${payload.sub}`,
      name: cleanName,
      email: payload.email || '',
      avatarUrl: payload.picture || '',
      isLoggedIn: true,
      provider: 'google',
    };

    return saveStoredUserProfile(profile);
  } catch (err) {
    console.error('Failed to parse Google credential token:', err);
    throw err;
  }
}

/**
 * Render Official Google Sign-In Button on an HTML element
 */
export async function renderOfficialGoogleButton(
  containerEl: HTMLElement,
  onSuccess: (profile: UserProfile) => void,
  onError?: (err: any) => void
): Promise<void> {
  const loaded = await loadGoogleIdentityScript();
  if (!loaded || !window.google?.accounts?.id) {
    if (onError) onError('تعذر تحميل خدمة Google Identity');
    return;
  }

  const clientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim() || DEFAULT_GOOGLE_CLIENT_ID;

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (response: { credential: string }) => {
      if (response.credential) {
        try {
          const profile = parseGoogleCredential(response.credential);
          onSuccess(profile);
        } catch (err) {
          if (onError) onError('خطأ أثناء معالجة بيانات Google');
        }
      }
    },
    auto_select: false,
    cancel_on_tap_outside: true,
  });

  window.google.accounts.id.renderButton(containerEl, {
    theme: 'outline',
    size: 'large',
    shape: 'pill',
    text: 'signin_with',
    locale: 'ar',
    width: 280,
  });
}
