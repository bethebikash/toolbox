// Static exchange rates relative to USD (updated periodically)
export const RATES: Record<string, number> = {
  USD: 1,     EUR: 0.92,  GBP: 0.79,  JPY: 149.5, CNY: 7.24,
  INR: 83.1,  CAD: 1.36,  AUD: 1.53,  CHF: 0.89,  KRW: 1325,
  BRL: 4.97,  MXN: 17.1,  SGD: 1.34,  HKD: 7.82,  NOK: 10.6,
  SEK: 10.4,  DKK: 6.88,  NZD: 1.63,  ZAR: 18.6,  AED: 3.67,
  SAR: 3.75,  THB: 35.1,  MYR: 4.71,  IDR: 15700,  PHP: 56.5,
  PLN: 3.98,  CZK: 22.8,  HUF: 354,   RUB: 91.2,  TRY: 32.1,
  NPR: 133.1, PKR: 278.5,
};

export const CURRENCY_NAMES: Record<string, string> = {
  USD:'US Dollar', EUR:'Euro', GBP:'British Pound', JPY:'Japanese Yen',
  CNY:'Chinese Yuan', INR:'Indian Rupee', CAD:'Canadian Dollar',
  AUD:'Australian Dollar', CHF:'Swiss Franc', KRW:'South Korean Won',
  BRL:'Brazilian Real', MXN:'Mexican Peso', SGD:'Singapore Dollar',
  HKD:'Hong Kong Dollar', NOK:'Norwegian Krone', SEK:'Swedish Krona',
  DKK:'Danish Krone', NZD:'New Zealand Dollar', ZAR:'South African Rand',
  AED:'UAE Dirham', SAR:'Saudi Riyal', THB:'Thai Baht', MYR:'Malaysian Ringgit',
  IDR:'Indonesian Rupiah', PHP:'Philippine Peso', PLN:'Polish Zloty',
  CZK:'Czech Koruna', HUF:'Hungarian Forint', RUB:'Russian Ruble',
  TRY:'Turkish Lira', NPR:'Nepalese Rupee', PKR:'Pakistani Rupee',
};

export function convert(amount: number, from: string, to: string): number {
  const fromRate = RATES[from] ?? 1;
  const toRate   = RATES[to]   ?? 1;
  return (amount / fromRate) * toRate;
}

export function formatAmount(n: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style:    'currency',
    currency,
    maximumFractionDigits: n < 1 ? 6 : 2,
  }).format(n);
}

export const CURRENCIES = Object.keys(RATES);
export const meta = { ready: true };
