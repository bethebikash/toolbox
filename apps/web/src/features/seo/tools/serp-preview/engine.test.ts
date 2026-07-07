import { describe, it, expect } from 'vitest';
import { getTitleStatus, getDescStatus, truncate } from './engine';

describe('getTitleStatus', () => {
  it('ok for good length',   () => expect(getTitleStatus('A'.repeat(45)).ok).toBe(true));
  it('fail for too short',   () => expect(getTitleStatus('Short').ok).toBe(false));
  it('fail for too long',    () => expect(getTitleStatus('A'.repeat(65)).ok).toBe(false));
});

describe('getDescStatus', () => {
  it('ok for good length',   () => expect(getDescStatus('A'.repeat(100)).ok).toBe(true));
  it('fail for too short',   () => expect(getDescStatus('Short').ok).toBe(false));
  it('fail for too long',    () => expect(getDescStatus('A'.repeat(165)).ok).toBe(false));
});

describe('truncate', () => {
  it('does not truncate short strings', () => expect(truncate('hi', 600)).toBe('hi'));
  it('truncates long strings',          () => expect(truncate('A'.repeat(200), 600).endsWith('…')).toBe(true));
});
