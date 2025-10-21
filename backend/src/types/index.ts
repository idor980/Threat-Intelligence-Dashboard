// External API Response Types (only fields we actually use)
export type AbuseIPDBResponse = {
  data: {
    ipAddress: string;
    hostnames: string[];
    isp: string;
    countryName: string;
    abuseConfidenceScore: number;
    totalReports: number;
    // VPN/Proxy Detected -> must come from IPQualityScore API
    // Threat Score -> must come from IPQualityScore API
  };
};


// Unified Response Type (sent to frontend)
export type ThreatIntelligenceData = {
  ipAddress: string;
  hostname?: string | undefined;
  isp: string;
  country: string;
  abuseScore: number;
  recentReports: number;
  vpnDetected?: boolean | undefined;
  threatScore?: number | undefined;
};

// Error Response Type
export type ErrorResponse = {
  error: string;
  message: string;
  statusCode: number;
};

