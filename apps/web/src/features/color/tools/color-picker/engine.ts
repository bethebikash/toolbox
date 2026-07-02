export interface ColorValue {
  hex:  string;
  rgb:  { r: number; g: number; b: number };
  hsl:  { h: number; s: number; l: number };
  hsv:  { h: number; s: number; v: number };
  cmyk: { c: number; m: number; y: number; k: number };
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  const full  = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(n => n.toString(16).padStart(2, '0')).join('');
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const v = max, d = max - min;
  const s = max === 0 ? 0 : d / max;
  let h = 0;
  if (max !== min) {
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
    else if (max === gn) h = ((bn - rn) / d + 2) / 6;
    else h = ((rn - gn) / d + 4) / 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

export function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const k  = 1 - Math.max(rn, gn, bn);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - rn - k) / (1 - k)) * 100),
    m: Math.round(((1 - gn - k) / (1 - k)) * 100),
    y: Math.round(((1 - bn - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

export function parseColor(hex: string): ColorValue {
  const { r, g, b } = hexToRgb(hex);
  return {
    hex: hex.toUpperCase(),
    rgb:  { r, g, b },
    hsl:  rgbToHsl(r, g, b),
    hsv:  rgbToHsv(r, g, b),
    cmyk: rgbToCmyk(r, g, b),
  };
}

export function generateShades(hex: string, count = 9): string[] {
  const { r, g, b } = hexToRgb(hex);
  const { h, s }    = rgbToHsl(r, g, b);
  return Array.from({ length: count }, (_, i) => {
    const l  = 10 + (i / (count - 1)) * 80;
    return hslToHex(h, s, Math.round(l));
  });
}

function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100, ln = l / 100;
  const a  = sn * Math.min(ln, 1 - ln);
  const f  = (n: number) => {
    const k = (n + h / 30) % 12;
    const v = ln - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * v);
  };
  return rgbToHex(f(0), f(8), f(4));
}

export const meta = { ready: true };
