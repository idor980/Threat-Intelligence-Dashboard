import { create } from 'zustand';
import { checkIPAddress } from '@/services/api';
import type { IPCheckState } from '@/types';

export const useIPCheckStore = create<IPCheckState>((set) => ({
  data: null,
  loading: false,
  error: null,

  checkIP: async (ip: string, maxAgeInDays: number = 90) => {
    set({ loading: true, error: null, data: null });
    try {
      const data = await checkIPAddress(ip, maxAgeInDays);
      set({ data, loading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage, loading: false, data: null });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({ data: null, loading: false, error: null });
  },
}));
