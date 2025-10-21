import express from 'express';
import cors from 'cors';
import { intelRouter } from '@/routes/intel.js';
import { errorHandler } from '@/utils/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
/**  Allows your frontend (running on a different port/domain) to talk to your backend.
 *   Without this, browsers block cross-origin requests for security reasons.
 */
app.use(cors());
/** Parses incoming JSON data in request bodies.
 * Without this, req.body would be undefined when clients send JSON data.
 */
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/intel', intelRouter);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  });
}

export { app };
