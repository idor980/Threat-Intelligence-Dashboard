import { describe, it, expect } from 'vitest';
import { intelQuerySchema } from './ip.schema.js';

describe('IP Validation Schema', () => {
  describe('Valid IP Addresses', () => {
    it('should accept valid IPv4 address', () => {
      const result = intelQuerySchema.safeParse({ ip: '8.8.8.8' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.ip).toBe('8.8.8.8');
      }
    });

    it('should accept valid IPv6 address', () => {
      const result = intelQuerySchema.safeParse({ ip: '2001:db8::1' });
      expect(result.success).toBe(true);
    });

    it('should accept localhost addresses', () => {
      expect(intelQuerySchema.safeParse({ ip: '127.0.0.1' }).success).toBe(true);
      expect(intelQuerySchema.safeParse({ ip: '::1' }).success).toBe(true);
    });
  });

  describe('Invalid IP Addresses', () => {
    it('should reject empty or whitespace strings', () => {
      expect(intelQuerySchema.safeParse({ ip: '' }).success).toBe(false);
      expect(intelQuerySchema.safeParse({ ip: '   ' }).success).toBe(false);
    });

    it('should reject malformed IPv4 addresses', () => {
      expect(intelQuerySchema.safeParse({ ip: '192.168.1' }).success).toBe(false);
      expect(intelQuerySchema.safeParse({ ip: '192.168.1.256' }).success).toBe(false);
      expect(intelQuerySchema.safeParse({ ip: '192.168.1.1.1' }).success).toBe(false);
    });

    it('should reject hostnames and URLs', () => {
      expect(intelQuerySchema.safeParse({ ip: 'google.com' }).success).toBe(false);
      expect(intelQuerySchema.safeParse({ ip: 'https://8.8.8.8' }).success).toBe(false);
    });

    it('should reject missing or invalid parameters', () => {
      expect(intelQuerySchema.safeParse({}).success).toBe(false);
      expect(intelQuerySchema.safeParse({ ip: null }).success).toBe(false);
      expect(intelQuerySchema.safeParse({ ip: 12345 }).success).toBe(false);
    });
  });
});
