import axios from 'axios';
import type { IPQualityScoreResponse } from '@/types/index.js';
import { handleProviderError } from '@/utils/apiErrorHandler.js';

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
        return handleProviderError(error, 'IPQualityScore');
      }
      throw new Error('Unexpected error when calling IPQualityScore API');
    }
  }
}
