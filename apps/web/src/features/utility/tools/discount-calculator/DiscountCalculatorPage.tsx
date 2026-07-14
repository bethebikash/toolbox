import { useState } from 'react';
import { calculateDiscount, reverseDiscount } from './engine';

export default function DiscountCalculatorPage() {
  const [price,     setPrice]     = useState('100');
  const [discount,  setDiscount]  = useState('20');
  const [isPct,     setIsPct]     = useState(true);
  const [tab,       setTab]       = useState<'forward' | 'reverse'>('forward');
  const [revFinal,  setRevFinal]  = useState('80');
  const [revPct,    setRevPct]    = useState('20');

  const result  = calculateDiscount(parseFloat(price) || 0, parseFloat(discount) || 0, isPct);
  const original = reverseDiscount(parseFloat(revFinal) || 0, parseFloat(revPct) || 0);

  const inputStyle = { width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '18px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box' as const, fontWeight: '700' as const };

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/utility" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Utility</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Discount Calculator</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Discount Calculator</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Calculate discounted prices, savings and find original prices from sale prices.</p>
      </div>

      <div style={{ display: 'flex', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)', padding: '3px', gap: '2px', marginBottom: 'var(--space-6)', width: 'fit-content' }}>
        {([['forward', 'Price → Discount'], ['reverse', 'Sale price → Original']] as const).map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: 'var(--space-2) var(--space-5)', background: tab === t ? 'var(--color-surface)' : 'transparent', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: tab === t ? '600' : '400', color: tab === t ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: tab === t ? 'var(--shadow-sm)' : 'none' }}>{l}</button>
        ))}
      </div>

      {tab === 'forward' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <div><label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Original price ($)</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} style={inputStyle} /></div>
              <div><label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Discount {isPct ? '(%)' : '($)'}</label><input type="number" value={discount} onChange={e => setDiscount(e.target.value)} style={inputStyle} /></div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button onClick={() => setIsPct(true)} style={{ flex: 1, padding: 'var(--space-2)', background: isPct ? 'var(--color-brand-500)' : 'var(--color-surface-2)', color: isPct ? '#fff' : 'var(--color-text-secondary)', border: '1px solid ' + (isPct ? 'var(--color-brand-500)' : 'var(--color-border)'), borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Percentage %</button>
              <button onClick={() => setIsPct(false)} style={{ flex: 1, padding: 'var(--space-2)', background: !isPct ? 'var(--color-brand-500)' : 'var(--color-surface-2)', color: !isPct ? '#fff' : 'var(--color-text-secondary)', border: '1px solid ' + (!isPct ? 'var(--color-brand-500)' : 'var(--color-border)'), borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Flat amount $</button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            {[
              { label: 'You save',   value: result.savings,        color: 'var(--color-success)' },
              { label: 'You pay',    value: result.youPay,         color: 'var(--color-brand-500)', big: true },
              { label: 'Discount',   value: result.discountPct + '%', color: 'var(--color-text-primary)' },
              { label: 'Off original', value: '$' + result.originalPrice.toFixed(2), color: 'var(--color-text-tertiary)' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)' }}>{s.label}</div>
                <div style={{ fontSize: s.big ? '28px' : '22px', fontWeight: '900', color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div><label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Sale price ($)</label><input type="number" value={revFinal} onChange={e => setRevFinal(e.target.value)} style={inputStyle} /></div>
              <div><label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Discount was (%)</label><input type="number" value={revPct} onChange={e => setRevPct(e.target.value)} style={inputStyle} /></div>
            </div>
          </div>
          <div style={{ background: 'var(--color-brand-50)', border: '1px solid var(--color-brand-500)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Original price was</div>
            <div style={{ fontSize: '44px', fontWeight: '900', color: 'var(--color-brand-500)', fontFamily: 'var(--font-mono)' }}>${original.toFixed(2)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
