import axios from 'axios';
import type { AbuseIPDBResponse } from '@/types/index.js';
import { handleProviderError } from '@/utils/apiErrorHandler.js';
import { logger } from '@/utils/logger.js';

const ABUSEIPDB_API_URL = 'https://api.abuseipdb.com/api/v2';

export class AbuseIPDBService {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ABUSEIPDB_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('AbuseIPDB API key is required');
    }
  }

  /**
   * Check IP address for abuse reports
   * @param ipAddress - IP address to check
   * @param maxAgeInDays - Maximum age of reports to retrieve (1-365 days)
   * @returns Promise with AbuseIPDB response data
   */
  async checkIP(ipAddress: string, maxAgeInDays: number = 90): Promise<AbuseIPDBResponse> {
    try {
      const response = await axios.get(`${ABUSEIPDB_API_URL}/check`, {
        params: {
          ipAddress,
          maxAgeInDays,
          verbose: true, // Get more detailed information
        },
        headers: {
          Key: this.apiKey,
          Accept: 'application/json',
        },
        timeout: 10000, // If AbuseIPDB doesn't respond within 10 seconds, axios cancels the request
      });

      // Log the raw response from AbuseIPDB
      logger.debug({ response: response.data }, '🅰 AbuseIPDB Raw Response');

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return handleProviderError(error, 'AbuseIPDB');
      }
      throw new Error('Unexpected error when calling AbuseIPDB API');
    }
  }
}
