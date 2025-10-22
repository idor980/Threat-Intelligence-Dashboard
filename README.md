# Threat Intelligence Dashboard

A full-stack application for checking IP addresses against multiple threat intelligence sources.

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **State Management**: Zustand
- **API Clients**: Axios
- **Validation**: Zod

### Project Structure

```
threat-intelligence-dashboard/
├── frontend/          # React application
├── backend/           # Node.js BFF (Backend-for-Frontend)
└── shared/            # Shared TypeScript types
```

## 🔑 Key Design Decisions

### 1. Always Fetch Fresh Data (No Caching)

Each IP lookup triggers a new API call to the external services instead of serving cached results.

**Rationale:**

- **Time-Sensitive Data**: Threat intelligence values (abuse scores, VPN/proxy flags, etc.) can change frequently as new reports arrive.
- **Transparency**: Each result includes a timestamp so users know exactly when it was fetched.
- **User Intent**: The history panel allows revisiting past results, while "Check" explicitly requests a fresh lookup.

**Trade-off:**
This approach consumes more API quota but guarantees up-to-date information.
_(In production, a caching layer or TTL-based refresh strategy could balance accuracy and efficiency.)_

---

### 2. Backend-Only IP Validation

IP format validation is handled exclusively on the backend, not duplicated in the frontend.

**Rationale:**

- **Single Source of Truth**: Uses Node's native `net.isIP()` for reliable, centralized validation.
- **Separation of Concerns**: The frontend focuses on user interaction and display; the backend enforces logic and data integrity.
- **Simplicity**: Avoids maintaining different validation approaches or custom regex logic, since Node's `net` library is only available on the backend.

**Trade-off:**
Users receive validation feedback only after the backend request.
_(In production, client-side pre-validation could improve UX, but backend validation would remain authoritative.)_

---

### Fail-All Approach for API Aggregation

**This application uses a "fail-all" strategy** when aggregating data from external threat intelligence APIs (AbuseIPDB and IPQualityScore).

#### Why Fail-All?

1. **Data Completeness for Accurate Risk Assessment**
   - A threat intelligence dashboard requires complete data to provide accurate risk assessments
   - Missing the abuse score OR VPN/threat detection could lead to misleading conclusions
   - Partial data might give users false confidence about IP safety

2. **Core Requirement Fulfillment**
   - Both APIs provide essential, non-overlapping data:
     - **AbuseIPDB**: Abuse confidence score, recent reports, geolocation
     - **IPQualityScore**: VPN/Proxy detection, fraud score
   - Neither API alone provides sufficient information

3. **Simplified Error Handling**
   - Clear error messages inform users when data is unavailable
   - No ambiguity about data completeness
   - Easier to maintain and debug

4. **Implementation**
   ```typescript
   // Using Promise.all() - fails fast if any API fails
   const [abuseData, ipQualityData] = await Promise.all([
     this.abuseIPDBService.checkIP(ipAddress),
     this.ipQualityScoreService.checkIP(ipAddress),
   ]);
   ```

#### Trade-offs Considered

**Pros:**

- ✅ Guarantees data completeness
- ✅ Simpler codebase
- ✅ Clear error states
- ✅ No ambiguous risk assessments

**Cons:**

- ❌ Service unavailable if one API is down
- ❌ No partial data fallback

**Verdict**: For this threat intelligence use case, **data accuracy is more important than availability**. The fail-all approach is the right choice.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- API Keys for:
  - [AbuseIPDB](https://www.abuseipdb.com/api.html)
  - [IPQualityScore](https://www.ipqualityscore.com/documentation/ip-reputation-api/overview)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd threat-intelligence-dashboard
   ```

2. **Install root dependencies**

   ```bash
   npm install
   ```

3. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

4. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

Create a `.env` file in the `backend` directory:

```bash
cd backend
cat > .env << EOF
# Server Configuration
PORT=3000
NODE_ENV=development

# API Keys
ABUSEIPDB_API_KEY=your_abuseipdb_api_key_here
IPQUALITYSCORE_API_KEY=your_ipqualityscore_api_key_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10
EOF
```

**API Keys for Testing** (provided in assignment):

- AbuseIPDB: `f94b904c9f414170343d0a5a61948dfbc0b55a6eaa0a50a3489e1e66b17ead6527975834e0d9`
- IPQualityScore: `mDdEouFdaAG4XvsfCmR6LAWTvARwyRb9`

### Running the Application

#### Development Mode

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:3000`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

#### Production Build

**Backend:**

```bash
cd backend
npm run build
npm start
```

**Frontend:**

```bash
cd frontend
npm run build
npm run preview
```

---

## 🧪 Testing

### Run Backend Tests

```bash
cd backend
npm test
```

### Run Frontend Tests

```bash
cd frontend
npm test
```

---

## 📊 Features

### Core Features

- ✅ IP address validation (IPv4 and IPv6)
- ✅ Real-time threat intelligence aggregation
- ✅ Data from multiple sources (AbuseIPDB + IPQualityScore)
- ✅ Clean, unified data format
- ✅ Comprehensive error handling
- ✅ Rate limiting protection

### Bonus Features

- ✅ **Risk Scoring & Highlighting**: Visual color-coded risk levels (Low/Medium/High)
- ✅ **Persistent Search History**: Last 10 searches stored in localStorage
- ✅ **Rate Limit Handling**: Graceful error messages for API rate limits

### Data Fields Displayed

| Field              | Source         | Description               |
| ------------------ | -------------- | ------------------------- |
| IP Address         | Input          | The validated IP address  |
| Hostname           | Both           | Hostname if available     |
| ISP                | Both           | Internet Service Provider |
| Country            | AbuseIPDB      | Geolocation country       |
| Abuse Score        | AbuseIPDB      | Abuse confidence (0-100)  |
| Recent Reports     | AbuseIPDB      | Number of abuse reports   |
| VPN/Proxy Detected | IPQualityScore | VPN/Proxy detection       |
| Threat Score       | IPQualityScore | Fraud/threat score        |

---

## 🛠️ API Endpoints

### Backend BFF API

#### Check IP Address

```http
GET /api/ip-check?ip=8.8.8.8
```

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

#### Health Check

```http
GET /api/health
```

---

## 🎨 Frontend Components

- **IPCheck**: Main input form and search functionality
- **ThreatData**: Displays threat intelligence results with risk visualization
- **History**: Shows recent search history with quick re-check
- **ErrorDisplay**: User-friendly error messages
- **PageHeader**: Application branding and navigation

---

## 📝 Development Notes

### Code Quality

- TypeScript strict mode enabled
- ESLint configured for both frontend and backend
- Shared types between frontend and backend
- Consistent error handling patterns
- Structured logging with Pino

### Security Considerations

- Input validation on both client and server
- API keys stored in environment variables
- Rate limiting to prevent abuse
- Timeout protection for external API calls
- CORS configured for local development

### Performance Optimizations

- Parallel API calls with `Promise.all()`
- Request timeouts (10s) to prevent hanging
- Efficient state management with Zustand
- localStorage for persistent history

---

## 🔮 Future Enhancements

If this were a production application, consider:

1. **Graceful Degradation**
   - Use `Promise.allSettled()` for partial data fallback
   - Implement circuit breakers for failing APIs
   - Cache responses to reduce API calls

2. **Enhanced Features**
   - Database storage for search history
   - User authentication and personal dashboards
   - Bulk IP checking
   - Export results to CSV/PDF
   - Real-time monitoring and alerts

3. **Observability**
   - Application performance monitoring (APM)
   - Structured logging aggregation
   - API health dashboards
   - Usage analytics

---

## 📄 License

This project is part of a home assignment for a Full-Stack Developer position.

---

## 👤 Author

Ido Ronen

---

## 📞 Support

For questions or issues, please contact the development team.
