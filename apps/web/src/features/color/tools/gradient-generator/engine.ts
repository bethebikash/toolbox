export type GradientType = 'linear' | 'radial' | 'conic';
export type GradientDirection =
  | 'to right' | 'to left' | 'to bottom' | 'to top'
  | 'to bottom right' | 'to bottom left' | 'to top right' | 'to top left'
  | string; // custom angle e.g. "135deg"

export interface ColorStop {
  id:       string;
  color:    string;
  position: number; // 0–100
}

export interface GradientOptions {
  type:       GradientType;
  direction:  GradientDirection;
  stops:      ColorStop[];
}

export const DEFAULT_GRADIENT: GradientOptions = {
  type:      'linear',
  direction: 'to right',
  stops: [
    { id: '1', color: '#2E7CF6', position: 0 },
    { id: '2', color: '#10B981', position: 100 },
  ],
};

export function generateCSS(opts: GradientOptions): string {
  const stops = [...opts.stops]
    .sort((a, b) => a.position - b.position)
    .map(s => `${s.color} ${s.position}%`)
    .join(', ');

  if (opts.type === 'linear') {
    return `linear-gradient(${opts.direction}, ${stops})`;
  }
  if (opts.type === 'radial') {
    return `radial-gradient(circle, ${stops})`;
  }
  return `conic-gradient(from 0deg, ${stops})`;
}

export function generateTailwind(opts: GradientOptions): string {
  const from = opts.stops[0]?.color ?? '#000';
  const to   = opts.stops[opts.stops.length - 1]?.color ?? '#fff';
  return `bg-gradient-to-r from-[${from}] to-[${to}]`;
}

export function generateSCSS(opts: GradientOptions): string {
  const css = generateCSS(opts);
  return `$gradient: ${css};\n\n.element {\n  background: $gradient;\n}`;
}

export const DIRECTIONS = [
  { label: '→',   value: 'to right' },
  { label: '←',   value: 'to left' },
  { label: '↓',   value: 'to bottom' },
  { label: '↑',   value: 'to top' },
  { label: '↘',   value: 'to bottom right' },
  { label: '↙',   value: 'to bottom left' },
  { label: '↗',   value: 'to top right' },
  { label: '↖',   value: 'to top left' },
];

export const PRESETS: { name: string; stops: Omit<ColorStop, 'id'>[] }[] = [
  { name: 'Ocean',    stops: [{ color: '#2E7CF6', position: 0 }, { color: '#10B981', position: 100 }] },
  { name: 'Sunset',   stops: [{ color: '#F97316', position: 0 }, { color: '#EF4444', position: 50 }, { color: '#8B5CF6', position: 100 }] },
  { name: 'Neon',     stops: [{ color: '#00F5FF', position: 0 }, { color: '#FF00FF', position: 100 }] },
  { name: 'Gold',     stops: [{ color: '#F59E0B', position: 0 }, { color: '#FCD34D', position: 50 }, { color: '#D97706', position: 100 }] },
  { name: 'Midnight', stops: [{ color: '#1E293B', position: 0 }, { color: '#4F46E5', position: 100 }] },
  { name: 'Rose',     stops: [{ color: '#F43F5E', position: 0 }, { color: '#FB923C', position: 100 }] },
  { name: 'Forest',   stops: [{ color: '#14532D', position: 0 }, { color: '#84CC16', position: 100 }] },
  { name: 'Sky',      stops: [{ color: '#BAE6FD', position: 0 }, { color: '#0EA5E9', position: 100 }] },
];

export const meta = { ready: true };
