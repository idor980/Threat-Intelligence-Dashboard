import express from 'express';
import cors from 'cors';
import { healthRouter } from '@/routes/health.router.js';
import { intelRouter } from '@/routes/ip-check.router.js';
import { logger } from '@/utils/logger.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Allows frontend (running on a different port/domain) to talk to backend.
// Without this, browsers block cross-origin requests for security reasons.
app.use(cors());

// Routes
app.use('/health', healthRouter);
app.use('/api/intel', intelRouter);

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Backend server running on http://localhost:${PORT}`);
});

export { app };
