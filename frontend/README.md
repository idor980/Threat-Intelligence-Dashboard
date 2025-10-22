## 🏗️ Architecture

```
src/
├── components/       # React components (IP input, results, history, errors)
├── store/           # Zustand state management
├── services/        # API client (Axios)
├── utils/           # Risk calculation, localStorage
└── types/           # TypeScript interfaces
```

**State Flow:**

```
User Input → Zustand Store → API Service → Update Store → Re-render Components
```

**Key Features:**

- Zustand for global state (data, loading, error, history)
- localStorage persistence for last 10 searches
- Risk level calculation from abuse + threat scores
- Error clearing on new input

## 🎨 Components

| Component           | Purpose                              |
| ------------------- | ------------------------------------ |
| `IPChecker`         | Main form + orchestration            |
| `ThreatDataDisplay` | Results with color-coded risk levels |
| `SearchHistory`     | Last 10 searches with timestamps     |
| `ErrorAlert`        | User-friendly error messages         |
| `PageHeader`        | Branding                             |

## 🎯 Risk Level Logic

Takes max(abuseScore, threatScore)

- **Minimal Risk** (0-24): Green
- **Low Risk** (25-49): Yellow
- **Medium Risk** (50-74): Orange
- **High Risk** (75-100): Red

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool (fast HMR)
- **Zustand** - Lightweight state management
- **Tailwind CSS + Flowbite** - Styling + components
- **Axios** - HTTP client
- **Vitest + React Testing Library** - Testing

## 📝 Environment Variables

| Variable            | Required | Default                 | Description     |
| ------------------- | -------- | ----------------------- | --------------- |
| `VITE_API_BASE_URL` | No       | `http://localhost:3000` | Backend API URL |

## 🎨 UI/UX Highlights

- **Instant Feedback**: Loading spinner replaces button during checks
- **Error Handling**: Clear, actionable error messages
- **Auto-Clear Errors**: Errors disappear when user types
- **History Panel**: Click to reload previous searches
- **Visual Risk Indicators**: Color-coded borders and badges
