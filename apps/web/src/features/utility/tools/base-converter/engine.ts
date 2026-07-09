export type Base = 2 | 8 | 10 | 16;

export interface BaseResult {
  binary:      string;
  octal:       string;
  decimal:     string;
  hexadecimal: string;
  input:       string;
  inputBase:   Base;
}

export function convertBase(input: string, fromBase: Base): BaseResult | null {
  const trimmed = input.trim().replace(/^0[xXoObB]/, '');
  if (!trimmed) return null;

  const decimal = parseInt(trimmed, fromBase);
  if (isNaN(decimal) || decimal < 0) return null;

  return {
    binary:      decimal.toString(2),
    octal:       decimal.toString(8),
    decimal:     decimal.toString(10),
    hexadecimal: decimal.toString(16).toUpperCase(),
    input:       trimmed,
    inputBase:   fromBase,
  };
}

export function formatWithSpaces(str: string, groupSize = 4): string {
  return str.replace(new RegExp(`.{1,${groupSize}}(?=(.{${groupSize}})+$)`, 'g'), '$& ');
}

export const BASE_LABELS: Record<Base, string> = {
  2:  'Binary (base 2)',
  8:  'Octal (base 8)',
  10: 'Decimal (base 10)',
  16: 'Hexadecimal (base 16)',
};

export const meta = { ready: true };
