import { AxiosError } from 'axios';

/**
 * Standardized error handler for external API calls
 * Provides consistent error messages across all threat intelligence providers
 */
export function handleProviderError(error: AxiosError, providerName: string): never {
  const status = error.response?.status;
  const data = error.response?.data as {
    errors?: Array<{ detail: string }>;
    message?: string;
  };

  // Rate limit error (429)
  if (status === 429) {
    throw new Error(`Rate limit reached for ${providerName}. Please try again later.`);
  }

  // Authentication error (401/403)
  if (status === 401 || status === 403) {
    throw new Error(`Invalid ${providerName} API key or insufficient permissions.`);
  }

  // Bad request (400)
  if (status === 400) {
    // Try to extract error message from different response formats
    const errorMsg =
      data?.errors?.[0]?.detail || data?.message || `Bad request to ${providerName} API`;
    throw new Error(errorMsg);
  }

  // Server error (500+)
  if (status && status >= 500) {
    throw new Error(`${providerName} service is currently unavailable. Please try again later.`);
  }

  // Network/timeout errors
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    throw new Error(`Request to ${providerName} timed out. Please try again.`);
  }

  // Generic error fallback
  throw new Error(error.message || `Failed to fetch data from ${providerName}`);
}
