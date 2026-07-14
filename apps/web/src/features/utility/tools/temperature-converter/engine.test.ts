import { describe, it, expect } from 'vitest';
import { convertTemperature } from './engine';

describe('convertTemperature', () => {
  it('0°C = 32°F', () => {
    const r = convertTemperature(0, 'celsius');
    expect(r.fahrenheit).toBe(32);
    expect(r.kelvin).toBe(273.15);
  });

  it('100°C = 212°F', () => {
    const r = convertTemperature(100, 'celsius');
    expect(r.fahrenheit).toBe(212);
  });

  it('32°F = 0°C', () => {
    const r = convertTemperature(32, 'fahrenheit');
    expect(r.celsius).toBe(0);
  });

  it('0K = -273.15°C', () => {
    const r = convertTemperature(0, 'kelvin');
    expect(r.celsius).toBe(-273.15);
  });
});
