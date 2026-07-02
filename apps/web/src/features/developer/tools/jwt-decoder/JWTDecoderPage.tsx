import { useState } from 'react';
import { decodeJWT } from './engine';

const SAMPLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

export default function JWTDecoderPage() {
  const [input, setInput] = useState(SAMPLE);
  const [copied, setCopied] = useState<string | null>(null);

  const result = input.trim() ? decodeJWT(input.trim()) : null;
  const isError = result && 'error' in result;
  const decoded = result && !('error' in result) ? result : null;

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  const sectionStyle = {
    background: 'var(--color-surface)',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--color-border)',
    overflow: 'hidden' as const,
  };

  const headerStyle = {
    padding: 'var(--space-3) var(--space-5)',
    borderBottom: '1px solid var(--color-border)',
    background: 'var(--color-surface-2)',
    fontSize: '12px' as const,
    fontWeight: '700' as const,
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    color: 'var(--color-text-tertiary)',
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/developer" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Developer Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>JWT Decoder</span>
      </div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>JWT Decoder</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>
          Decode and inspect JSON Web Tokens. Signature is not verified — for inspection only.
        </p>
      </div>

      {/* Input */}
      <div style={{ ...sectionStyle, marginBottom: 'var(--space-4)' }}>
        <div style={headerStyle}>
          JWT Token
          <button onClick={() => setInput('')} style={{ background: 'none', border: 'none', fontSize: '12px', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Clear</button>
        </div>
        <textarea value={input} onChange={e => setInput(e.target.value)} spellCheck={false}
          placeholder="Paste your JWT here..."
          style={{ width: '100%', minHeight: '100px', padding: 'var(--space-4)', border: 'none', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.6, color: isError ? 'var(--color-danger)' : 'var(--color-text-primary)', background: 'transparent', boxSizing: 'border-box' }}
        />
      </div>

      {isError && result && 'error' in result && (
        <div style={{ background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4) var(--space-5)', marginBottom: 'var(--space-4)', fontSize: '14px', color: 'var(--color-danger)' }}>
          ⚠ {result.error}
        </div>
      )}

      {decoded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

          {/* Status badges */}
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <span style={{ padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: '600', background: 'var(--color-brand-50)', color: 'var(--color-brand-500)' }}>
              {decoded.header.alg}
            </span>
            <span style={{ padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: '600', background: 'var(--color-surface-2)', color: 'var(--color-text-secondary)' }}>
              {decoded.header.typ}
            </span>
            {decoded.isExpired && (
              <span style={{ padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: '600', background: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}>
                ⚠ Expired
              </span>
            )}
            {!decoded.isExpired && decoded.expiresAt && (
              <span style={{ padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: '600', background: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
                ✓ Valid
              </span>
            )}
          </div>

          {/* 3 sections */}
          {([
            { title: 'Header',    color: '#7C3AED', data: decoded.header },
            { title: 'Payload',   color: '#2E7CF6', data: decoded.payload },
            { title: 'Signature', color: '#D97706', data: { signature: decoded.signature } },
          ] as const).map(section => (
            <div key={section.title} style={sectionStyle}>
              <div style={{ ...headerStyle, borderLeft: `4px solid ${section.color}` }}>
                <span style={{ color: section.color }}>{section.title}</span>
                <button onClick={() => copy(JSON.stringify(section.data, null, 2), section.title)} style={{ background: copied === section.title ? 'var(--color-success)' : 'none', color: copied === section.title ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied === section.title ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>
                  {copied === section.title ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre style={{ margin: 0, padding: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.6, color: 'var(--color-text-primary)', overflowX: 'auto' }}>
                {JSON.stringify(section.data, null, 2)}
              </pre>
            </div>
          ))}

          {/* Claims */}
          {(decoded.expiresAt || decoded.issuedAt) && (
            <div style={sectionStyle}>
              <div style={headerStyle}>Parsed claims</div>
              <div style={{ padding: 'var(--space-4) var(--space-5)' }}>
                {decoded.issuedAt && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-border)', fontSize: '14px' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Issued at (iat)</span>
                    <span style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{decoded.issuedAt}</span>
                  </div>
                )}
                {decoded.expiresAt && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', fontSize: '14px' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Expires at (exp)</span>
                    <span style={{ color: decoded.isExpired ? 'var(--color-danger)' : 'var(--color-success)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{decoded.expiresAt}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
