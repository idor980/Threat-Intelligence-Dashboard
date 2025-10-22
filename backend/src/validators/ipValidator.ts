import { z } from 'zod';
import { isIP } from 'net';

const ipAddressSchema = z.string().refine(
  (value) => {
    const trimmed = value.trim();
    // isIP returns 4 for IPv4, 6 for IPv6, or 0 for invalid
    return isIP(trimmed) !== 0;
  },
  {
    message: 'Invalid IP address format. Must be a valid IPv4 or IPv6 address.',
  }
);

// Schema for the API endpoint
// Could be expended in the future to include more query parameters (e.g. maxAgeInDays)
export const intelQuerySchema = z.object({
  ip: ipAddressSchema,
});
