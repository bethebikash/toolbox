export interface ParsedURL {
  protocol:   string;
  username:   string;
  password:   string;
  hostname:   string;
  port:       string;
  pathname:   string;
  search:     string;
  hash:       string;
  origin:     string;
  host:       string;
  params:     Record<string, string>;
  segments:   string[];
}

export type ParseError = { error: string };

export function parseURL(input: string): ParsedURL | ParseError {
  try {
    const url  = new URL(input.trim().startsWith('http') ? input.trim() : 'https://' + input.trim());
    const params: Record<string, string> = {};
    url.searchParams.forEach((v, k) => { params[k] = v; });
    const segments = url.pathname.split('/').filter(Boolean);
    return {
      protocol: url.protocol.replace(':', ''),
      username: url.username,
      password: url.password,
      hostname: url.hostname,
      port:     url.port,
      pathname: url.pathname,
      search:   url.search,
      hash:     url.hash,
      origin:   url.origin,
      host:     url.host,
      params,
      segments,
    };
  } catch {
    return { error: 'Invalid URL' };
  }
}

export function buildURL(base: string, params: Record<string, string>): string {
  try {
    const url = new URL(base);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    return url.toString();
  } catch {
    return '';
  }
}

export const meta = { ready: true };
