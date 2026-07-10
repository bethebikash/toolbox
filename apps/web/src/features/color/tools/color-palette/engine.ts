export interface PaletteColor {
  hex:   string;
  name:  string;
  role:  string;
}

export interface Palette {
  name:   string;
  colors: PaletteColor[];
}

function hexToHsl(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0,2),16)/255;
  const g = parseInt(clean.slice(2,4),16)/255;
  const b = parseInt(clean.slice(4,6),16)/255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  const l = (max+min)/2;
  if (max===min) return [0,0,Math.round(l*100)];
  const d = max-min;
  const s = l>0.5 ? d/(2-max-min) : d/(max+min);
  let h = 0;
  if (max===r) h=((g-b)/d+(g<b?6:0))/6;
  else if (max===g) h=((b-r)/d+2)/6;
  else h=((r-g)/d+4)/6;
  return [Math.round(h*360), Math.round(s*100), Math.round(l*100)];
}

function hslToHex(h: number, s: number, l: number): string {
  const sn=s/100, ln=l/100, a=sn*Math.min(ln,1-ln);
  const f=(n:number)=>{ const k=(n+h/30)%12; return Math.round(255*(ln-a*Math.max(Math.min(k-3,9-k,1),-1))); };
  return '#'+[f(0),f(8),f(4)].map(n=>n.toString(16).padStart(2,'0')).join('');
}

export function generatePalette(baseHex: string): Palette[] {
  const [h, s, l] = hexToHsl(baseHex);

  const complementH = (h + 180) % 360;
  const triadic1H   = (h + 120) % 360;
  const triadic2H   = (h + 240) % 360;
  const analog1H    = (h + 30)  % 360;
  const analog2H    = (h - 30 + 360) % 360;

  return [
    {
      name: 'Monochromatic',
      colors: [
        { hex: hslToHex(h, s, Math.max(10, l-30)), name: 'Dark',    role: 'dark' },
        { hex: hslToHex(h, s, Math.max(10, l-15)), name: 'Darker',  role: 'darker' },
        { hex: baseHex,                              name: 'Base',    role: 'base' },
        { hex: hslToHex(h, s, Math.min(90, l+15)), name: 'Lighter', role: 'lighter' },
        { hex: hslToHex(h, s, Math.min(90, l+30)), name: 'Light',   role: 'light' },
      ],
    },
    {
      name: 'Complementary',
      colors: [
        { hex: baseHex,                        name: 'Primary',     role: 'primary' },
        { hex: hslToHex(h, s, Math.min(90,l+20)), name: 'Primary Light', role: 'primary-light' },
        { hex: hslToHex(complementH, s, l),   name: 'Complement',  role: 'complement' },
        { hex: hslToHex(complementH, s, Math.min(90,l+20)), name: 'Complement Light', role: 'complement-light' },
        { hex: hslToHex(h, Math.max(0,s-30), Math.min(90,l+40)), name: 'Neutral', role: 'neutral' },
      ],
    },
    {
      name: 'Triadic',
      colors: [
        { hex: baseHex,                       name: 'Primary',  role: 'primary' },
        { hex: hslToHex(triadic1H, s, l),    name: 'Secondary', role: 'secondary' },
        { hex: hslToHex(triadic2H, s, l),    name: 'Tertiary',  role: 'tertiary' },
        { hex: hslToHex(h, s, Math.min(90,l+30)), name: 'Light', role: 'light' },
        { hex: hslToHex(h, Math.max(0,s-40), 95), name: 'Background', role: 'bg' },
      ],
    },
    {
      name: 'Analogous',
      colors: [
        { hex: hslToHex(analog2H, s, l), name: 'Warm',    role: 'warm' },
        { hex: hslToHex(analog1H, s, l), name: 'Warm Base', role: 'warm-base' },
        { hex: baseHex,                   name: 'Base',    role: 'base' },
        { hex: hslToHex((h-15+360)%360, s, l), name: 'Cool Base', role: 'cool-base' },
        { hex: hslToHex((h-30+360)%360, s, l), name: 'Cool', role: 'cool' },
      ],
    },
  ];
}

export const meta = { ready: true };
