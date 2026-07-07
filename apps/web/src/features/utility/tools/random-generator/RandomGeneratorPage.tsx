import { useState } from 'react';
import { generateNumbers } from './engine';
import type { RandomOptions } from './engine';

export default function RandomGeneratorPage() {
  const [opts,    setOpts]    = useState<RandomOptions>({ min: 1, max: 100, count: 10, unique: false, decimal: false, decimals: 2 });
  const [results, setResults] = useState<number[]>([]);
  const [error,   setError]   = useState('');
  const [copied,  setCopied]  = useState(false);

  function generate() {
    try {
      setError('');
      setResults(generateNumbers(opts));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  function copy() {
    navigator.clipboard.writeText(results.join(', '));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const inputStyle = { padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '15px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', textAlign: 'center' as const, fontWeight: '600' as const };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/utility" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Utility Tools</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Random Generator</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Random Number Generator</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Generate random numbers within a range. Supports unique and decimal values.</p>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
          {[
            { label: 'Min', key: 'min' as const },
            { label: 'Max', key: 'max' as const },
            { label: 'Count', key: 'count' as const },
          ].map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)', textAlign: 'center' }}>{f.label}</label>
              <input type="number" value={opts[f.key]} onChange={e => setOpts(o => ({ ...o, [f.key]: Number(e.target.value) }))} style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' as const }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '14px', fontWeight: '500', color: 'var(--color-text-primary)', cursor: 'pointer' }}>
            <input type="checkbox" checked={opts.unique} onChange={e => setOpts(o => ({ ...o, unique: e.target.checked }))} style={{ accentColor: 'var(--color-brand-500)', width: '16px', height: '16px' }} />
            Unique numbers
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '14px', fontWeight: '500', color: 'var(--color-text-primary)', cursor: 'pointer' }}>
            <input type="checkbox" checked={opts.decimal} onChange={e => setOpts(o => ({ ...o, decimal: e.target.checked }))} style={{ accentColor: 'var(--color-brand-500)', width: '16px', height: '16px' }} />
            Decimal values
          </label>
          {opts.decimal && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Decimal places:</span>
              <input type="number" min={1} max={10} value={opts.decimals} onChange={e => setOpts(o => ({ ...o, decimals: Number(e.target.value) }))} style={{ ...inputStyle, width: '60px' }} />
            </div>
          )}
        </div>
        {error && <div style={{ fontSize: '13px', color: 'var(--color-danger)', marginBottom: 'var(--space-3)' }}>⚠ {error}</div>}
        <button onClick={generate} style={{ width: '100%', padding: 'var(--space-3)', background: 'var(--color-brand-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 4px 12px rgb(46 124 246 / 0.35)' }}>
          Generate →
        </button>
      </div>

      {results.length > 0 && (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
            {results.length} numbers
            <button onClick={copy} style={{ background: copied ? 'var(--color-success)' : 'none', color: copied ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>{copied ? 'Copied!' : 'Copy all'}</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', padding: 'var(--space-5)' }}>
            {results.map((n, i) => (
              <div key={i} style={{ padding: 'var(--space-2) var(--space-4)', background: 'var(--color-brand-50)', borderRadius: 'var(--radius-md)', fontSize: '16px', fontWeight: '700', color: 'var(--color-brand-500)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>{n}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
