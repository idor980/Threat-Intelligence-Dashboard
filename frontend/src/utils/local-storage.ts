import type { HistoryItem } from '@/types';

const HISTORY_KEY = 'threat-intel-history';
const MAX_HISTORY_ITEMS = 10;

/**
 * Loads search history from localStorage
 * @returns Array of history items, or empty array if none exist or parsing fails
 */
export function loadHistory(): HistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as HistoryItem[];
  } catch (error) {
    console.error('Failed to load history from localStorage:', error);
    return [];
  }
}

export function saveHistory(history: HistoryItem[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save history to localStorage:', error);
  }
}

export function addToHistory(item: HistoryItem): HistoryItem[] {
  const history = loadHistory();

  // Remove duplicate if exists (same IP)
  const filtered = history.filter((h) => h.ipAddress !== item.ipAddress);

  // Add new item at the beginning
  const updated = [item, ...filtered];

  // Keep only the last MAX_HISTORY_ITEMS
  const trimmed = updated.slice(0, MAX_HISTORY_ITEMS);

  saveHistory(trimmed);
  return trimmed;
}

/**
 * Clears all search history from localStorage
 */
export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear history from localStorage:', error);
  }
}
