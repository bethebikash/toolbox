import { useState } from 'react';
import { calculateInterest, fmt } from './engine';
import type { InterestOptions } from './engine';

const DEFAULT: InterestOptions = { principal: 10000, rate: 8, time: 5, timeUnit: 'years' };

export default function SimpleInterestPage() {
  const [opts, setOpts] = useState<InterestOptions>(DEFAULT);
  const result = calculateInterest(opts);

  function set<K extends keyof InterestOptions>(key: K, val: InterestOptions[K]) {
    setOpts(o => ({ ...o, [key]: val }));
  }

  const inputStyle = { width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '18px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box' as const, fontWeight: '700' as const };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/utility" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Utility</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Interest Calculator</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Interest Calculator</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Calculate simple and compound interest. Compare both methods side by side.</p>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <div><label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Principal ($)</label><input type="number" value={opts.principal} onChange={e => set('principal', parseFloat(e.target.value) || 0)} style={inputStyle} /></div>
          <div><label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Annual rate (%)</label><input type="number" value={opts.rate} onChange={e => set('rate', parseFloat(e.target.value) || 0)} step={0.1} style={inputStyle} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div><label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Time</label><input type="number" value={opts.time} onChange={e => set('time', parseFloat(e.target.value) || 0)} style={inputStyle} /></div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Unit</label>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              {(['years', 'months', 'days'] as const).map(u => (
                <button key={u} onClick={() => set('timeUnit', u)} style={{ flex: 1, padding: 'var(--space-2)', background: opts.timeUnit === u ? 'var(--color-brand-500)' : 'var(--color-surface-2)', color: opts.timeUnit === u ? '#fff' : 'var(--color-text-secondary)', border: '1px solid ' + (opts.timeUnit === u ? 'var(--color-brand-500)' : 'var(--color-border)'), borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-sans)', textTransform: 'capitalize' }}>{u}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
        {/* Simple interest */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', borderBottom: '1px solid var(--color-border)' }}>Simple Interest</div>
          <div style={{ padding: 'var(--space-4)' }}>
            <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--color-brand-500)', marginBottom: 'var(--space-1)' }}>{fmt(result.simpleInterest)}</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>Total: {fmt(result.totalAmount)}</div>
          </div>
        </div>
        {/* Compound */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', borderBottom: '1px solid var(--color-border)' }}>Compound (monthly)</div>
          <div style={{ padding: 'var(--space-4)' }}>
            <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--color-success)', marginBottom: 'var(--space-1)' }}>{fmt(result.compoundMonthly)}</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>Effective rate: {result.effectiveRate}%</div>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        {[
          { label: 'Principal',            value: fmt(opts.principal) },
          { label: 'Simple interest',      value: fmt(result.simpleInterest) },
          { label: 'Compound (monthly)',   value: fmt(result.compoundMonthly) },
          { label: 'Compound (annually)',  value: fmt(result.compoundYearly) },
          { label: 'Daily rate',           value: (result.dailyRate * 100).toFixed(4) + '%' },
          { label: 'Effective annual rate',value: result.effectiveRate + '%' },
        ].map((row, i) => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-5)', borderBottom: i < 5 ? '1px solid var(--color-border)' : 'none' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{row.label}</span>
            <span style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
