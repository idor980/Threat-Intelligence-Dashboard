import express from 'express';
import { intelQuerySchema } from '@/validators/ipValidator.js';
import { ThreatIntelligenceAggregator } from '@/services/aggregation.js';
import { intelRateLimiter } from '@/middleware/rateLimiter.js';

const router = express.Router();
const aggregator = new ThreatIntelligenceAggregator();


router.get(
  '/',
  intelRateLimiter, // Apply rate limiting middleware
  async (req, res) => {
    try {
      console.error('🎯 Route handler called! Query params:', req.query);

      // Validate query parameters
      const validationResult = intelQuerySchema.safeParse(req.query);

      if (!validationResult.success) {
        res.status(400).json({
          error: 'Validation Error',
          message: validationResult.error.issues.map((e) => e.message).join(', '),
          statusCode: 400,
        });
        return;
      }

      const { ip, maxAgeInDays } = validationResult.data;

      // Fetch and aggregate threat intelligence data
      const response = await aggregator.aggregateThreatData(ip, maxAgeInDays);
      res.json(response);
    } catch (error) {
      console.error('❌ Error in route handler:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        statusCode: 500,
      });
    }
  }
);

export { router as intelRouter };
