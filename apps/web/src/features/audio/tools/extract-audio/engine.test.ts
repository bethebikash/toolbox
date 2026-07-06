import { describe, it, expect } from 'vitest';
import { FORMAT_LABELS, FORMAT_MIME, formatBytes } from './engine';

describe('FORMAT_LABELS', () => {
  it('has all formats', () => {
    expect(FORMAT_LABELS.mp3).toBe('MP3');
    expect(FORMAT_LABELS.wav).toBe('WAV');
    expect(FORMAT_LABELS.flac).toBe('FLAC');
  });
});

describe('FORMAT_MIME', () => {
  it('has correct MIME for mp3', () => expect(FORMAT_MIME.mp3).toBe('audio/mpeg'));
  it('has correct MIME for wav', () => expect(FORMAT_MIME.wav).toBe('audio/wav'));
});

describe('formatBytes', () => {
  it('formats bytes', () => expect(formatBytes(512)).toBe('512 B'));
  it('formats MB',    () => expect(formatBytes(1024 * 1024)).toBe('1.00 MB'));
});
