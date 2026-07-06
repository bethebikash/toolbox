import { describe, it, expect } from 'vitest';
import { formatTime, parseTimeInput, formatBytes } from './engine';

describe('formatTime', () => {
  it('formats seconds only',      () => expect(formatTime(45)).toBe('0:45'));
  it('formats minutes + seconds', () => expect(formatTime(90)).toBe('1:30'));
  it('formats hours',             () => expect(formatTime(3661)).toBe('1:01:01'));
  it('pads single digit seconds', () => expect(formatTime(61)).toBe('1:01'));
});

describe('parseTimeInput', () => {
  it('parses mm:ss',   () => expect(parseTimeInput('1:30')).toBe(90));
  it('parses hh:mm:ss',() => expect(parseTimeInput('1:01:01')).toBe(3661));
  it('parses seconds', () => expect(parseTimeInput('45')).toBe(45));
});

describe('formatBytes', () => {
  it('formats bytes', () => expect(formatBytes(512)).toBe('512 B'));
  it('formats MB',    () => expect(formatBytes(1024 * 1024)).toBe('1.00 MB'));
});
