/**
 * Utility functions for Bengali text and numeral processing
 */

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const ENGLISH_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const BN_TO_EN_MAP: Record<string, string> = {
  '০': '0',
  '১': '1',
  '২': '2',
  '৩': '3',
  '৪': '4',
  '৫': '5',
  '৬': '6',
  '৭': '7',
  '৮': '8',
  '৯': '9',
};

const EN_TO_BN_MAP: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

/**
 * Normalizes Bengali digits to English ASCII digits (0-9)
 * Preserves leading zeroes and trims whitespace.
 */
export function normalizeBengaliDigits(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .split('')
    .map((char) => BN_TO_EN_MAP[char] || char)
    .join('');
}

/**
 * Converts English ASCII digits to Bengali digits for localized rendering.
 */
export function toBengaliDigits(input: string | number): string {
  if (input === null || input === undefined) return '';
  const str = input.toString();
  return str
    .split('')
    .map((char) => EN_TO_BN_MAP[char] || char)
    .join('');
}

/**
 * Validates roll number string
 */
export function validateRoll(roll: string): { isValid: boolean; errorBn?: string } {
  const normalized = normalizeBengaliDigits(roll);
  if (!normalized) {
    return { isValid: false, errorBn: 'রোল নম্বর প্রদান করা আবশ্যক।' };
  }
  if (!/^\d+$/.test(normalized)) {
    return { isValid: false, errorBn: 'রোল নম্বরে শুধুমাত্র সংখ্যা ব্যবহার করো।' };
  }
  if (normalized.length < 5 || normalized.length > 8) {
    return { isValid: false, errorBn: 'সাধারণত রোল নম্বর ৬ অঙ্কের হয়ে থাকে।' };
  }
  return { isValid: true };
}

/**
 * Validates registration number string
 */
export function validateRegistration(reg: string): { isValid: boolean; errorBn?: string } {
  const normalized = normalizeBengaliDigits(reg);
  if (!normalized) {
    return { isValid: false, errorBn: 'রেজিস্ট্রেশন নম্বর প্রদান করা আবশ্যক।' };
  }
  if (!/^\d+$/.test(normalized)) {
    return { isValid: false, errorBn: 'রেজিস্ট্রেশন নম্বরে শুধুমাত্র সংখ্যা ব্যবহার করো।' };
  }
  if (normalized.length < 8 || normalized.length > 12) {
    return { isValid: false, errorBn: 'সাধারণত রেজিস্ট্রেশন নম্বর ১০ অঙ্কের হয়ে থাকে।' };
  }
  return { isValid: true };
}

/**
 * Safe clipboard copy with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fallback
    }
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}
