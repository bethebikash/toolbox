export interface JWTHeader {
  alg:  string;
  typ:  string;
  [key: string]: unknown;
}

export interface JWTPayload {
  sub?:  string;
  iss?:  string;
  aud?:  string | string[];
  exp?:  number;
  iat?:  number;
  nbf?:  number;
  jti?:  string;
  [key: string]: unknown;
}

export interface JWTResult {
  header:    JWTHeader;
  payload:   JWTPayload;
  signature: string;
  isExpired: boolean;
  expiresAt: string | null;
  issuedAt:  string | null;
}

export type JWTError = { error: string };

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
  return atob(padded);
}

export function decodeJWT(token: string): JWTResult | JWTError {
  const parts = token.trim().split('.');
  if (parts.length !== 3) return { error: 'Invalid JWT — must have 3 parts separated by dots' };

  try {
    const header  = JSON.parse(base64UrlDecode(parts[0]!)) as JWTHeader;
    const payload = JSON.parse(base64UrlDecode(parts[1]!)) as JWTPayload;
    const sig     = parts[2]!;

    const now       = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp !== undefined ? payload.exp < now : false;
    const expiresAt = payload.exp ? new Date(payload.exp * 1000).toISOString() : null;
    const issuedAt  = payload.iat ? new Date(payload.iat * 1000).toISOString() : null;

    return { header, payload, signature: sig, isExpired, expiresAt, issuedAt };
  } catch {
    return { error: 'Failed to decode JWT — invalid Base64 or JSON' };
  }
}

export const meta = { ready: true };
