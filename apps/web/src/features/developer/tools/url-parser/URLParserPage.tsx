import { useState } from 'react';
import { parseURL } from './engine';

export default function URLParserPage() {
  const [input,  setInput]  = useState('https://user:pass@example.com:8080/path/to/page?foo=bar&baz=qux#section');
  const [copied, setCopied] = useState<string | null>(null);

  const result = parseURL(input);
  const isError = 'error' in result;

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  const fields = !isError ? [
    { label: 'Protocol',  value: result.protocol,  key: 'proto' },
    { label: 'Username',  value: result.username,  key: 'user' },
    { label: 'Password',  value: result.password,  key: 'pass' },
    { label: 'Hostname',  value: result.hostname,  key: 'host' },
    { label: 'Port',      value: result.port,      key: 'port' },
    { label: 'Pathname',  value: result.pathname,  key: 'path' },
    { label: 'Search',    value: result.search,    key: 'search' },
    { label: 'Hash',      value: result.hash,      key: 'hash' },
    { label: 'Origin',    value: result.origin,    key: 'origin' },
  ].filter(f => f.value) : [];

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/developer" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Developer</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>URL Parser</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>URL Parser & Inspector</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Break down any URL into its components — protocol, host, path, query params and more.</p>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid ' + (isError && input.trim() ? 'var(--color-danger)' : 'var(--color-border)'), overflow: 'hidden', marginBottom: 'var(--space-4)' }}>
        <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>URL Input</div>
        <input type="text" value={input} onChange={e => setInput(e.target.value)}
          placeholder="https://example.com/path?query=value"
          style={{ width: '100%', padding: 'var(--space-4)', border: 'none', outline: 'none', fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', background: 'transparent', boxSizing: 'border-box' }}
        />
      </div>

      {isError && input.trim() && (
        <div style={{ background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-3) var(--space-5)', fontSize: '14px', color: 'var(--color-danger)', marginBottom: 'var(--space-4)' }}>⚠ Invalid URL</div>
      )}

      {!isError && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Components */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>Components</div>
            {fields.map((f, i) => (
              <div key={f.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-5)', borderBottom: i < fields.length - 1 ? '1px solid var(--color-border)' : 'none', gap: 'var(--space-4)' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-tertiary)', width: '72px', textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0 }}>{f.label}</span>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-text-primary)', flex: 1, wordBreak: 'break-all' }}>{f.value}</code>
                <button onClick={() => copy(f.value, f.key)} style={{ background: copied === f.key ? 'var(--color-success)' : 'none', color: copied === f.key ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied === f.key ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500', flexShrink: 0 }}>
                  {copied === f.key ? '✓' : 'Copy'}
                </button>
              </div>
            ))}
          </div>

          {/* Query params */}
          {Object.keys(result.params).length > 0 && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
                Query parameters ({Object.keys(result.params).length})
              </div>
              {Object.entries(result.params).map(([k, v], i, arr) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-5)', borderBottom: i < arr.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-brand-500)', fontWeight: '700', minWidth: '120px' }}>{k}</code>
                  <span style={{ color: 'var(--color-text-tertiary)' }}>=</span>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-text-primary)', flex: 1 }}>{v}</code>
                </div>
              ))}
            </div>
          )}

          {/* Path segments */}
          {result.segments.length > 0 && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-4) var(--space-5)' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-3)' }}>Path segments</div>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {result.segments.map((seg, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: 'var(--color-text-tertiary)' }}>/</span>
                    <code style={{ padding: '2px 8px', background: 'var(--color-brand-50)', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--color-brand-500)', fontWeight: '600' }}>{seg}</code>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
