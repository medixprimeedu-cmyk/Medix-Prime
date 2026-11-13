import { CardThemeId, JourneyCardData, SavedCardHistoryItem } from '../types/cardTypes';

const STORAGE_KEY = 'medix_hsc26_card_history_v1';
const MAX_HISTORY_ITEMS = 5;

/**
 * Safely loads up to 5 previously generated cards from localStorage
 */
export function loadCardHistory(): SavedCardHistoryItem[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Filter and sanitize valid items
    const validItems: SavedCardHistoryItem[] = parsed
      .filter((item): item is SavedCardHistoryItem => {
        return (
          item &&
          typeof item === 'object' &&
          typeof item.id === 'string' &&
          typeof item.createdAt === 'number' &&
          typeof item.themeId === 'string' &&
          item.cardData &&
          typeof item.cardData === 'object'
        );
      })
      .slice(0, MAX_HISTORY_ITEMS);

    return validItems;
  } catch (error) {
    console.warn('Failed to load card history from localStorage:', error);
    return [];
  }
}

/**
 * Saves a card into localStorage history (max 5 items, FIFO removal of oldest).
 * Deduplicates exact repeats by moving them to the top and updating the timestamp.
 * Includes quota-exceeded fallback to prevent crashes if a large photo is stored.
 */
export function saveCardToHistory(
  cardData: JourneyCardData,
  themeId: CardThemeId
): SavedCardHistoryItem[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }

  try {
    const currentHistory = loadCardHistory();

    // Check if an identical card already exists in history
    const existingIndex = currentHistory.findIndex((item) => {
      return (
        item.themeId === themeId &&
        item.cardData.name === cardData.name &&
        item.cardData.badgeLine1 === cardData.badgeLine1 &&
        item.cardData.badgeLine2 === cardData.badgeLine2 &&
        item.cardData.studyHabit === cardData.studyHabit &&
        item.cardData.biggestHassle === cardData.biggestHassle &&
        item.cardData.biggestSupport === cardData.biggestSupport &&
        item.cardData.favoriteDialogue === cardData.favoriteDialogue &&
        item.cardData.achievement === cardData.achievement &&
        item.cardData.photoUrl === cardData.photoUrl
      );
    });

    const newItem: SavedCardHistoryItem = {
      id:
        existingIndex >= 0
          ? currentHistory[existingIndex].id
          : `card_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now(),
      cardData: { ...cardData },
      themeId,
    };

    let updatedList: SavedCardHistoryItem[];

    if (existingIndex >= 0) {
      // Remove previous duplicate and push to front
      const copy = [...currentHistory];
      copy.splice(existingIndex, 1);
      updatedList = [newItem, ...copy];
    } else {
      updatedList = [newItem, ...currentHistory];
    }

    // Keep at most 5 items
    updatedList = updatedList.slice(0, MAX_HISTORY_ITEMS);

    // Save with storage quota protection
    persistWithQuotaFallback(updatedList);

    return updatedList;
  } catch (err) {
    console.error('Error saving card to history:', err);
    return loadCardHistory();
  }
}

/**
 * Deletes a specific card from history by ID
 */
export function deleteCardFromHistory(id: string): SavedCardHistoryItem[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }

  try {
    const current = loadCardHistory();
    const filtered = current.filter((item) => item.id !== id);
    persistWithQuotaFallback(filtered);
    return filtered;
  } catch (err) {
    console.error('Error deleting card from history:', err);
    return [];
  }
}

/**
 * Clears all saved cards from history
 */
export function clearCardHistory(): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing card history:', err);
  }
}

/**
 * Writes to localStorage with QuotaExceeded fallback protection
 */
function persistWithQuotaFallback(items: SavedCardHistoryItem[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (quotaError) {
    console.warn('localStorage write failed, stripping photoUrls to reduce payload:', quotaError);
    try {
      // Strip photoUrl from items to drastically reduce string size (~100x reduction)
      const lightItems = items.map((item) => ({
        ...item,
        cardData: {
          ...item.cardData,
          photoUrl: undefined,
        },
      }));
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lightItems));
    } catch (secondError) {
      console.warn('Second localStorage attempt failed, storing only last 2 cards:', secondError);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 2)));
      } catch {
        // Can't write to localStorage (private browsing or completely full), fail silently
      }
    }
  }
}

/**
 * Formats a timestamp into a friendly Bengali relative or date/time label
 */
export function formatBengaliDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 1) {
    return 'এইমাত্র';
  }
  if (diffMins < 60) {
    return `${toBengaliNumber(diffMins)} মিনিট আগে`;
  }
  if (diffHours < 24 && now.getDate() === date.getDate()) {
    const hours = date.getHours();
    const mins = date.getMinutes();
    const period = hours >= 12 ? 'দুপুর/রাত' : 'সকাল';
    const hour12 = hours % 12 || 12;
    return `আজ ${period} ${toBengaliNumber(hour12)}:${toBengaliNumber(mins.toString().padStart(2, '0'))}`;
  }

  const day = date.getDate();
  const monthsBn = [
    'জানুয়ারি',
    'ফেব্রুয়ারি',
    'মার্চ',
    'এপ্রিল',
    'মে',
    'জুন',
    'জুলাই',
    'আগস্ট',
    'সেপ্টেম্বর',
    'অক্টোবর',
    'নভেম্বর',
    'ডিসেম্বর',
  ];
  return `${toBengaliNumber(day)} ${monthsBn[date.getMonth()]}, ${toBengaliNumber(date.getFullYear())}`;
}

function toBengaliNumber(n: number | string): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return n
    .toString()
    .replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)] || digit);
}
