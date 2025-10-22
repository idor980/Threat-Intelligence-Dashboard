# Threat Intelligence Dashboard - Frontend

A modern React-based web application for checking IP addresses against threat intelligence databases.

## Features

- 🔍 **IP Address Lookup**: Check any IP address for threat intelligence data
- 🎯 **Risk Assessment**: Get abuse scores and risk levels for IP addresses
- 🌍 **Location & ISP Info**: View geographical and ISP information
- 🚨 **Threat Indicators**: See recent abuse reports, VPN detection, and threat scores
- ⚡ **Real-time Updates**: Instant feedback with loading and error states
- 🎨 **Modern UI**: Beautiful interface built with Flowbite React and Tailwind CSS

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Zustand** - State management
- **Flowbite React** - UI component library
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (default: http://localhost:3001)

## Getting Started

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the frontend directory (or copy from `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:3001
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/         # React components
│   └── IPChecker.tsx  # Main IP checker component
├── services/          # API services
│   └── api.ts        # Axios configuration and API calls
├── store/            # Zustand stores
│   └── ipCheckStore.ts # IP check state management
├── types/            # TypeScript type definitions
│   └── index.ts      # Shared types
├── App.tsx           # Main app component
└── main.tsx          # Application entry point
```

## Usage

1. Enter an IP address in the input field (e.g., `8.8.8.8`)
2. Click the "Check" button or press Enter
3. View the threat intelligence results including:
   - Abuse confidence score
   - Risk level assessment
   - Country and ISP information
   - Recent abuse reports
   - VPN detection status
   - Threat score

## State Management

The application uses Zustand for state management with the following store:

- `ipCheckStore`: Manages IP check state (data, loading, error)
  - `checkIP(ip: string, maxAgeInDays?: number)`: Fetches threat data for an IP
  - `reset()`: Resets the state

## API Integration

The frontend communicates with the backend API at `/api/intel`:

```typescript
GET /api/intel?ip=<ip_address>&maxAgeInDays=<days>
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests

## Contributing

1. Follow the existing code style
2. Use TypeScript for type safety
3. Write meaningful commit messages
4. Test your changes before submitting

## License

See the main project LICENSE file.
