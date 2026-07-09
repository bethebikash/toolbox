export type StrengthLevel = 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';

export interface StrengthResult {
  score:        number;   // 0–100
  level:        StrengthLevel;
  color:        string;
  entropy:      number;
  checks:       StrengthCheck[];
  suggestions:  string[];
  timeToCrack:  string;
}

export interface StrengthCheck {
  label:  string;
  passed: boolean;
}

export function analyzePassword(password: string): StrengthResult {
  const checks: StrengthCheck[] = [
    { label: 'At least 8 characters',          passed: password.length >= 8 },
    { label: 'At least 12 characters',         passed: password.length >= 12 },
    { label: 'Contains lowercase letters',     passed: /[a-z]/.test(password) },
    { label: 'Contains uppercase letters',     passed: /[A-Z]/.test(password) },
    { label: 'Contains numbers',               passed: /\d/.test(password) },
    { label: 'Contains special characters',    passed: /[^a-zA-Z0-9]/.test(password) },
    { label: 'No repeated characters (3+)',    passed: !/(.)\1{2,}/.test(password) },
    { label: 'Not a common pattern',           passed: !/^(password|123456|qwerty|abc)/i.test(password) },
  ];

  const passed = checks.filter(c => c.passed).length;
  const score  = Math.min(100, Math.round((passed / checks.length) * 100 + Math.min(20, password.length - 8) * 2));

  // Entropy
  const charSet = [
    /[a-z]/.test(password) ? 26 : 0,
    /[A-Z]/.test(password) ? 26 : 0,
    /\d/.test(password)    ? 10 : 0,
    /[^a-zA-Z0-9]/.test(password) ? 32 : 0,
  ].reduce((a, b) => a + b, 0);
  const entropy = Math.round(password.length * Math.log2(Math.max(charSet, 1)));

  let level: StrengthLevel;
  let color: string;
  if (score < 20)      { level = 'Very Weak'; color = '#EF4444'; }
  else if (score < 40) { level = 'Weak';      color = '#F97316'; }
  else if (score < 60) { level = 'Fair';      color = '#EAB308'; }
  else if (score < 80) { level = 'Strong';    color = '#22C55E'; }
  else                 { level = 'Very Strong'; color = '#10B981'; }

  // Time to crack (rough estimate at 10B guesses/sec)
  const combinations = Math.pow(Math.max(charSet, 1), password.length);
  const seconds      = combinations / 1e10;
  let timeToCrack: string;
  if (seconds < 1)           timeToCrack = 'Instantly';
  else if (seconds < 60)     timeToCrack = `${Math.round(seconds)} seconds`;
  else if (seconds < 3600)   timeToCrack = `${Math.round(seconds/60)} minutes`;
  else if (seconds < 86400)  timeToCrack = `${Math.round(seconds/3600)} hours`;
  else if (seconds < 2.628e6)timeToCrack = `${Math.round(seconds/86400)} days`;
  else if (seconds < 3.154e7)timeToCrack = `${Math.round(seconds/2.628e6)} months`;
  else if (seconds < 3.154e9)timeToCrack = `${Math.round(seconds/3.154e7)} years`;
  else                       timeToCrack = 'Centuries';

  const suggestions: string[] = [];
  if (!checks[0]!.passed) suggestions.push('Use at least 8 characters');
  if (!checks[1]!.passed) suggestions.push('Use at least 12 characters for better security');
  if (!checks[2]!.passed || !checks[3]!.passed) suggestions.push('Mix uppercase and lowercase letters');
  if (!checks[4]!.passed) suggestions.push('Add numbers');
  if (!checks[5]!.passed) suggestions.push('Add special characters (!@#$%^&*)');
  if (!checks[6]!.passed) suggestions.push('Avoid repeated characters');

  return { score, level, color, entropy, checks, suggestions, timeToCrack };
}

export const meta = { ready: true };
