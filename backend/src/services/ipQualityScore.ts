import axios from 'axios';
import type { IPQualityScoreResponse } from '@/types/index.js';
import { handleProviderError } from '@/utils/apiErrorHandler.js';
import { logger } from '@/utils/logger.js';

const IPQUALITYSCORE_API_URL = 'https://ipqualityscore.com/api/json/ip';

export class IPQualityScoreService {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.IPQUALITYSCORE_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('IPQualityScore API key is required');
    }
  }

  async checkIP(ipAddress: string): Promise<IPQualityScoreResponse> {
    try {
      const response = await axios.get(`${IPQUALITYSCORE_API_URL}/${this.apiKey}/${ipAddress}`, {
        params: {
          // strictness is default
          allow_public_access_points: 'true',
        },
        headers: {
          Accept: 'application/json',
        },
        timeout: 10000, // If IPQualityScore doesn't respond within 10 seconds, axios cancels the request
      });

      // Log the raw response from IPQualityScore
      logger.debug({ response: response.data }, '🅱 IPQualityScore Raw Response');

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return handleProviderError(error, 'IPQualityScore');
      }
      throw new Error('Unexpected error when calling IPQualityScore API');
    }
  }
}
