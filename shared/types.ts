/**
 * Shared types between frontend and backend
 * This is the single source of truth for common type definitions
 */

// Unified Response Type (sent to frontend)
export type ThreatIntelligenceData = {
  ipAddress: string;
  hostname?: string | undefined;
  isp: string;
  country: string;
  abuseScore: number;
  recentReports: number;
  vpnDetected: boolean;
  threatScore: number;
};

// Error Response Type
export type ErrorResponse = {
  error: string;
  message: string;
  statusCode: number;
};
