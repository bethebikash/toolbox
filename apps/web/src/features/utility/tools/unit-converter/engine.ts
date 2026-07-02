export type UnitCategory = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'speed' | 'data';

export interface Unit { id: string; label: string; toBase: (v: number) => number; fromBase: (v: number) => number; }

export const UNITS: Record<UnitCategory, Unit[]> = {
  length: [
    { id:'mm',   label:'Millimeter',  toBase: v => v / 1000,        fromBase: v => v * 1000 },
    { id:'cm',   label:'Centimeter',  toBase: v => v / 100,         fromBase: v => v * 100 },
    { id:'m',    label:'Meter',       toBase: v => v,                fromBase: v => v },
    { id:'km',   label:'Kilometer',   toBase: v => v * 1000,        fromBase: v => v / 1000 },
    { id:'in',   label:'Inch',        toBase: v => v * 0.0254,      fromBase: v => v / 0.0254 },
    { id:'ft',   label:'Foot',        toBase: v => v * 0.3048,      fromBase: v => v / 0.3048 },
    { id:'yd',   label:'Yard',        toBase: v => v * 0.9144,      fromBase: v => v / 0.9144 },
    { id:'mi',   label:'Mile',        toBase: v => v * 1609.344,    fromBase: v => v / 1609.344 },
  ],
  weight: [
    { id:'mg',   label:'Milligram',   toBase: v => v / 1000000,     fromBase: v => v * 1000000 },
    { id:'g',    label:'Gram',        toBase: v => v / 1000,        fromBase: v => v * 1000 },
    { id:'kg',   label:'Kilogram',    toBase: v => v,                fromBase: v => v },
    { id:'t',    label:'Metric ton',  toBase: v => v * 1000,        fromBase: v => v / 1000 },
    { id:'oz',   label:'Ounce',       toBase: v => v * 0.0283495,   fromBase: v => v / 0.0283495 },
    { id:'lb',   label:'Pound',       toBase: v => v * 0.453592,    fromBase: v => v / 0.453592 },
    { id:'st',   label:'Stone',       toBase: v => v * 6.35029,     fromBase: v => v / 6.35029 },
  ],
  temperature: [
    { id:'c',    label:'Celsius',     toBase: v => v,                fromBase: v => v },
    { id:'f',    label:'Fahrenheit',  toBase: v => (v - 32) * 5/9,  fromBase: v => v * 9/5 + 32 },
    { id:'k',    label:'Kelvin',      toBase: v => v - 273.15,      fromBase: v => v + 273.15 },
  ],
  area: [
    { id:'mm2',  label:'mm²',         toBase: v => v / 1e6,         fromBase: v => v * 1e6 },
    { id:'cm2',  label:'cm²',         toBase: v => v / 1e4,         fromBase: v => v * 1e4 },
    { id:'m2',   label:'m²',          toBase: v => v,                fromBase: v => v },
    { id:'km2',  label:'km²',         toBase: v => v * 1e6,         fromBase: v => v / 1e6 },
    { id:'ha',   label:'Hectare',     toBase: v => v * 1e4,         fromBase: v => v / 1e4 },
    { id:'ac',   label:'Acre',        toBase: v => v * 4046.86,     fromBase: v => v / 4046.86 },
    { id:'ft2',  label:'ft²',         toBase: v => v * 0.0929,      fromBase: v => v / 0.0929 },
    { id:'mi2',  label:'mi²',         toBase: v => v * 2.59e6,      fromBase: v => v / 2.59e6 },
  ],
  volume: [
    { id:'ml',   label:'Milliliter',  toBase: v => v / 1000,        fromBase: v => v * 1000 },
    { id:'l',    label:'Liter',       toBase: v => v,                fromBase: v => v },
    { id:'m3',   label:'m³',          toBase: v => v * 1000,        fromBase: v => v / 1000 },
    { id:'tsp',  label:'Teaspoon',    toBase: v => v * 0.00492892,  fromBase: v => v / 0.00492892 },
    { id:'tbsp', label:'Tablespoon',  toBase: v => v * 0.0147868,   fromBase: v => v / 0.0147868 },
    { id:'cup',  label:'Cup',         toBase: v => v * 0.236588,    fromBase: v => v / 0.236588 },
    { id:'pt',   label:'Pint',        toBase: v => v * 0.473176,    fromBase: v => v / 0.473176 },
    { id:'qt',   label:'Quart',       toBase: v => v * 0.946353,    fromBase: v => v / 0.946353 },
    { id:'gal',  label:'Gallon',      toBase: v => v * 3.78541,     fromBase: v => v / 3.78541 },
  ],
  speed: [
    { id:'mps',  label:'m/s',         toBase: v => v,                fromBase: v => v },
    { id:'kph',  label:'km/h',        toBase: v => v / 3.6,         fromBase: v => v * 3.6 },
    { id:'mph',  label:'mph',         toBase: v => v * 0.44704,     fromBase: v => v / 0.44704 },
    { id:'kt',   label:'Knot',        toBase: v => v * 0.514444,    fromBase: v => v / 0.514444 },
    { id:'fps',  label:'ft/s',        toBase: v => v * 0.3048,      fromBase: v => v / 0.3048 },
  ],
  data: [
    { id:'b',    label:'Bit',         toBase: v => v / 8,            fromBase: v => v * 8 },
    { id:'B',    label:'Byte',        toBase: v => v,                fromBase: v => v },
    { id:'KB',   label:'Kilobyte',    toBase: v => v * 1024,        fromBase: v => v / 1024 },
    { id:'MB',   label:'Megabyte',    toBase: v => v * 1048576,     fromBase: v => v / 1048576 },
    { id:'GB',   label:'Gigabyte',    toBase: v => v * 1073741824,  fromBase: v => v / 1073741824 },
    { id:'TB',   label:'Terabyte',    toBase: v => v * 1099511627776, fromBase: v => v / 1099511627776 },
  ],
};

export function convert(value: number, fromId: string, toId: string, category: UnitCategory): number {
  const units   = UNITS[category];
  const fromUnit = units.find(u => u.id === fromId);
  const toUnit   = units.find(u => u.id === toId);
  if (!fromUnit || !toUnit) return NaN;
  return toUnit.fromBase(fromUnit.toBase(value));
}

export function formatResult(n: number): string {
  if (isNaN(n) || !isFinite(n)) return '—';
  if (Math.abs(n) < 0.000001 && n !== 0) return n.toExponential(4);
  if (Math.abs(n) >= 1e10) return n.toExponential(4);
  return parseFloat(n.toPrecision(10)).toString();
}

export const CATEGORY_LABELS: Record<UnitCategory, string> = {
  length: 'Length', weight: 'Weight', temperature: 'Temperature',
  area: 'Area', volume: 'Volume', speed: 'Speed', data: 'Data',
};

export const meta = { ready: true };
