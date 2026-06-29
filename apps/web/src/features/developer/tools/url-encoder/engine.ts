export type URLMode = 'component' | 'full' | 'query';

export interface URLResult {
  ok:     true;
  output: string;
  mode:   URLMode;
}

export interface URLError {
  ok:    false;
  error: string;
}

export function encodeURL(input: string, mode: URLMode): URLResult | URLError {
  try {
    let output: string;
    if (mode === 'component') output = encodeURIComponent(input);
    else if (mode === 'full') output = encodeURI(input);
    else output = input.replace(/[&=+%]/g, c => encodeURIComponent(c));
    return { ok: true, output, mode };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export function decodeURL(input: string, mode: URLMode): URLResult | URLError {
  try {
    let output: string;
    if (mode === 'component') output = decodeURIComponent(input);
    else if (mode === 'full') output = decodeURI(input);
    else output = input.replace(/\+/g, ' ');
    output = decodeURIComponent(output);
    return { ok: true, output, mode };
  } catch (e) {
    return { ok: false, error: 'Invalid URL encoding' };
  }
}

export interface ParsedParams {
  key:   string;
  value: string;
}

export function parseQueryString(qs: string): ParsedParams[] {
  const clean = qs.startsWith('?') ? qs.slice(1) : qs;
  if (!clean) return [];
  return clean.split('&').map(pair => {
    const [k, v] = pair.split('=');
    return {
      key:   decodeURIComponent(k?.replace(/\+/g, ' ') ?? ''),
      value: decodeURIComponent(v?.replace(/\+/g, ' ') ?? ''),
    };
  });
}

export function buildQueryString(params: ParsedParams[]): string {
  return params
    .filter(p => p.key)
    .map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
    .join('&');
}

export const meta = { ready: true };
