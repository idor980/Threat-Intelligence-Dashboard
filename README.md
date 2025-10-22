# Threat Intelligence Dashboard

Full-stack application for checking IP addresses against multiple threat intelligence sources (AbuseIPDB + IPQualityScore).

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- API keys for [AbuseIPDB](https://www.abuseipdb.com/api.html) and [IPQualityScore](https://www.ipqualityscore.com/)

### Setup

```bash
# Install all dependencies (root, backend, frontend)
npm run install:all

# Configure backend - copy .env.example and add your API keys (My keys are included for simplicity)
cp backend/.env.example backend/.env

# Run (in separate terminals)
npm run dev:backend    # Backend: http://localhost:3000
npm run dev:frontend   # Frontend: http://localhost:5173
```

### Testing

```bash
cd backend && npm test
cd frontend && npm test
```

---

## 🏗️ Architecture

**Tech Stack:**

- **Frontend**: React 19 + TypeScript + Vite + Zustand + Tailwind CSS
- **Backend**: Node.js + Express 5 + TypeScript + Zod + Pino

**Structure:**

```
threat-intelligence-dashboard/
├── frontend/    # React app with Zustand state management
├── backend/     # Express BFF (Backend-for-Frontend)
└── shared/      # Shared TypeScript types
```

**Key Patterns:**

- Layered architecture: Routes → Aggregators → Clients
- Parallel API calls with `Promise.all()`
- Centralized error handling
- Shared types between frontend/backend

---

## 🔑 Design Decisions

### 1. Fail-All API Aggregation

Both APIs must succeed, or the request fails.

**Why?**

- Threat intelligence requires **complete data** for accurate risk assessment
- Missing abuse scores OR VPN detection could mislead users about IP safety
- Simpler error handling with no partial-data ambiguity

**Trade-off:** Service unavailable if one API is down, but accuracy > availability for security data.

---

### 2. No Caching (Always Fresh Data)

Every check fetches fresh data from external APIs.

**Why?**

- Threat intelligence is time-sensitive (scores change as new reports arrive)
- Users expect current data when clicking "Check"
- History feature lets users revisit past results

**Trade-off:** Higher API quota usage, but guarantees up-to-date security information.

---

### 3. Backend-Only Validation

IP validation happens only on the backend using Node's native `net.isIP()`.

**Why?**

- Single source of truth (no duplicate validation logic)
- Node's built-in validator is reliable and available only server-side
- Separation of concerns (frontend = UX, backend = business logic)

**Trade-off:** Validation feedback after API call instead of instant client-side, but backend remains authoritative.

---

## 📊 Features

✅ **Core Requirements:**

- IP validation (IPv4/IPv6)
- Aggregated threat data from AbuseIPDB + IPQualityScore
- Clean, unified response format
- Error handling & rate limiting

✅ **Bonus Features:**

- Risk scoring with color-coded levels (Minimal/Low/Medium/High)
- Persistent search history (last 10 in localStorage)
- Graceful rate limit handling

---

## 🛠️ API Reference

### `GET /api/intel?ip=<address>`

**Response:**

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

### `GET /health`

Server health check.

---

## 📝 Development Notes

**Code Quality:**

- TypeScript strict mode
- ESLint + consistent formatting
- Meaningful tests (not just coverage)
- Structured logging (Pino)

**Security:**

- Environment-based API keys
- Rate limiting (10 req/min)
- 10s request timeouts
- CORS configuration

---

## 🔮 Production Considerations

If scaling to production, consider:

- Graceful degradation with `Promise.allSettled()`
- Response caching with TTL
- Database-backed history
- Circuit breakers for API failures
- User authentication
- Bulk IP checking

---

## 👤 Author

Ido Ronen  
Home Assignment - Full-Stack Developer Position
