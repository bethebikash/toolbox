export interface PasswordOptions {
  length:     number;
  uppercase:  boolean;
  lowercase:  boolean;
  numbers:    boolean;
  symbols:    boolean;
  exclude:    string;
}

export interface PasswordResult {
  password: string;
  strength: 'weak' | 'fair' | 'strong' | 'very-strong';
  entropy:  number;
}

const SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers:   '0123456789',
  symbols:   '!@#$%^&*()_+-=[]{}|;:,.<>?',
} as const;

export function generatePassword(opts: PasswordOptions): PasswordResult {
  let charset = '';
  if (opts.uppercase) charset += SETS.uppercase;
  if (opts.lowercase) charset += SETS.lowercase;
  if (opts.numbers)   charset += SETS.numbers;
  if (opts.symbols)   charset += SETS.symbols;

  // Remove excluded characters
  if (opts.exclude) {
    charset = charset.split('').filter(c => !opts.exclude.includes(c)).join('');
  }

  if (!charset) {
    return { password: '', strength: 'weak', entropy: 0 };
  }

  // Use Web Crypto for cryptographically secure random
  const array    = new Uint32Array(opts.length);
  crypto.getRandomValues(array);
  const password = Array.from(array, n => charset[n % charset.length]!).join('');

  const entropy  = opts.length * Math.log2(charset.length);
  const strength = entropy < 40 ? 'weak' : entropy < 60 ? 'fair' : entropy < 80 ? 'strong' : 'very-strong';

  return { password, strength, entropy: Math.round(entropy) };
}

export function generateBatch(opts: PasswordOptions, count: number): PasswordResult[] {
  return Array.from({ length: count }, () => generatePassword(opts));
}

export function getStrengthColor(strength: PasswordResult['strength']): string {
  return {
    'weak':        '#EF4444',
    'fair':        '#D97706',
    'strong':      '#10B981',
    'very-strong': '#2E7CF6',
  }[strength];
}

export const meta = { ready: true };
