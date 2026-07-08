export interface ColorFormats {
  hex:     string;
  rgb:     string;
  hsl:     string;
  hsv:     string;
  cmyk:    string;
  css:     string;
}

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '');
  const full  = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
  if (full.length !== 6) return null;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return [r, g, b];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r/255, gn = g/255, bn = b/255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  const rn = r/255, gn = g/255, bn = b/255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn), d = max - min;
  let h = 0;
  if (d > 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  return [h, Math.round(max === 0 ? 0 : (d / max) * 100), Math.round(max * 100)];
}

function rgbToCmyk(r: number, g: number, b: number): [number, number, number, number] {
  const rn = r/255, gn = g/255, bn = b/255;
  const k  = 1 - Math.max(rn, gn, bn);
  if (k === 1) return [0, 0, 0, 100];
  return [
    Math.round(((1 - rn - k) / (1 - k)) * 100),
    Math.round(((1 - gn - k) / (1 - k)) * 100),
    Math.round(((1 - bn - k) / (1 - k)) * 100),
    Math.round(k * 100),
  ];
}

export function parseColor(input: string): ColorFormats | null {
  let r: number, g: number, b: number;
  const trimmed = input.trim();

  // HEX
  if (trimmed.startsWith('#') || /^[0-9a-fA-F]{3,6}$/.test(trimmed)) {
    const rgb = hexToRgb(trimmed.startsWith('#') ? trimmed : '#' + trimmed);
    if (!rgb) return null;
    [r, g, b] = rgb;
  }
  // RGB
  else if (/^rgb\s*\(/i.test(trimmed)) {
    const m = trimmed.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (!m) return null;
    [r, g, b] = [parseInt(m[1]!), parseInt(m[2]!), parseInt(m[3]!)];
  }
  // HSL
  else if (/^hsl\s*\(/i.test(trimmed)) {
    const m = trimmed.match(/(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/);
    if (!m) return null;
    const [h, s, l] = [parseInt(m[1]!), parseInt(m[2]!), parseInt(m[3]!)];
    const sn = s / 100, ln = l / 100;
    const a  = sn * Math.min(ln, 1 - ln);
    const f  = (n: number) => {
      const k = (n + h / 30) % 12;
      return Math.round(255 * (ln - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)));
    };
    [r, g, b] = [f(0), f(8), f(4)];
  }
  else return null;

  if (r! < 0 || r! > 255 || g! < 0 || g! > 255 || b! < 0 || b! > 255) return null;

  const hex  = '#' + [r!, g!, b!].map(n => n.toString(16).padStart(2, '0')).join('').toUpperCase();
  const [h, s, l]    = rgbToHsl(r!, g!, b!);
  const [hv, sv, v]  = rgbToHsv(r!, g!, b!);
  const [c, m2, y, k] = rgbToCmyk(r!, g!, b!);

  return {
    hex,
    rgb:  `rgb(${r}, ${g}, ${b})`,
    hsl:  `hsl(${h}, ${s}%, ${l}%)`,
    hsv:  `hsv(${hv}, ${sv}%, ${v}%)`,
    cmyk: `cmyk(${c}%, ${m2}%, ${y}%, ${k}%)`,
    css:  `color: ${hex};`,
  };
}

export const meta = { ready: true };
