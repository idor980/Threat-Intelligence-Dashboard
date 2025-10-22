# Threat Intelligence Dashboard - Backend

A Node.js/Express API that aggregates IP threat intelligence data from multiple sources (AbuseIPDB and IPQualityScore) and provides a unified REST API for querying IP reputation.

## 🏗️ Project Structure

```
.
├── src/
│   ├── aggregators/          # Business logic for combining data sources
│   │   └── threat-intelligence.ts
│   ├── clients/              # External API clients
│   │   ├── abuse-ip-db.client.ts
│   │   └── ip-quality-score.client.ts
│   ├── routes/               # API endpoints
│   │   ├── health.router.ts
│   │   └── ip-check.router.ts
│   ├── types/                # TypeScript type definitions
│   │   └── ip-intel-types.ts
│   ├── utils/                # Utilities
│   │   ├── error-handler.ts  # Centralized error handling
│   │   ├── logger.ts         # Pino logger configuration
│   │   └── rate-limiter.ts   # Rate limiting middleware
│   ├── validators/           # Input validation schemas
│   │   └── ip.schema.ts
│   └── server.ts             # Application entry point
├── package.json
├── tsconfig.json
└── eslint.config.js
```

## 🚀 Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express 5
- **Language**: TypeScript
- **Validation**: Zod
- **Logging**: Pino
- **HTTP Client**: Axios
- **Rate Limiting**: express-rate-limit

## 📋 Prerequisites

- Node.js 20 or higher
- npm or yarn
- API keys for:
  - [AbuseIPDB](https://www.abuseipdb.com/)
  - [IPQualityScore](https://www.ipqualityscore.com/)

## ⚙️ Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create `.env` file**

   ```bash
   # Server Configuration
   PORT=3001

   # API Keys
   ABUSEIPDB_API_KEY=your_abuseipdb_api_key
   IPQUALITYSCORE_API_KEY=your_ipqualityscore_api_key
   ```

3. **Run development server**

   ```bash
   npm run dev
   ```

   The server should start at `http://localhost:3001`

## 🧪 Testing the API

You can test the endpoints using curl:

**Health Check:**

```bash
curl http://localhost:3001/health
```

**IP Intelligence Check:**

```bash
curl "http://localhost:3001/api/intel?ip=8.8.8.8"
```

## 📡 API Endpoints

### Health Check

```
GET /health
```

Returns server health status.

### IP Threat Intelligence

```
GET /api/intel?ip=<IP_ADDRESS>
```

**Query Parameters:**

- `ip` (required): IPv4 or IPv6 address to check

**Example Request:**

```bash
curl "http://localhost:3001/api/intel?ip=8.8.8.8"
```

**Example Response:**

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

## 🛠️ Available Scripts

| Command        | Description                              |
| -------------- | ---------------------------------------- |
| `npm run dev`  | Start development server with hot reload |
| `npm run lint` | Run ESLint                               |

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse (10 requests per minute per IP)
- **Input Validation**: Validates IP addresses using Node.js built-in `net` module
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **CORS**: Configured for secure cross-origin requests

## 🏛️ Architecture Highlights

- **Layered Architecture**: Separation of concerns (routes → aggregators → clients)
- **Parallel API Calls**: Fetches data from multiple sources concurrently for optimal performance
- **Type Safety**: Full TypeScript support with strict mode enabled
- **Logging**: Structured logging with Pino
- **Path Aliases**: Clean imports using `@/` prefix

## 📝 Environment Variables

| Variable                 | Description                 | Required |
| ------------------------ | --------------------------- | -------- |
| `PORT`                   | Server port (default: 3001) | No       |
| `ABUSEIPDB_API_KEY`      | AbuseIPDB API key           | Yes      |
| `IPQUALITYSCORE_API_KEY` | IPQualityScore API key      | Yes      |

## 🧪 Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "statusCode": 400
}
```

Common error codes:

- `400`: Invalid input (malformed IP address)
- `429`: Rate limit exceeded
- `500`: Internal server error
