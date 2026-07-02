import { useState } from 'react';
import { removeDuplicates } from './engine';
import type { DuplicateOptions } from './engine';

const SAMPLE = `apple\nbanana\napple\ncherry\nbanana\ndate`;
const DEFAULT: DuplicateOptions = { caseSensitive: true, trimLines: true, keepEmpty: false };

export default function RemoveDuplicatesPage() {
  const [input,  setInput]  = useState(SAMPLE);
  const [opts,   setOpts]   = useState<DuplicateOptions>(DEFAULT);
  const [copied, setCopied] = useState(false);

  const result = removeDuplicates(input, opts);

  function copy() {
    navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function toggle(key: keyof DuplicateOptions) {
    setOpts(o => ({ ...o, [key]: !o[key] }));
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/text" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Text Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Remove Duplicate Lines</span>
      </div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Remove Duplicate Lines</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Remove duplicate lines from text, keeping only the first occurrence.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
        {[
          { label: 'Input lines',  value: result.inputLines },
          { label: 'Output lines', value: result.outputLines },
          { label: 'Removed',      value: result.removed },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-3) var(--space-5)', display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: '20px', fontWeight: '800', color: s.label === 'Removed' ? 'var(--color-danger)' : 'var(--color-brand-500)' }}>{s.value}</span>
            <span style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Options */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginBottom: 'var(--space-4)', padding: 'var(--space-4) var(--space-5)', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
        {([
          ['caseSensitive', 'Case sensitive'],
          ['trimLines',     'Trim whitespace'],
          ['keepEmpty',     'Keep empty lines'],
        ] as [keyof DuplicateOptions, string][]).map(([key, label]) => (
          <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '14px', fontWeight: '500', color: 'var(--color-text-primary)', cursor: 'pointer' }}>
            <input type="checkbox" checked={opts[key]} onChange={() => toggle(key)} style={{ accentColor: 'var(--color-brand-500)', width: '16px', height: '16px' }} />
            {label}
          </label>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>Input</div>
          <textarea value={input} onChange={e => setInput(e.target.value)} style={{ flex: 1, minHeight: '280px', padding: 'var(--space-4)', border: 'none', outline: 'none', resize: 'none', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.7, color: 'var(--color-text-primary)', background: 'transparent' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
            Output
            <button onClick={copy} style={{ background: copied ? 'var(--color-success)' : 'none', color: copied ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>{copied ? 'Copied!' : 'Copy'}</button>
          </div>
          <pre style={{ flex: 1, minHeight: '280px', margin: 0, padding: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.7, color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{result.output}</pre>
        </div>
      </div>
    </div>
  );
}
