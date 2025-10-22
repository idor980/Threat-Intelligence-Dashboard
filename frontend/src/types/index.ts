import type { ThreatIntelligenceData } from '@shared/types';

export type IPCheckState = {
  data: ThreatIntelligenceData | null;
  loading: boolean;
  error: string | null;
  checkIP: (ip: string, maxAgeInDays?: number) => Promise<void>;
  setError: (error: string) => void;
  clearError: () => void;
  reset: () => void;
};
