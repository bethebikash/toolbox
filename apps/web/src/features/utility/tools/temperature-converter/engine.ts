export interface TempResult {
  celsius:    number;
  fahrenheit: number;
  kelvin:     number;
  rankine:    number;
}

export type TempUnit = 'celsius' | 'fahrenheit' | 'kelvin' | 'rankine';

export const UNIT_LABELS: Record<TempUnit, string> = {
  celsius: 'Celsius (°C)', fahrenheit: 'Fahrenheit (°F)',
  kelvin: 'Kelvin (K)', rankine: 'Rankine (°R)',
};

export function convertTemperature(value: number, from: TempUnit): TempResult {
  let celsius: number;
  switch (from) {
    case 'celsius':    celsius = value; break;
    case 'fahrenheit': celsius = (value - 32) * 5/9; break;
    case 'kelvin':     celsius = value - 273.15; break;
    case 'rankine':    celsius = (value - 491.67) * 5/9; break;
  }
  const round = (n: number) => Math.round(n * 100) / 100;
  return {
    celsius:    round(celsius),
    fahrenheit: round(celsius * 9/5 + 32),
    kelvin:     round(celsius + 273.15),
    rankine:    round((celsius + 273.15) * 9/5),
  };
}

export const NOTABLE: { label: string; celsius: number }[] = [
  { label: 'Water freezes', celsius: 0 },
  { label: 'Body temperature', celsius: 37 },
  { label: 'Water boils', celsius: 100 },
  { label: 'Absolute zero', celsius: -273.15 },
  { label: 'Room temperature', celsius: 22 },
];

export const meta = { ready: true };
