import { useState } from 'react';
import { convertCase, CASE_LABELS } from './engine';
import type { CaseType } from './engine';

const CASES = Object.keys(CASE_LABELS) as CaseType[];

export default function CaseConverterPage() {
  const [input,  setInput]  = useState('The quick brown fox jumps over the lazy dog.');
  const [active, setActive] = useState<CaseType>('upper');
  const [copied, setCopied] = useState(false);

  const output = convertCase(input, active);

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
        <span style={{ color: 'var(--color-text-secondary)' }}>Case Converter</span>
      </div>

      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Case Converter</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>
          Convert text between UPPER, lower, Title, camelCase, snake_case and more.
        </p>
      </div>

      {/* Case buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        {CASES.map(c => (
          <button key={c} onClick={() => setActive(c)} style={{
            padding: 'var(--space-2) var(--space-4)',
            background: active === c ? 'var(--color-brand-500)' : 'var(--color-surface)',
            color: active === c ? '#fff' : 'var(--color-text-secondary)',
            border: '1px solid ' + (active === c ? 'var(--color-brand-500)' : 'var(--color-border)'),
            borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: '500',
            cursor: 'pointer', fontFamily: 'var(--font-sans)',
            transition: 'all var(--duration-fast)',
          }}>{CASE_LABELS[c]}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        {/* Input */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
            Input
            <button onClick={() => setInput('')} style={{ background: 'none', border: 'none', fontSize: '12px', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Clear</button>
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            style={{ flex: 1, minHeight: '320px', padding: 'var(--space-4)', border: 'none', outline: 'none', resize: 'none', fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.7, color: 'var(--color-text-primary)', background: 'transparent' }}
          />
        </div>

        {/* Output */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
            {CASE_LABELS[active]}
            <button onClick={copy} style={{ background: copied ? 'var(--color-success)' : 'none', color: copied ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre style={{ flex: 1, minHeight: '320px', margin: 0, padding: 'var(--space-4)', fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.7, color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowX: 'auto' }}>
            {output || <span style={{ color: 'var(--color-text-tertiary)' }}>Output appears here...</span>}
          </pre>
        </div>
      </div>
    </div>
  );
}
