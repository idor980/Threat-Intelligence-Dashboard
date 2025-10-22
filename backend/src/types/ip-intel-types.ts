export type AbuseIPDBResponse = {
  data: {
    ipAddress: string;
    hostnames: string[];
    isp: string;
    countryName: string;
    abuseConfidenceScore: number;
    totalReports: number;
  };
};

export type IPQualityScoreResponse = {
  ISP: string;
  host: string;
  proxy: boolean;
  vpn: boolean;
  fraud_score: number;
};
