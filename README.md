# Threat Intelligence Dashboard

Full-stack application for checking IP addresses against threat intelligence sources (AbuseIPDB + IPQualityScore).

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- API keys for [AbuseIPDB](https://www.abuseipdb.com/api.html) and [IPQualityScore](https://www.ipqualityscore.com/)

**Note:** Working API keys are provided in `.env.example` for easy testing.

### Setup

```bash
# Install all dependencies (root, backend, frontend)
npm run install:all

# Configure backend
cp backend/.env.example backend/.env

# Run in separate terminals
npm run dev:backend    # Backend: http://localhost:3000
npm run dev:frontend   # Frontend: http://localhost:5173
```

### Testing

```bash
npm run test:all          # Run all tests
npm run test:backend      # Backend tests only
npm run test:frontend     # Frontend tests only
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

**Detailed Documentation:**

- [Frontend README](./frontend/README.md) - Components, state management, UI/UX
- [Backend README](./backend/README.md) - API endpoints, security, logging

**Key Patterns:**

- Layered architecture: Routes → Aggregators → Clients
- Parallel API calls with `Promise.all()`
- Centralized error handling
- Shared types between frontend/backend

---

## 📊 Features

✅ **Core Requirements:**

- IP validation (IPv4/IPv6)
- Aggregated threat data from AbuseIPDB + IPQualityScore
- Clean, unified response format
- Error handling & rate limiting
- Unit tests for frontend and backend

✅ **Bonus Features:**

- Risk scoring with color-coded levels (Minimal/Low/Medium/High)
- Persistent search history (last 10 in localStorage)
- Graceful rate limit handling (429 responses)

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

Health check endpoint.

---

## 📋 Implementation Decisions

These are design choices made specifically for this assignment. They reflect trade-offs appropriate for the scope and requirements of the task.

### 1. Fail-All API Aggregation

Both AbuseIPDB and IPQualityScore must succeed, or the entire request fails.

**Rationale:**

- Ensures complete threat intelligence data for accurate risk assessment
- Prevents misleading users with partial data (e.g., missing VPN detection)
- Simplifies error handling by avoiding partial-data states

**Trade-off:** Service becomes unavailable if either API is down. For this assignment, data accuracy is prioritized over availability.

---

### 2. No Caching (Always Fresh Data)

Every IP check fetches fresh data from external APIs without caching.

**Rationale:**

- Threat intelligence is time-sensitive (scores update as new abuse reports arrive)
- Users expect real-time data when clicking "Check"
- Search history provides a way to review past results

**Trade-off:** Higher API quota consumption. For this assignment, freshness is prioritized to demonstrate real-time threat intelligence.

---

### 3. Backend-Only Validation

IP validation occurs exclusively on the backend using Node's native `net.isIP()`.

**Rationale:**

- Single source of truth prevents duplicate validation logic
- Node.js built-in validator is reliable and only available server-side
- Keeps business logic separate from UI concerns

**Trade-off:** Validation feedback requires a round-trip to the server. For this assignment, backend authority is prioritized for security validation.

---

## 📝 Development Note

Since the assignment did not mention any restrictions on using tools like **Cursor** or **ChatGPT**, I assumed it is acceptable to use them for **guidance, formatting, phrasing and answering questions** - as long as the usage is not excessive and it is clear that **the code was written by me**.

---
