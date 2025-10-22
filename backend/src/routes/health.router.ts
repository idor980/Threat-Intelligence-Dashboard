import express from 'express';

const router = express.Router();

/**
 * Health check endpoint
 * Returns server status and timestamp
 */
router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export { router as healthRouter };
