import type { AbuseIPDBResponse, ThreatIntelligenceData } from '@/types/index.js';
import { AbuseIPDBService } from '@/services/abuseIPDB.js';

/**
 * Aggregates threat intelligence data from multiple sources
 * Currently supports: AbuseIPDB
 * TODO: Add IPQualityScore API for VPN/Proxy detection and threat scoring
 */
export class ThreatIntelligenceAggregator {
  private abuseIPDBService: AbuseIPDBService;

  constructor() {
    this.abuseIPDBService = new AbuseIPDBService();
  }

  /**
   * Aggregate threat intelligence data from AbuseIPDB
   * @param ipAddress - The IP address to check
   * @param maxAgeInDays - Maximum age of reports to include (default: 90)
   * @returns Unified threat intelligence data
   */
  async aggregateThreatData(
    ipAddress: string,
    maxAgeInDays: number = 90
  ): Promise<ThreatIntelligenceData> {
    const abuseData = await this.abuseIPDBService.checkIP(ipAddress, maxAgeInDays);
    
    console.error('\n========================================');
    console.error('🔍 IP Address Query:', ipAddress);
    console.error('📅 Max Age in Days:', maxAgeInDays);
    console.error('========================================\n');
    
    return this.transformToUnifiedFormat(abuseData);
  }

  /**
   * Transform AbuseIPDB response to unified format
   * Note: vpnDetected and threatScore will be populated when IPQualityScore API is integrated
   */
  private transformToUnifiedFormat(abuseData: AbuseIPDBResponse): ThreatIntelligenceData {
    const { data } = abuseData;

    const transformedData: ThreatIntelligenceData = {
      ipAddress: data.ipAddress,
      hostname: data.hostnames[0],
      isp: data.isp,
      country: data.countryName,
      abuseScore: data.abuseConfidenceScore,
      recentReports: data.totalReports,
      // vpnDetected and threatScore will be added from IPQualityScore API
    };

    // Log the transformation
    console.error('🔄 Transformed to ThreatIntelligenceData:', JSON.stringify(transformedData, null, 2));
    console.error('✅ Response matches ThreatIntelligenceData type\n');

    return transformedData;
  }
}

