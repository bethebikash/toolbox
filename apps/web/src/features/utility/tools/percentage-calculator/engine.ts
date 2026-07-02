export interface PercentResult {
  label:  string;
  value:  number;
  formula: string;
}

export function calculatePercentage(a: number, b: number): PercentResult[] {
  return [
    {
      label:   `${a}% of ${b}`,
      value:   (a / 100) * b,
      formula: `(${a} / 100) × ${b}`,
    },
    {
      label:   `${a} is what % of ${b}`,
      value:   (a / b) * 100,
      formula: `(${a} / ${b}) × 100`,
    },
    {
      label:   `% change from ${b} to ${a}`,
      value:   ((a - b) / b) * 100,
      formula: `((${a} - ${b}) / ${b}) × 100`,
    },
    {
      label:   `${a} increased by ${b}%`,
      value:   a * (1 + b / 100),
      formula: `${a} × (1 + ${b} / 100)`,
    },
    {
      label:   `${a} decreased by ${b}%`,
      value:   a * (1 - b / 100),
      formula: `${a} × (1 - ${b} / 100)`,
    },
  ];
}

export function formatNum(n: number): string {
  if (isNaN(n) || !isFinite(n)) return '—';
  return parseFloat(n.toFixed(6)).toLocaleString();
}

export const meta = { ready: true };
