import { useState } from 'react';
import { encodeText, decodeText, TYPE_LABELS } from './engine';
import type { EscapeType } from './engine';

const TYPES = Object.keys(TYPE_LABELS) as EscapeType[];
type Mode = 'escape' | 'unescape';

export default function EscapeUnescapePage() {
  const [input,  setInput]  = useState('<script>alert("XSS & injection")</script>');
  const [type,   setType]   = useState<EscapeType>('html');
  const [mode,   setMode]   = useState<Mode>('escape');
  const [copied, setCopied] = useState(false);

  const output = mode === 'escape' ? encodeText(input, type) : decodeText(input, type);

  function copy() { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }
  function swap() { setInput(output); setMode(m => m === 'escape' ? 'unescape' : 'escape'); }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/developer" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Developer</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Escape / Unescape</span>
      </div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Escape / Unescape</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Escape and unescape HTML entities, URL encoding, JavaScript strings, Base64 and JSON.</p>
      </div>

      {/* Type selector */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        {TYPES.map(t => (
          <button key={t} onClick={() => setType(t)} style={{
            padding: 'var(--space-2) var(--space-4)',
            background: type === t ? 'var(--color-brand-500)' : 'var(--color-surface)',
            color: type === t ? '#fff' : 'var(--color-text-secondary)',
            border: '1px solid ' + (type === t ? 'var(--color-brand-500)' : 'var(--color-border)'),
            borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: '500',
            cursor: 'pointer', fontFamily: 'var(--font-sans)',
          }}>{TYPE_LABELS[t]}</button>
        ))}
      </div>

      {/* Mode + swap */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', alignItems: 'center' }}>
        <div style={{ display: 'flex', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)', padding: '3px', gap: '2px' }}>
          {(['escape', 'unescape'] as Mode[]).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ padding: 'var(--space-2) var(--space-5)', background: mode === m ? 'var(--color-surface)' : 'transparent', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: mode === m ? '600' : '400', color: mode === m ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)', textTransform: 'capitalize' }}>{m}</button>
          ))}
        </div>
        <button onClick={swap} style={{ padding: 'var(--space-2) var(--space-4)', background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>⇄ Swap</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
            Input
            <button onClick={() => setInput('')} style={{ background: 'none', border: 'none', fontSize: '12px', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Clear</button>
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)} spellCheck={false}
            style={{ flex: 1, minHeight: '280px', padding: 'var(--space-4)', border: 'none', outline: 'none', resize: 'none', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.6, color: 'var(--color-text-primary)', background: 'transparent' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
            Output
            <button onClick={copy} style={{ background: copied ? 'var(--color-success)' : 'none', color: copied ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>{copied ? 'Copied!' : 'Copy'}</button>
          </div>
          <pre style={{ flex: 1, minHeight: '280px', margin: 0, padding: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.6, color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap', wordBreak: 'break-all', overflowX: 'auto' }}>
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
}
