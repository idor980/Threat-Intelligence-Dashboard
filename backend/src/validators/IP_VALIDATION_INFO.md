# IP Validation Implementation

## Why Node.js `net` Module?

The IP validator uses Node.js built-in `net.isIP()` function instead of regex patterns.

### Benefits:

1. **More Reliable**: Maintained by Node.js core team, handles edge cases
2. **No Dependencies**: Built into Node.js, no external packages needed
3. **Battle-Tested**: Used by millions of Node.js applications
4. **Better Edge Case Handling**: Correctly validates complex IPv6 formats

### How It Works:

```typescript
import { isIP } from 'net';

// isIP() returns:
// - 4 for valid IPv4 addresses
// - 6 for valid IPv6 addresses
// - 0 for invalid addresses

const isValidIP = isIP(ipAddress) !== 0;
```

### Examples:

**Valid IPs:**

- IPv4: `8.8.8.8`, `192.168.1.1`, `255.255.255.255`
- IPv6: `2001:0db8:85a3:0000:0000:8a2e:0370:7334`

**Invalid IPs:**

- `256.256.256.256` (out of range)
- `192.168.1` (incomplete)
- `not-an-ip` (invalid format)

## Integration with Zod

The validator integrates with Zod for schema validation:

```typescript
export const ipAddressSchema = z
  .string()
  .refine((value) => isIP(value.trim()) !== 0, { message: 'Invalid IP address format' });
```

This provides both runtime validation and TypeScript type safety.
