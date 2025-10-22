import type { AbuseIPDBResponse, IPQualityScoreResponse } from '@/types/ip-intel-types.js';
import type { ThreatIntelligenceData } from '@shared/types.js';
import { AbuseIPDBService } from '@/clients/abuse-ip-db.client.js';
import { IPQualityScoreService } from '@/clients/ip-quality-score.client.js';
import { logger } from '@/utils/logger.js';

/**
 * Transform AbuseIPDB and IPQualityScore responses to unified format
 */
export function transformToUnifiedFormat(
  abuseData: AbuseIPDBResponse,
  ipQualityData: IPQualityScoreResponse
): ThreatIntelligenceData {
  const { data } = abuseData;

  return {
    ipAddress: data.ipAddress,
    hostname: data.hostnames[0] || ipQualityData.host || undefined,
    isp: data.isp || ipQualityData.ISP,
    country: data.countryName,
    abuseScore: data.abuseConfidenceScore,
    recentReports: data.totalReports,
    vpnDetected: ipQualityData.vpn || ipQualityData.proxy,
    threatScore: ipQualityData.fraud_score,
  };
}

/**
 * Aggregates threat intelligence data from multiple sources
 * Supports: AbuseIPDB and IPQualityScore
 */
export class ThreatIntelligenceAggregator {
  private abuseIPDBService: AbuseIPDBService;
  private ipQualityScoreService: IPQualityScoreService;

  constructor() {
    this.abuseIPDBService = new AbuseIPDBService();
    this.ipQualityScoreService = new IPQualityScoreService();
  }

  /**
   * Aggregate threat intelligence data from AbuseIPDB and IPQualityScore
   * @param ipAddress - The IP address to check
   * @returns Unified threat intelligence data
   */
  async aggregateThreatData(ipAddress: string): Promise<ThreatIntelligenceData> {
    logger.info({ ipAddress }, '🔍 Starting IP address threat intelligence query');

    // Fetch data from both APIs in parallel
    const [abuseData, ipQualityData] = await Promise.all([
      this.abuseIPDBService.checkIP(ipAddress),
      this.ipQualityScoreService.checkIP(ipAddress),
    ]);

    return transformToUnifiedFormat(abuseData, ipQualityData);
  }
}
