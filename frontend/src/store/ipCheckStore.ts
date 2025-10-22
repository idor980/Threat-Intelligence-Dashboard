import { create } from 'zustand';
import { checkIPAddress } from '@/services/api';
import type { IPCheckState, HistoryItem } from '@/types';
import { loadHistory, addToHistory, clearHistory as clearLocalHistory } from '@/utils/localStorage';

export const useIPCheckStore = create<IPCheckState>((set) => ({
  data: null,
  loading: false,
  error: null,
  history: loadHistory(),

  checkIP: async (ip: string, maxAgeInDays: number = 90) => {
    set({ loading: true, error: null, data: null });
    try {
      const data = await checkIPAddress(ip, maxAgeInDays);

      // Create history item
      const historyItem: HistoryItem = {
        ipAddress: ip,
        timestamp: Date.now(),
        data,
      };

      // Add to history and update state
      const updatedHistory = addToHistory(historyItem);
      set({ data, loading: false, error: null, history: updatedHistory });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage, loading: false, data: null });
    }
  },

  loadFromHistory: (item: HistoryItem) => {
    set({ data: item.data, error: null });
  },

  clearHistory: () => {
    clearLocalHistory();
    set({ history: [] });
  },

  setError: (error: string) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({ data: null, loading: false, error: null });
  },
}));
