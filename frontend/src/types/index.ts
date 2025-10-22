import type { ThreatIntelligenceData } from '@shared/types';

export type HistoryItem = {
  ipAddress: string;
  timestamp: number;
  data: ThreatIntelligenceData;
};

export type IPCheckState = {
  data: ThreatIntelligenceData | null;
  loading: boolean;
  error: string | null;
  history: HistoryItem[];
  checkIP: (ip: string) => Promise<void>;
  loadFromHistory: (item: HistoryItem) => void;
  clearHistory: () => void;
  setError: (error: string) => void;
  clearError: () => void;
  reset: () => void;
};
