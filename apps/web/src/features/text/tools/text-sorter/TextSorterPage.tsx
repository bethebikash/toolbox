import { useState } from 'react';
import { sortLines, ORDER_LABELS } from './engine';
import type { SortOptions, SortOrder } from './engine';

const ORDERS = Object.keys(ORDER_LABELS) as SortOrder[];
const SAMPLE = `banana\napple\ncherry\ndate\nelderberry\napricot`;
const DEFAULT: SortOptions = { order: 'asc', caseSensitive: false, removeDups: false, trimLines: true };

export default function TextSorterPage() {
  const [input,  setInput]  = useState(SAMPLE);
  const [opts,   setOpts]   = useState<SortOptions>(DEFAULT);
  const [copied, setCopied] = useState(false);

  const output = sortLines(input, opts);
  const lineCount = output.split('\n').filter(Boolean).length;

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
        <span style={{ color: 'var(--color-text-secondary)' }}>Text Sorter</span>
      </div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Text Sorter</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Sort lines alphabetically, by length, or shuffle randomly.</p>
      </div>

      {/* Order tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        {ORDERS.map(o => (
          <button key={o} onClick={() => setOpts(p => ({ ...p, order: o }))} style={{
            padding: 'var(--space-2) var(--space-4)',
            background: opts.order === o ? 'var(--color-brand-500)' : 'var(--color-surface)',
            color: opts.order === o ? '#fff' : 'var(--color-text-secondary)',
            border: '1px solid ' + (opts.order === o ? 'var(--color-brand-500)' : 'var(--color-border)'),
            borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: '500',
            cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all var(--duration-fast)',
          }}>{ORDER_LABELS[o]}</button>
        ))}
      </div>

      {/* Options + stats */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginBottom: 'var(--space-4)', padding: 'var(--space-3) var(--space-5)', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', alignItems: 'center' }}>
        {([
          ['caseSensitive', 'Case sensitive'],
          ['removeDups',    'Remove duplicates'],
          ['trimLines',     'Trim lines'],
        ] as [keyof SortOptions, string][]).filter(([k]) => k !== 'order').map(([key, label]) => (
          <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '14px', fontWeight: '500', color: 'var(--color-text-primary)', cursor: 'pointer' }}>
            <input type="checkbox" checked={!!opts[key]} onChange={() => setOpts(p => ({ ...p, [key]: !p[key] }))} style={{ accentColor: 'var(--color-brand-500)', width: '16px', height: '16px' }} />
            {label}
          </label>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--color-text-tertiary)' }}>{lineCount} lines</span>
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
          <pre style={{ flex: 1, minHeight: '280px', margin: 0, padding: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.7, color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{output}</pre>
        </div>
      </div>
    </div>
  );
}
