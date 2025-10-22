import express from 'express';
import { intelQuerySchema } from '@/validators/ipValidator.js';
import { ThreatIntelligenceAggregator } from '@/aggregators/threatIntelligence.js';
import { intelRateLimiter } from '@/middleware/rateLimiter.js';
import { logger } from '@/utils/logger.js';

const router = express.Router();
const aggregator = new ThreatIntelligenceAggregator();

router.get(
  '/',
  intelRateLimiter, // Apply rate limiting middleware
  async (req, res) => {
    try {
      logger.debug({ query: req.query }, '🎯 Route handler called');

      // Validate query parameters
      const validationResult = intelQuerySchema.safeParse(req.query);

      if (!validationResult.success) {
        const errorMessage = validationResult.error.issues.map((e) => e.message).join(', ');
        logger.warn({ error: errorMessage }, '⚠️ Validation failed');
        res.status(400).json({
          error: 'Validation Error',
          message: errorMessage,
          statusCode: 400,
        });
        return;
      }

      const { ip } = validationResult.data;

      // Fetch and aggregate threat intelligence data
      const response = await aggregator.aggregateThreatData(ip);
      res.json(response);
    } catch (error) {
      logger.error({ error }, '❌ Error in route handler');
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        statusCode: 500,
      });
    }
  }
);

export { router as intelRouter };
