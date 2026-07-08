import { useState } from 'react';
import { calculateTip } from './engine';

const TIP_PRESETS = [10, 15, 18, 20, 25, 30];

export default function TipCalculatorPage() {
  const [bill,    setBill]    = useState('50');
  const [tipPct,  setTipPct]  = useState(20);
  const [splitBy, setSplitBy] = useState(1);

  const result = calculateTip({ bill: parseFloat(bill) || 0, tipPct, splitBy });

  const fmt = (n: number) => '$' + n.toFixed(2);

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/utility" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Utility</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Tip Calculator</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Tip Calculator</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Calculate tip amount and split the bill between multiple people.</p>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {/* Bill */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Bill amount</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 'var(--space-3)', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: 'var(--color-text-secondary)' }}>$</span>
            <input type="number" value={bill} onChange={e => setBill(e.target.value)} min="0" step="0.01"
              style={{ width: '100%', padding: 'var(--space-3) var(--space-3) var(--space-3) var(--space-8)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '24px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box', fontWeight: '700' }}
            />
          </div>
        </div>

        {/* Tip % */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>Tip percentage</label>
            <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-brand-500)' }}>{tipPct}%</span>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)', flexWrap: 'wrap' }}>
            {TIP_PRESETS.map(p => (
              <button key={p} onClick={() => setTipPct(p)} style={{ padding: 'var(--space-2) var(--space-3)', background: tipPct === p ? 'var(--color-brand-500)' : 'var(--color-surface-2)', color: tipPct === p ? '#fff' : 'var(--color-text-secondary)', border: '1px solid ' + (tipPct === p ? 'var(--color-brand-500)' : 'var(--color-border)'), borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>{p}%</button>
            ))}
          </div>
          <input type="range" min={0} max={50} value={tipPct} onChange={e => setTipPct(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--color-brand-500)' }} />
        </div>

        {/* Split */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>Split between</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <button onClick={() => setSplitBy(Math.max(1, splitBy - 1))} style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-full)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
            <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--color-brand-500)', minWidth: '60px', textAlign: 'center' }}>{splitBy}</span>
            <button onClick={() => setSplitBy(splitBy + 1)} style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-full)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>{splitBy === 1 ? 'person' : 'people'}</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
        {[
          { label: 'Tip amount',       value: fmt(result.tipAmount),    highlight: false },
          { label: 'Total bill',       value: fmt(result.total),        highlight: false },
          { label: 'Tip per person',   value: fmt(result.tipPerPerson), highlight: splitBy > 1 },
          { label: 'Total per person', value: fmt(result.perPerson),    highlight: splitBy > 1 },
        ].map(s => (
          <div key={s.label} style={{ background: s.highlight ? 'var(--color-brand-50)' : 'var(--color-surface)', border: '1px solid ' + (s.highlight ? 'var(--color-brand-500)' : 'var(--color-border)'), borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.07em', textTransform: 'uppercase', color: s.highlight ? 'var(--color-brand-500)' : 'var(--color-text-tertiary)', marginBottom: 'var(--space-2)' }}>{s.label}</div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: s.highlight ? 'var(--color-brand-500)' : 'var(--color-text-primary)', fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
