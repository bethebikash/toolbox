import { describe, it, expect } from 'vitest';
import { convert, formatResult } from './engine';

describe('convert', () => {
  it('m to km', () => expect(convert(1000, 'm', 'km', 'length')).toBeCloseTo(1));
  it('km to mi', () => expect(convert(1, 'km', 'mi', 'length')).toBeCloseTo(0.621371, 4));
  it('kg to lb', () => expect(convert(1, 'kg', 'lb', 'weight')).toBeCloseTo(2.20462, 4));
  it('C to F',   () => expect(convert(0, 'c', 'f', 'temperature')).toBeCloseTo(32));
  it('C to K',   () => expect(convert(0, 'c', 'k', 'temperature')).toBeCloseTo(273.15));
  it('same unit', () => expect(convert(42, 'm', 'm', 'length')).toBe(42));
  it('MB to KB', () => expect(convert(1, 'MB', 'KB', 'data')).toBe(1024));
});

describe('formatResult', () => {
  it('handles NaN', () => expect(formatResult(NaN)).toBe('—'));
  it('formats normal number', () => expect(formatResult(1.5)).toBe('1.5'));
});
