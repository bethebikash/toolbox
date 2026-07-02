import { useState } from 'react';
import { reverseText, MODE_LABELS } from './engine';
import type { ReverseMode } from './engine';

const MODES = Object.keys(MODE_LABELS) as ReverseMode[];

export default function TextReverserPage() {
  const [input,  setInput]  = useState('Hello World');
  const [mode,   setMode]   = useState<ReverseMode>('chars');
  const [copied, setCopied] = useState(false);

  const output = reverseText(input, mode);

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/text" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Text Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Text Reverser</span>
      </div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Text Reverser</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Reverse characters, words, or lines of text instantly.</p>
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        {MODES.map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding: 'var(--space-2) var(--space-5)',
            background: mode === m ? 'var(--color-brand-500)' : 'var(--color-surface)',
            color: mode === m ? '#fff' : 'var(--color-text-secondary)',
            border: '1px solid ' + (mode === m ? 'var(--color-brand-500)' : 'var(--color-border)'),
            borderRadius: 'var(--radius-full)', fontSize: '14px', fontWeight: '500',
            cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all var(--duration-fast)',
          }}>{MODE_LABELS[m]}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>Input</div>
          <textarea value={input} onChange={e => setInput(e.target.value)} style={{ flex: 1, minHeight: '280px', padding: 'var(--space-4)', border: 'none', outline: 'none', resize: 'none', fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.7, color: 'var(--color-text-primary)', background: 'transparent' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
            Output
            <button onClick={copy} style={{ background: copied ? 'var(--color-success)' : 'none', color: copied ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>{copied ? 'Copied!' : 'Copy'}</button>
          </div>
          <pre style={{ flex: 1, minHeight: '280px', margin: 0, padding: 'var(--space-4)', fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.7, color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{output}</pre>
        </div>
      </div>
    </div>
  );
}
