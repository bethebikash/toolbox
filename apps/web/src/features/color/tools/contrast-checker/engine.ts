export interface ContrastResult {
  ratio:           number;
  ratioFormatted:  string;
  aa_normal:       boolean;
  aa_large:        boolean;
  aaa_normal:      boolean;
  aaa_large:       boolean;
  level:           'Fail' | 'AA Large' | 'AA' | 'AAA';
  foreground:      string;
  background:      string;
  luminanceFg:     number;
  luminanceBg:     number;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const full  = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
  return [parseInt(full.slice(0,2),16), parseInt(full.slice(2,4),16), parseInt(full.slice(4,6),16)];
}

function relativeLuminance(r: number, g: number, b: number): number {
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function checkContrast(fg: string, bg: string): ContrastResult {
  const [fr, fg2, fb] = hexToRgb(fg);
  const [br, bg2, bb] = hexToRgb(bg);
  const lFg = relativeLuminance(fr, fg2, fb);
  const lBg = relativeLuminance(br, bg2, bb);
  const lighter = Math.max(lFg, lBg);
  const darker  = Math.min(lFg, lBg);
  const ratio   = (lighter + 0.05) / (darker + 0.05);
  const r       = Math.round(ratio * 100) / 100;

  const aa_normal  = ratio >= 4.5;
  const aa_large   = ratio >= 3;
  const aaa_normal = ratio >= 7;
  const aaa_large  = ratio >= 4.5;

  let level: ContrastResult['level'] = 'Fail';
  if (aaa_normal)     level = 'AAA';
  else if (aa_normal) level = 'AA';
  else if (aa_large)  level = 'AA Large';

  return {
    ratio: r, ratioFormatted: r.toFixed(2) + ':1',
    aa_normal, aa_large, aaa_normal, aaa_large,
    level, foreground: fg, background: bg,
    luminanceFg: Math.round(lFg * 1000) / 1000,
    luminanceBg: Math.round(lBg * 1000) / 1000,
  };
}

export function suggestColors(bg: string): { light: string; dark: string } {
  return { light: '#ffffff', dark: '#000000' };
}

export const meta = { ready: true };
