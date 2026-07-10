import { useState } from 'react';
import { calculateMortgage, fmt } from './engine';
import type { MortgageOptions } from './engine';

const DEFAULT: MortgageOptions = { homePrice: 400000, downPayment: 80000, annualRate: 7.0, termYears: 30, propertyTax: 1.2, insurance: 1200 };

export default function MortgageCalculatorPage() {
  const [opts, setOpts] = useState<MortgageOptions>(DEFAULT);
  const result = calculateMortgage(opts);

  function set(key: keyof MortgageOptions, val: number) { setOpts(o => ({ ...o, [key]: val })); }

  const inputStyle = { width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '16px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box' as const, fontWeight: '600' as const };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/utility" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Utility</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Mortgage Calculator</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Mortgage Calculator</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Calculate monthly mortgage payments including taxes and insurance.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {[
            { label: 'Home price ($)',    key: 'homePrice'   as const, step: 1000 },
            { label: 'Down payment ($)',  key: 'downPayment' as const, step: 1000 },
            { label: 'Annual rate (%)',   key: 'annualRate'  as const, step: 0.1 },
            { label: 'Term (years)',      key: 'termYears'   as const, step: 1 },
            { label: 'Property tax (% annual)', key: 'propertyTax' as const, step: 0.1 },
            { label: 'Insurance ($/year)', key: 'insurance'  as const, step: 100 },
          ].map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>{f.label}</label>
              <input type="number" value={opts[f.key]} onChange={e => set(f.key, parseFloat(e.target.value) || 0)} step={f.step} min={0} style={inputStyle} />
            </div>
          ))}
          <div style={{ padding: 'var(--space-3)', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            Down payment: <strong style={{ color: 'var(--color-brand-500)' }}>{result.downPct}%</strong> · Loan: <strong>{fmt(result.loanAmount)}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Monthly breakdown */}
          <div style={{ background: 'var(--color-brand-50)', border: '1px solid var(--color-brand-500)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-brand-500)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-2)' }}>Monthly payment</div>
            <div style={{ fontSize: '44px', fontWeight: '900', color: 'var(--color-brand-500)', lineHeight: 1 }}>{fmt(result.monthlyTotal)}</div>
          </div>

          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            {[
              { label: 'Principal & interest', value: fmt(result.monthlyPrincipal) },
              { label: 'Property tax',          value: fmt(result.monthlyTax) },
              { label: 'Insurance',             value: fmt(result.monthlyInsurance) },
            ].map((row, i) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-5)', borderBottom: i < 2 ? '1px solid var(--color-border)' : 'none' }}>
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{row.label}</span>
                <span style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>{row.value}</span>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            {[
              { label: 'Total paid',     value: fmt(result.totalPaid) },
              { label: 'Total interest', value: fmt(result.totalInterest), color: 'var(--color-warning)' },
              { label: 'Loan amount',    value: fmt(result.loanAmount) },
            ].map((row, i) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-5)', borderBottom: i < 2 ? '1px solid var(--color-border)' : 'none' }}>
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{row.label}</span>
                <span style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'var(--font-mono)', color: row.color ?? 'var(--color-text-primary)' }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
