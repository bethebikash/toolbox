import { useState } from 'react';
import { calculatePercentage, formatNum } from './engine';

export default function PercentageCalculatorPage() {
  const [a, setA] = useState('10');
  const [b, setB] = useState('200');

  const numA = parseFloat(a) || 0;
  const numB = parseFloat(b) || 0;
  const results = (numA && numB) ? calculatePercentage(numA, numB) : [];

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/utility" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Utility Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Percentage Calculator</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Percentage Calculator</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Calculate percentages in multiple ways simultaneously.</p>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          {[['A', a, setA], ['B', b, setB]].map(([label, val, set]) => (
            <div key={label as string}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Value {label as string}</label>
              <input type="number" value={val as string} onChange={e => (set as (v: string) => void)(e.target.value)}
                style={{ width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '20px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box', fontWeight: '600', textAlign: 'center' }}
              />
            </div>
          ))}
        </div>
      </div>

      {results.length > 0 && (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          {results.map((r, i) => (
            <div key={i} style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: i < results.length - 1 ? '1px solid var(--color-border)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>{r.label}</div>
                <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{r.formula}</div>
              </div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-brand-500)', fontVariantNumeric: 'tabular-nums', flexShrink: 0, marginLeft: 'var(--space-4)' }}>{formatNum(r.value)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
