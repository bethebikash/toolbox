export interface FormatOptions {
  locale:        string;
  style:         'decimal' | 'currency' | 'percent' | 'scientific';
  currency:      string;
  decimals:      number;
  grouping:      boolean;
}

export interface FormatResult {
  formatted:   string;
  locale:      string;
  raw:         number;
}

export const LOCALES = [
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'de-DE', label: 'German' },
  { code: 'fr-FR', label: 'French' },
  { code: 'ja-JP', label: 'Japanese' },
  { code: 'zh-CN', label: 'Chinese (Simplified)' },
  { code: 'ar-SA', label: 'Arabic' },
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'es-ES', label: 'Spanish' },
  { code: 'pt-BR', label: 'Portuguese (Brazil)' },
];

export function formatNumber(value: number, opts: FormatOptions): FormatResult {
  try {
    const options: Intl.NumberFormatOptions = {
      useGrouping: opts.grouping,
      minimumFractionDigits: opts.decimals,
      maximumFractionDigits: opts.decimals,
    };

    if (opts.style === 'currency') {
      options.style    = 'currency';
      options.currency = opts.currency;
      delete options.minimumFractionDigits;
      delete options.maximumFractionDigits;
    } else if (opts.style === 'percent') {
      options.style = 'percent';
    } else if (opts.style === 'scientific') {
      const exp      = Math.floor(Math.log10(Math.abs(value)));
      const mantissa = value / Math.pow(10, exp);
      return { formatted: `${mantissa.toFixed(opts.decimals)}e+${exp}`, locale: opts.locale, raw: value };
    }

    const formatted = new Intl.NumberFormat(opts.locale, options).format(value);
    return { formatted, locale: opts.locale, raw: value };
  } catch {
    return { formatted: String(value), locale: opts.locale, raw: value };
  }
}

export const meta = { ready: true };
