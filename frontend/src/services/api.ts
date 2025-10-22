import axios from 'axios';
import type { ThreatIntelligenceData, ErrorResponse } from '@shared/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkIPAddress = async (ip: string): Promise<ThreatIntelligenceData> => {
  try {
    const response = await api.get('/api/intel', {
      params: { ip },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data as ErrorResponse;
      throw new Error(errorData.message || 'Failed to check IP address');
    }
    throw new Error('Network error. Please try again.');
  }
};
