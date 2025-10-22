## 🏗️ Architecture

```
src/
├── routes/           # Express route handlers
├── aggregators/      # Business logic (combine API data)
├── clients/          # External API clients (AbuseIPDB, IPQualityScore)
├── validators/       # Zod schemas (IP validation)
├── utils/            # Error handling, logging, rate limiting
└── server.ts         # Entry point
```

**Flow:** `Route → Validator → Aggregator → Clients → Transform → Response`

**Key Patterns:**

- Layered separation of concerns
- Centralized error handling (`handleProviderError`)
- Parallel API calls with `Promise.all()`
- Native Node.js `net.isIP()` for validation

## 📡 API Endpoints

### `GET /api/intel?ip=<address>`

Check IP threat intelligence.

**Query Params:**

- `ip` (required): IPv4 or IPv6 address

**Response (200):**

```json
{
  "ipAddress": "8.8.8.8",
  "hostname": "dns.google",
  "isp": "Google LLC",
  "country": "United States",
  "abuseScore": 0,
  "recentReports": 0,
  "vpnDetected": false,
  "threatScore": 0
}
```

**Error Response (400/429/500):**

```json
{
  "error": "Validation Error",
  "message": "Invalid IP address format. Must be a valid IPv4 or IPv6 address.",
  "statusCode": 400
}
```

### `GET /health`

Health check endpoint.

**Example:**

```bash
curl "http://localhost:3000/api/intel?ip=8.8.8.8"
```

## 🔒 Security

- **Rate Limiting**: 10 requests/minute per IP
- **Validation**: Zod schema + Node.js `net.isIP()`
- **Timeouts**: 10s per external API request
- **CORS**: Enabled for frontend
- **Environment Variables**: API keys never hardcoded

## 🧪 Testing

```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
```

**Test Coverage:**

- IP validation (IPv4/IPv6, malformed IPs)
- Data aggregation logic
- Error handling (rate limits, invalid API keys)

## 🛠️ Tech Stack

- **Express 5** - Web framework
- **TypeScript** - Type safety
- **Zod** - Schema validation
- **Axios** - HTTP client (with timeouts)
- **Pino** - Structured logging
- **express-rate-limit** - Rate limiting

## 📝 Environment Variables

| Variable                 | Required | Default | Description            |
| ------------------------ | -------- | ------- | ---------------------- |
| `PORT`                   | No       | 3000    | Server port            |
| `ABUSEIPDB_API_KEY`      | Yes      | -       | AbuseIPDB API key      |
| `IPQUALITYSCORE_API_KEY` | Yes      | -       | IPQualityScore API key |

## 🔍 Logging

Structured JSON logs via Pino:

```bash
{"level":"info","ipAddress":"8.8.8.8","msg":"Starting IP address threat intelligence query"}
```

Debug mode: Set `NODE_ENV=development` to see verbose logs.

---

## 📋 Implementation Decisions

These are design choices made specifically for this assignment. They reflect trade-offs appropriate for the scope and requirements of the task.

### Simple Rate Limiting (10 requests/minute)

A basic rate limiter using `express-rate-limit` with a fixed 10 requests per minute per IP address.

**Rationale:**

- Demonstrates rate limiting concept for the assignment requirements
- Protects against basic abuse and accidental request loops
- Simple to implement and understand

**Production Considerations:**

In a production environment, a more sophisticated approach would be needed:

1. **API-Aware Rate Limiting**: Align rate limits with external API quotas (AbuseIPDB: 1,000/day free tier, IPQualityScore: 5,000/month free tier) to prevent quota exhaustion
2. **Retry with Backoff**: Implement exponential backoff with jitter when external APIs return 429 (Too Many Requests) to gracefully handle rate limit errors
3. **Distributed Rate Limiting**: Use Redis or similar for rate limiting across multiple server instances
4. **Per-User Quotas**: Track usage by authenticated user rather than IP address to prevent sharing limits

For this assignment, the simple fixed-rate approach is sufficient to demonstrate error handling and user feedback for rate limit scenarios.
