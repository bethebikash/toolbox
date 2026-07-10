import { useState } from 'react';
import { jsonToTypeScript } from './engine';

const SAMPLE = `{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "active": true,
    "score": 98.5,
    "tags": ["admin", "user"],
    "address": {
      "city": "New York",
      "zip": "10001"
    }
  }
}`;

export default function JSONToTypeScriptPage() {
  const [input,    setInput]    = useState(SAMPLE);
  const [rootName, setRootName] = useState('Root');
  const [copied,   setCopied]   = useState(false);

  const result = jsonToTypeScript(input, rootName);

  function copy() {
    if (result.ok) { navigator.clipboard.writeText(result.output); setCopied(true); setTimeout(() => setCopied(false), 1500); }
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/developer" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Developer</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>JSON to TypeScript</span>
      </div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>JSON to TypeScript</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Convert JSON objects to TypeScript interfaces automatically.</p>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
          Root name:
          <input type="text" value={rootName} onChange={e => setRootName(e.target.value)}
            style={{ padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', width: '120px' }}
          />
        </label>
        {!result.ok && <span style={{ fontSize: '13px', color: 'var(--color-danger)' }}>⚠ {result.error}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>JSON Input</div>
          <textarea value={input} onChange={e => setInput(e.target.value)} spellCheck={false}
            style={{ flex: 1, minHeight: '400px', padding: 'var(--space-4)', border: 'none', outline: 'none', resize: 'none', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.6, color: 'var(--color-text-primary)', background: 'transparent' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: result.ok ? '1px solid var(--color-border)' : '1px solid var(--color-danger)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
            TypeScript Output
            {result.ok && <button onClick={copy} style={{ background: copied ? 'var(--color-success)' : 'none', color: copied ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>{copied ? 'Copied!' : 'Copy'}</button>}
          </div>
          <pre style={{ flex: 1, minHeight: '400px', margin: 0, padding: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.6, color: result.ok ? 'var(--color-text-primary)' : 'var(--color-danger)', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
            {result.ok ? result.output : result.error}
          </pre>
        </div>
      </div>
    </div>
  );
}
