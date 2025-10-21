import type {
  AbuseIPDBResponse,
  IPQualityScoreResponse,
  ThreatIntelligenceData,
} from '@/types/index.js';
import { AbuseIPDBService } from '@/services/abuseIPDB.js';
import { IPQualityScoreService } from '@/services/ipQualityScore.js';

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
   * @param maxAgeInDays - Maximum age of reports to include (default: 90)
   * @returns Unified threat intelligence data
   */
  async aggregateThreatData(
    ipAddress: string,
    maxAgeInDays: number = 90
  ): Promise<ThreatIntelligenceData> {
    console.error('\n========================================');
    console.error('🔍 IP Address Query:', ipAddress);
    console.error('📅 Max Age in Days:', maxAgeInDays);
    console.error('========================================\n');

    // Fetch data from both APIs in parallel
    const [abuseData, ipQualityData] = await Promise.all([
      this.abuseIPDBService.checkIP(ipAddress, maxAgeInDays),
      this.ipQualityScoreService.checkIP(ipAddress),
    ]);

    return this.transformToUnifiedFormat(abuseData, ipQualityData);
  }

  /**
   * Transform AbuseIPDB and IPQualityScore responses to unified format
   */
  private transformToUnifiedFormat(
    abuseData: AbuseIPDBResponse,
    ipQualityData: IPQualityScoreResponse
  ): ThreatIntelligenceData {
    const { data } = abuseData;

    const transformedData: ThreatIntelligenceData = {
      ipAddress: data.ipAddress,
      hostname: data.hostnames[0] || ipQualityData.host || undefined,
      isp: data.isp || ipQualityData.ISP,
      country: data.countryName,
      abuseScore: data.abuseConfidenceScore,
      recentReports: data.totalReports,
      vpnDetected: ipQualityData.vpn || ipQualityData.proxy,
      threatScore: ipQualityData.fraud_score,
    };

    // Log the transformation
    console.error(
      '🔄 Transformed to ThreatIntelligenceData:',
      JSON.stringify(transformedData, null, 2)
    );
    console.error('✅ Response matches ThreatIntelligenceData type\n');

    return transformedData;
  }
}
