import { z } from 'zod';
import { isIP } from 'net';

// IP address validation schema using Node.js built-in net module
// This is more reliable and handles edge cases better than regex
export const ipAddressSchema = z.string().refine(
  (value) => {
    const trimmed = value.trim();
    // isIP returns 4 for IPv4, 6 for IPv6, or 0 for invalid
    return isIP(trimmed) !== 0;
  },
  {
    message: 'Invalid IP address format. Must be a valid IPv4 or IPv6 address.',
  }
);

export const validateIP = (ip: string): { valid: boolean; error?: string } => {
  try {
    ipAddressSchema.parse(ip);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.issues[0]?.message || 'Invalid IP address' };
    }
    return { valid: false, error: 'Invalid IP address' };
  }
};

// Query parameter schema for the API endpoint
export const intelQuerySchema = z.object({
  ip: ipAddressSchema,
  maxAgeInDays: z.coerce.number().min(1).max(365).optional().default(90),
});

export type IntelQuery = z.infer<typeof intelQuerySchema>;
