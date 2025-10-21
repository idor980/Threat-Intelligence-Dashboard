import express from 'express';
import { intelQuerySchema } from '@/validators/ipValidator.js';
import { ThreatIntelligenceAggregator } from '@/services/aggregation.js';
import { asyncHandler } from '@/utils/errorHandler.js';

const router = express.Router();
const aggregator = new ThreatIntelligenceAggregator();

/**
 * GET /api/intel?ip=<ip_address>&maxAgeInDays=<days>
 *
 * Query an IP address for threat intelligence data
 *
 * @param ip - IP address to check (required)
 * @param maxAgeInDays - Maximum age of reports in days (optional, default: 90, range: 1-365)
 *
 * @returns Aggregated threat intelligence data with risk level
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
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
  })
);

export { router as intelRouter };
