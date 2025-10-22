import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { intelRouter } from './ip-check.router.js';

describe('IP Check Route - Validation', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use('/api/intel', intelRouter);
  });

  it('should return 400 for invalid IP address', async () => {
    const response = await request(app).get('/api/intel').query({ ip: 'invalid-ip' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation Error');
    expect(response.body.message).toContain('Invalid IP address format');
  });

  it('should return 400 for malformed IP addresses', async () => {
    const testCases = ['192.168.1', '192.168.1.256', 'google.com'];

    for (const ip of testCases) {
      const response = await request(app).get('/api/intel').query({ ip });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation Error');
    }
  });

  it('should return 400 when IP parameter is missing', async () => {
    const response = await request(app).get('/api/intel');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation Error');
    expect(response.body.statusCode).toBe(400);
  });
});
