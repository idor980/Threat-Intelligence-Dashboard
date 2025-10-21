import axios, { AxiosError } from 'axios';
import type { IPQualityScoreResponse } from '@/types/index.js';

const IPQUALITYSCORE_API_URL = 'https://ipqualityscore.com/api/json/ip';

export class IPQualityScoreService {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.IPQUALITYSCORE_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('IPQualityScore API key is required');
    }
  }

  /**
   * Check IP address for VPN/Proxy detection and fraud scoring
   * @param ipAddress - IP address to check
   * @param strictness - Strictness level (0-3, where 0 is least strict)
   * @returns Promise with IPQualityScore response data
   */
  async checkIP(ipAddress: string, strictness: number = 0): Promise<IPQualityScoreResponse> {
    try {
      const response = await axios.get(`${IPQUALITYSCORE_API_URL}/${this.apiKey}/${ipAddress}`, {
        params: {
          strictness,
          allow_public_access_points: 'true',
        },
        headers: {
          Accept: 'application/json',
        },
        timeout: 10000, // If IPQualityScore doesn't respond within 10 seconds, axios cancels the request
      });

      // Log the raw response from IPQualityScore
      console.error('📥 IPQualityScore Raw Response:', JSON.stringify(response.data, null, 2));
      console.error('✅ Response matches IPQualityScoreResponse type');

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return this.handleIPQualityScoreError(error);
      }
      throw new Error('Unexpected error when calling IPQualityScore API');
    }
  }

  /**
   * Handle errors from IPQualityScore API
   */
  private handleIPQualityScoreError(error: AxiosError): never {
    const status = error.response?.status;
    const data = error.response?.data as { success?: boolean; message?: string };

    // Rate limit error (429)
    if (status === 429) {
      throw new Error('Rate limit reached for IPQualityScore. Please try again later.');
    }

    // Authentication error (401/403)
    if (status === 401 || status === 403) {
      throw new Error('Invalid IPQualityScore API key or insufficient permissions.');
    }

    // Bad request (400)
    if (status === 400) {
      const errorMsg = data?.message || 'Bad request to IPQualityScore API';
      throw new Error(errorMsg);
    }

    // Server error (500+)
    if (status && status >= 500) {
      throw new Error('IPQualityScore service is currently unavailable. Please try again later.');
    }

    // Network/timeout errors
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      throw new Error('Request to IPQualityScore timed out. Please try again.');
    }

    // Generic error
    throw new Error(error.message || 'Failed to fetch data from IPQualityScore');
  }
}


