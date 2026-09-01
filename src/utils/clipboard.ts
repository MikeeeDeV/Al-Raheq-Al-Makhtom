/**
 * Safe clipboard copy function that works across HTTP, HTTPS, mobile browsers, and restricted webviews.
 * Never throws "Cannot read properties of undefined (reading 'writeText')".
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (typeof window === 'undefined') return false;

  // Method 1: Modern navigator.clipboard API (supported in HTTPS or localhost)
  if (
    navigator &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === 'function'
  ) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback to legacy method below
    }
  }

  // Method 2: Synchronous Document.execCommand('copy') fallback (works on HTTP & local IP)
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.opacity = '0';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (successful) return true;
  } catch {
    // Fallback failed
  }

  // Method 3: Final prompt fallback if all programmatic copies fail
  try {
    prompt('يرجى نسخ النص التالي:', text);
    return true;
  } catch {
    return false;
  }
};
