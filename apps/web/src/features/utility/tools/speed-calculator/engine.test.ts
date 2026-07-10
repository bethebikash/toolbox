import { describe, it, expect } from 'vitest';
import { calcSpeed, convertSpeed, toMeters, toSeconds } from './engine';

describe('calcSpeed', () => {
  it('100m in 10s = 10 m/s', () => {
    const r = calcSpeed(100, 10);
    expect(r.speed).toBe(10);
    expect(r.allSpeeds.kph).toBeCloseTo(36, 0);
  });
});

describe('convertSpeed', () => {
  it('60 kph = 1 m/s × 3.6 reverse', () => {
    expect(convertSpeed(60, 'kph', 'mps')).toBeCloseTo(16.667, 2);
  });
});

describe('toMeters', () => {
  it('1 km = 1000m', () => expect(toMeters(1, 'km')).toBe(1000));
  it('1 mile ≈ 1609m', () => expect(toMeters(1, 'miles')).toBeCloseTo(1609, 0));
});

describe('toSeconds', () => {
  it('1 hour = 3600s', () => expect(toSeconds(1, 'hours')).toBe(3600));
  it('1 minute = 60s', () => expect(toSeconds(1, 'minutes')).toBe(60));
});
