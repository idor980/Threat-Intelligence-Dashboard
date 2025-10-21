# Threat Intelligence Dashboard - Backend

Node.js Backend-for-Frontend (BFF) service that aggregates threat intelligence data from external APIs.

## Features

- ✅ **IP Validation**: Robust validation for IPv4 and IPv6 addresses using Node.js built-in `net` module
- ✅ **AbuseIPDB Integration**: Fetches abuse reports and reputation scores
- ✅ **Error Handling**: Comprehensive error handling including rate limits
- ✅ **Type Safety**: Full TypeScript support with strict mode
- ✅ **Risk Scoring**: Automatic risk level calculation (Low/Medium/High)

## Prerequisites

- Node.js 20+ 
- npm or yarn
- AbuseIPDB API key (free tier available at https://www.abuseipdb.com/api.html)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

3. Add your AbuseIPDB API key to `.env`:
```env
ABUSEIPDB_API_KEY=your_api_key_here
```

## Running the Server

### Development Mode (with hot reload)
```bash
npm run dev
```
Server will start on `http://localhost:3001`

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### Health Check
```
GET /health
```
Returns server status and timestamp.

### Get Threat Intelligence
```
GET /api/intel?ip=<ip_address>&maxAgeInDays=<days>
```

**Query Parameters:**
- `ip` (required): IP address to check (IPv4 or IPv6)
- `maxAgeInDays` (optional): Maximum age of reports in days (1-365, default: 90)

**Example Request:**
```bash
curl "http://localhost:3001/api/intel?ip=8.8.8.8&maxAgeInDays=90"
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
  "threatScore": 0,
  "lastReportedAt": null,
  "isWhitelisted": false,
  "usageType": "Data Center",
  "riskLevel": "low"
}
```

**Error Response:**
```json
{
  "error": "Error",
  "message": "Invalid IP address format. Must be a valid IPv4 or IPv6 address.",
  "statusCode": 400
}
```

## Risk Levels

The API automatically calculates a risk level based on the threat score:

- **Low** (0-39): Minimal or no threat detected
- **Medium** (40-74): Moderate threat level
- **High** (75-100): High threat level

## Available Scripts

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Run production server
npm start
```

## Project Structure

```
backend/
├── src/
│   ├── index.ts                    # Server entry point
│   ├── routes/
│   │   └── intel.ts                # Intel API routes
│   ├── services/
│   │   ├── abuseIPDB.service.ts    # AbuseIPDB integration
│   │   └── aggregation.service.ts  # Data aggregation logic
│   ├── validators/
│   │   └── ipValidator.ts          # IP validation with Node.js net module
│   ├── types/
│   │   └── index.ts                # TypeScript type definitions
│   └── utils/
│       └── errorHandler.ts         # Error handling middleware
├── .env.example                    # Environment variables template
├── package.json
└── tsconfig.json
```

## Error Handling

The API handles various error scenarios:

- **400**: Invalid IP address format
- **429**: Rate limit exceeded (AbuseIPDB)
- **500**: API key issues (logged server-side)
- **503**: External service unavailable

## Future Enhancements

The backend is designed to easily integrate additional threat intelligence APIs:

1. Add new service in `src/services/` (e.g., `ipQualityScore.service.ts`)
2. Update `aggregation.service.ts` to call the new API
3. Enhance the unified response type in `src/types/index.ts`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 3001) | No |
| `NODE_ENV` | Environment (development/production/test) | No |
| `ABUSEIPDB_API_KEY` | AbuseIPDB API key | Yes |

## License

ISC

