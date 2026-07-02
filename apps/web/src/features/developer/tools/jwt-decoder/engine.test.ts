import { describe, it, expect } from 'vitest';
import { decodeJWT } from './engine';

// A real JWT with no signature verification needed for decoding
const SAMPLE_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

describe('decodeJWT', () => {
  it('decodes a valid JWT', () => {
    const r = decodeJWT(SAMPLE_JWT);
    expect('error' in r).toBe(false);
    if ('error' in r) return;
    expect(r.header.alg).toBe('HS256');
    expect(r.header.typ).toBe('JWT');
    expect(r.payload.sub).toBe('1234567890');
  });

  it('rejects invalid format', () => {
    const r = decodeJWT('not.a.valid.jwt.with.too.many.parts');
    expect('error' in r).toBe(true);
  });

  it('rejects non-JWT string', () => {
    const r = decodeJWT('hello world');
    expect('error' in r).toBe(true);
  });

  it('detects expired token', () => {
    // Manually construct expired token: exp = 1
    const header  = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
    const payload = btoa(JSON.stringify({ sub: 'test', exp: 1 })).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
    const r = decodeJWT(`${header}.${payload}.sig`);
    expect('error' in r).toBe(false);
    if ('error' in r) return;
    expect(r.isExpired).toBe(true);
  });
});
