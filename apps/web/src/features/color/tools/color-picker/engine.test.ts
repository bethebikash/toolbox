import { describe, it, expect } from 'vitest';
import { hexToRgb, rgbToHex, rgbToHsl, parseColor, generateShades } from './engine';

describe('hexToRgb', () => {
  it('parses full hex', () => expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 }));
  it('parses short hex', () => expect(hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0 }));
  it('parses white', () => expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 }));
  it('parses black', () => expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 }));
});

describe('rgbToHex', () => {
  it('converts red', () => expect(rgbToHex(255, 0, 0)).toBe('#ff0000'));
  it('converts white', () => expect(rgbToHex(255, 255, 255)).toBe('#ffffff'));
  it('rounds trip', () => {
    const { r, g, b } = hexToRgb('#2e7cf6');
    expect(rgbToHex(r, g, b)).toBe('#2e7cf6');
  });
});

describe('rgbToHsl', () => {
  it('red is 0° hue', () => expect(rgbToHsl(255, 0, 0).h).toBe(0));
  it('green is 120° hue', () => expect(rgbToHsl(0, 255, 0).h).toBe(120));
  it('blue is 240° hue', () => expect(rgbToHsl(0, 0, 255).h).toBe(240));
  it('white has 100% lightness', () => expect(rgbToHsl(255, 255, 255).l).toBe(100));
  it('black has 0% lightness', () => expect(rgbToHsl(0, 0, 0).l).toBe(0));
});

describe('parseColor', () => {
  it('returns all formats', () => {
    const c = parseColor('#2e7cf6');
    expect(c.hex).toBe('#2E7CF6');
    expect(c.rgb.r).toBe(46);
    expect(c.hsl.h).toBeGreaterThan(200);
    expect(c.cmyk.k).toBeDefined();
  });
});

describe('generateShades', () => {
  it('returns correct count', () => {
    expect(generateShades('#2e7cf6', 9).length).toBe(9);
    expect(generateShades('#2e7cf6', 5).length).toBe(5);
  });
  it('all are valid hex', () => {
    generateShades('#2e7cf6').forEach(hex => {
      expect(hex).toMatch(/^#[0-9a-f]{6}$/);
    });
  });
});
