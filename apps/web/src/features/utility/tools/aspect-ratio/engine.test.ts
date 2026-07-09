import { describe, it, expect } from 'vitest';
import { calculateAspectRatio, scaleToWidth, scaleToHeight } from './engine';

describe('calculateAspectRatio', () => {
  it('1920x1080 = 16:9', () => {
    const r = calculateAspectRatio(1920, 1080);
    expect(r.ratio).toBe('16:9');
    expect(r.commonName).toBe('Widescreen HD');
  });

  it('1:1 for square', () => {
    expect(calculateAspectRatio(100, 100).ratio).toBe('1:1');
  });

  it('4:3 for classic', () => {
    expect(calculateAspectRatio(800, 600).ratio).toBe('4:3');
  });
});

describe('scaleToWidth', () => {
  it('scales 16:9 to 1280 wide', () => {
    const ratio = calculateAspectRatio(1920, 1080);
    const s     = scaleToWidth(ratio, 1280);
    expect(s.width).toBe(1280);
    expect(s.height).toBe(720);
  });
});

describe('scaleToHeight', () => {
  it('scales 16:9 to 720 tall', () => {
    const ratio = calculateAspectRatio(1920, 1080);
    const s     = scaleToHeight(ratio, 720);
    expect(s.width).toBe(1280);
  });
});
