import { describe, it, expect } from 'vitest';
import { formatNumber } from './engine';

const opts = { locale: 'en-US', style: 'decimal' as const, currency: 'USD', decimals: 2, grouping: true };

describe('formatNumber', () => {
  it('formats decimal', () => {
    const r = formatNumber(1234567.89, opts);
    expect(r.formatted).toBe('1,234,567.89');
  });

  it('formats without grouping', () => {
    const r = formatNumber(1234567, { ...opts, grouping: false });
    expect(r.formatted).not.toContain(',');
  });

  it('formats currency', () => {
    const r = formatNumber(99.99, { ...opts, style: 'currency' });
    expect(r.formatted).toContain('99.99');
  });

  it('formats different locale', () => {
    const r = formatNumber(1234.56, { ...opts, locale: 'de-DE' });
    expect(r.formatted).toContain('.');  // German uses . as thousands separator
  });
});
