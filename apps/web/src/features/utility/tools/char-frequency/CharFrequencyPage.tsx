import { useState, useMemo } from 'react';
import { analyzeFrequency } from './engine';
import type { FreqOptions } from './engine';

const SAMPLE = 'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.';
const DEFAULT_OPTS: FreqOptions = { caseSensitive: false, ignoreSpaces: true, onlyLetters: true };

export default function CharFrequencyPage() {
  const [text, setText] = useState(SAMPLE);
  const [opts, setOpts] = useState<FreqOptions>(DEFAULT_OPTS);

  const results = useMemo(() => analyzeFrequency(text, opts), [text, opts]);
  const maxCount = results[0]?.count ?? 1;

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/utility" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Utility Tools</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Character Frequency</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Character Frequency Counter</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Analyze how often each character appears in your text.</p>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)', flexWrap: 'wrap', padding: 'var(--space-4) var(--space-5)', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
        {([
          ['caseSensitive', 'Case sensitive'],
          ['ignoreSpaces',  'Ignore spaces'],
          ['onlyLetters',   'Letters only'],
        ] as [keyof FreqOptions, string][]).map(([key, label]) => (
          <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '14px', fontWeight: '500', color: 'var(--color-text-primary)', cursor: 'pointer' }}>
            <input type="checkbox" checked={opts[key]} onChange={e => setOpts(o => ({ ...o, [key]: e.target.checked }))} style={{ accentColor: 'var(--color-brand-500)', width: '16px', height: '16px' }} />
            {label}
          </label>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--color-text-tertiary)' }}>{results.length} unique chars</span>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden', marginBottom: 'var(--space-4)' }}>
        <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>Text input</div>
        <textarea value={text} onChange={e => setText(e.target.value)} style={{ width: '100%', minHeight: '120px', padding: 'var(--space-4)', border: 'none', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-sans)', fontSize: '15px', lineHeight: 1.7, color: 'var(--color-text-primary)', background: 'transparent', boxSizing: 'border-box' }} />
      </div>

      {results.length > 0 && (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>Frequency</div>
          <div style={{ padding: 'var(--space-4) var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {results.map(r => (
              <div key={r.char} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 60px 48px', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{ fontSize: '18px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--color-text-primary)', textAlign: 'center', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-sm)', padding: '2px 0' }}>{r.char}</div>
                <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: (r.count / maxCount * 100) + '%', background: 'var(--color-brand-500)', borderRadius: 'var(--radius-full)' }} />
                </div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-brand-500)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{r.count}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', textAlign: 'right' }}>{r.percent}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
