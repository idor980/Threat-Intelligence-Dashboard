// Frontend types matching backend response
export type ThreatIntelligenceData = {
  ipAddress: string;
  hostname?: string;
  isp: string;
  country: string;
  abuseScore: number;
  recentReports: number;
  vpnDetected?: boolean;
  threatScore?: number;
};

export type ErrorResponse = {
  error: string;
  message: string;
  statusCode: number;
};

export type IPCheckState = {
  data: ThreatIntelligenceData | null;
  loading: boolean;
  error: string | null;
  checkIP: (ip: string, maxAgeInDays?: number) => Promise<void>;
  reset: () => void;
};

