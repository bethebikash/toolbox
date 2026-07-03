import { describe, it, expect } from 'vitest';
import { formatBytes } from './engine';

describe('formatBytes', () => {
  it('formats bytes', () => expect(formatBytes(512)).toBe('512 B'));
  it('formats KB',    () => expect(formatBytes(2048)).toBe('2.0 KB'));
  it('formats MB',    () => expect(formatBytes(1024 * 1024)).toBe('1.00 MB'));
});
