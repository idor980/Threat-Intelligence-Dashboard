import { describe, it, expect } from 'vitest';
import { getRiskLevel } from './risk-level';

describe('Risk Level Calculation', () => {
  it('should return Minimal Risk for low scores', () => {
    const result = getRiskLevel(0, 0);
    expect(result.text).toBe('Minimal Risk');
    expect(result.score).toBe(0);
  });

  it('should return Low Risk for scores 25-49', () => {
    const result = getRiskLevel(30, 25);
    expect(result.text).toBe('Low Risk');
    expect(result.score).toBe(30);
  });

  it('should return Medium Risk for scores 50-74', () => {
    const result = getRiskLevel(60, 50);
    expect(result.text).toBe('Medium Risk');
    expect(result.score).toBe(60);
  });

  it('should return High Risk for scores 75+', () => {
    const result = getRiskLevel(100, 85);
    expect(result.text).toBe('High Risk');
    expect(result.score).toBe(100);
  });

  it('should use the maximum of abuseScore and threatScore', () => {
    expect(getRiskLevel(10, 80).score).toBe(80);
    expect(getRiskLevel(90, 20).score).toBe(90);
  });
});
