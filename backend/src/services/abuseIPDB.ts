import axios, { AxiosError } from 'axios';
import type { AbuseIPDBResponse } from '@/types/index.js';

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
      console.error('📥 AbuseIPDB Raw Response:', JSON.stringify(response.data, null, 2));
      console.error('✅ Response matches AbuseIPDBResponse type');

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return this.handleAbuseIPDBError(error);
      }
      throw new Error('Unexpected error when calling AbuseIPDB API');
    }
  }

  /**
   * Handle errors from AbuseIPDB API
   */
  private handleAbuseIPDBError(error: AxiosError): never {
    const status = error.response?.status;
    const data = error.response?.data as { errors?: Array<{ detail: string }> };

    // Rate limit error (429)
    if (status === 429) {
      throw new Error('Rate limit reached for AbuseIPDB. Please try again later.');
    }

    // Authentication error (401/403)
    if (status === 401 || status === 403) {
      throw new Error('Invalid AbuseIPDB API key or insufficient permissions.');
    }

    // Bad request (400)
    if (status === 400) {
      const errorMsg = data?.errors?.[0]?.detail || 'Bad request to AbuseIPDB API';
      throw new Error(errorMsg);
    }

    // Server error (500+)
    if (status && status >= 500) {
      throw new Error('AbuseIPDB service is currently unavailable. Please try again later.');
    }

    // Network/timeout errors
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      throw new Error('Request to AbuseIPDB timed out. Please try again.');
    }

    // Generic error
    throw new Error(error.message || 'Failed to fetch data from AbuseIPDB');
  }
}

