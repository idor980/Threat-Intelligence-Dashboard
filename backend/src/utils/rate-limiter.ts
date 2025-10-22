import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for the threat intelligence API
 * Limits: 10 requests per minute per IP address
 */
export const ipCheckRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  handler: (_req, res) => {
    res.status(429).json({
      error: 'Rate Limit Error',
      message: 'Too many requests. Please try again in a minute.',
      statusCode: 429,
      retryAfter: '60 seconds',
    });
  },
});
