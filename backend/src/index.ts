import express from 'express';
import cors from 'cors';
import { intelRouter } from '@/routes/intel.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Allows frontend (running on a different port/domain) to talk to backend.
// Without this, browsers block cross-origin requests for security reasons.
app.use(cors());


// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/intel', intelRouter);

// Start server (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  });
}

export { app };
