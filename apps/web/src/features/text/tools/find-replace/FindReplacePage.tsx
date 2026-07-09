import { useState } from 'react';
import { findReplace } from './engine';
import type { FindReplaceOptions } from './engine';

const DEFAULT_OPTS: FindReplaceOptions = { find: '', replace: '', caseSensitive: false, wholeWord: false, useRegex: false };

const SAMPLE = `The quick brown fox jumps over the lazy dog.
The dog barked at the fox.
The fox ran away quickly.`;

export default function FindReplacePage() {
  const [input,  setInput]  = useState(SAMPLE);
  const [opts,   setOpts]   = useState<FindReplaceOptions>(DEFAULT_OPTS);
  const [copied, setCopied] = useState(false);

  const result = findReplace(input, opts);

  function apply() { setInput(result.output); setOpts(o => ({ ...o, find: '', replace: '' })); }
  function copy()  { navigator.clipboard.writeText(result.output); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/text" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Text</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Find & Replace</span>
      </div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Find & Replace</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Find and replace text with regex support, case sensitivity and whole word matching.</p>
      </div>

      {/* Find / Replace inputs */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-5)', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Find</label>
            <input type="text" value={opts.find} onChange={e => setOpts(o => ({ ...o, find: e.target.value }))}
              placeholder={opts.useRegex ? 'Regex pattern...' : 'Text to find...'}
              style={{ width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '15px', fontFamily: opts.useRegex ? 'var(--font-mono)' : 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Replace with</label>
            <input type="text" value={opts.replace} onChange={e => setOpts(o => ({ ...o, replace: e.target.value }))}
              placeholder="Replacement text..."
              style={{ width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '15px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
          {([
            ['caseSensitive', 'Case sensitive'],
            ['wholeWord',     'Whole word'],
            ['useRegex',      'Regex'],
          ] as [keyof FindReplaceOptions, string][]).map(([key, label]) => (
            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '14px', fontWeight: '500', color: 'var(--color-text-primary)', cursor: 'pointer' }}>
              <input type="checkbox" checked={!!opts[key]} onChange={e => setOpts(o => ({ ...o, [key]: e.target.checked }))} style={{ accentColor: 'var(--color-brand-500)', width: '16px', height: '16px' }} />
              {label}
            </label>
          ))}
          {result.count > 0 && (
            <span style={{ marginLeft: 'auto', fontSize: '14px', fontWeight: '700', color: 'var(--color-success)' }}>{result.count} {result.count === 1 ? 'match' : 'matches'}</span>
          )}
          {result.error && (
            <span style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--color-danger)' }}>⚠ {result.error}</span>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
            Input
            <button onClick={() => setInput('')} style={{ background: 'none', border: 'none', fontSize: '12px', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Clear</button>
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            style={{ flex: 1, minHeight: '320px', padding: 'var(--space-4)', border: 'none', outline: 'none', resize: 'none', fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.7, color: 'var(--color-text-primary)', background: 'transparent' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
            Output
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button onClick={apply} style={{ background: 'none', border: 'none', fontSize: '12px', color: 'var(--color-brand-500)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '600' }}>Apply</button>
              <button onClick={copy} style={{ background: copied ? 'var(--color-success)' : 'none', color: copied ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>{copied ? 'Copied!' : 'Copy'}</button>
            </div>
          </div>
          <pre style={{ flex: 1, minHeight: '320px', margin: 0, padding: 'var(--space-4)', fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.7, color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowX: 'auto' }}>
            {result.output}
          </pre>
        </div>
      </div>
    </div>
  );
}
