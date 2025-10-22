import { describe, it, expect } from 'vitest';
import { transformToUnifiedFormat } from './threat-intelligence.js';
import type { AbuseIPDBResponse, IPQualityScoreResponse } from '@/types/ip-intel-types.js';

describe('Data Aggregation', () => {
  it('should merge API responses into unified format', () => {
    const abuseData: AbuseIPDBResponse = {
      data: {
        ipAddress: '8.8.8.8',
        hostnames: ['dns.google'],
        isp: 'Google LLC',
        countryName: 'United States',
        abuseConfidenceScore: 0,
        totalReports: 159,
      },
    };

    const ipQualityData: IPQualityScoreResponse = {
      ISP: 'Google',
      host: 'dns.google',
      proxy: false,
      vpn: false,
      fraud_score: 0,
    };

    const result = transformToUnifiedFormat(abuseData, ipQualityData);

    expect(result.ipAddress).toBe('8.8.8.8');
    expect(result.hostname).toBe('dns.google');
    expect(result.country).toBe('United States');
    expect(result.vpnDetected).toBe(false);
  });

  it('should detect VPN/Proxy correctly', () => {
    const abuseData: AbuseIPDBResponse = {
      data: {
        ipAddress: '1.2.3.4',
        hostnames: [],
        isp: 'VPN Provider',
        countryName: 'Netherlands',
        abuseConfidenceScore: 50,
        totalReports: 25,
      },
    };

    const ipQualityDataWithVPN: IPQualityScoreResponse = {
      ISP: 'VPN Provider',
      host: '',
      proxy: false,
      vpn: true,
      fraud_score: 75,
    };

    expect(transformToUnifiedFormat(abuseData, ipQualityDataWithVPN).vpnDetected).toBe(true);

    const ipQualityDataWithProxy: IPQualityScoreResponse = {
      ISP: 'Proxy Service',
      host: '',
      proxy: true,
      vpn: false,
      fraud_score: 80,
    };

    expect(transformToUnifiedFormat(abuseData, ipQualityDataWithProxy).vpnDetected).toBe(true);
  });

  it('should fail when required data is missing', () => {
    const incompleteAbuseData = { data: null } as unknown as AbuseIPDBResponse;
    const validIPQualityData: IPQualityScoreResponse = {
      ISP: 'Test ISP',
      host: 'test.com',
      proxy: false,
      vpn: false,
      fraud_score: 0,
    };

    // Should throw when trying to access properties on null data
    expect(() => transformToUnifiedFormat(incompleteAbuseData, validIPQualityData)).toThrow();
  });
});
