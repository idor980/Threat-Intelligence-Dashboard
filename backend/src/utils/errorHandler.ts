import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: Error | ZodError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Default error values
  let statusCode = 500;
  let message = 'Internal server error';

  // Handle ZodError (validation errors)
  if (err instanceof ZodError) {
    statusCode = 400;
    message = err.issues.map((e) => e.message).join(', ');
  }
  // Handle known error messages
  else if (err.message) {
    // Rate limit error (from client or external APIs)
    if (err.message.includes('Rate limit')) {
      statusCode = 429;
      message = 'Rate limit reached. Please try again later.';
      console.error('⚠️ Rate limit error:', err.message);
    }
    // API key errors
    else if (err.message.includes('API key')) {
      statusCode = 500; // Don't expose API key issues to client
      message = 'Service temporarily unavailable';
      console.error('API Key Error:', err.message);
    }
    // Service unavailable
    else if (err.message.includes('unavailable') || err.message.includes('timeout')) {
      statusCode = 503;
      message = err.message;
    }
    // Bad request
    else if (err.message.includes('Bad request') || err.message.includes('Invalid')) {
      statusCode = 400;
      message = err.message;
    }
    // Generic error with message
    else {
      message = err.message;
    }
  }

  // Log error for debugging (in production, use proper logging service)
  if (statusCode >= 500) {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
    });
  }

  // Send error response
  res.status(statusCode).json({
    error: statusCode === 429 ? 'Rate Limit Error' : 'Error',
    message,
    statusCode,
    ...(process.env.NODE_ENV === 'development' && err.stack && { stack: err.stack }),
  });
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
