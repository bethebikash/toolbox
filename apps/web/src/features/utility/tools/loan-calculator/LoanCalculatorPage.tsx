import { useState } from 'react';
import { calculateLoan, formatCurrency } from './engine';
import type { LoanOptions, LoanResult } from './engine';

export default function LoanCalculatorPage() {
  const [opts,   setOpts]   = useState<LoanOptions>({ principal: 200000, annualRate: 6.5, termMonths: 360 });
  const [result, setResult] = useState<LoanResult | null>(null);
  const [showAll, setShowAll] = useState(false);

  function calculate() { setResult(calculateLoan(opts)); }

  const inputStyle = { width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '16px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box' as const, textAlign: 'center' as const, fontWeight: '600' as const };

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/utility" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Utility Tools</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Loan Calculator</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Loan Calculator</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Calculate monthly payments, total interest and full amortization schedule.</p>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
          {[
            { label: 'Loan amount ($)', key: 'principal' as const, min: 1 },
            { label: 'Annual rate (%)', key: 'annualRate' as const, min: 0, step: '0.1' },
            { label: 'Term (months)',   key: 'termMonths' as const, min: 1 },
          ].map(field => (
            <div key={field.key}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)', textAlign: 'center' }}>{field.label}</label>
              <input type="number" min={field.min} step={field.step ?? 1} value={opts[field.key]}
                onChange={e => setOpts(o => ({ ...o, [field.key]: Number(e.target.value) }))}
                style={inputStyle}
              />
            </div>
          ))}
        </div>
        <button onClick={calculate} style={{ width: '100%', padding: 'var(--space-3)', background: 'var(--color-brand-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 4px 12px rgb(46 124 246 / 0.35)' }}>
          Calculate →
        </button>
      </div>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
            {[
              { label: 'Monthly payment', value: formatCurrency(result.monthlyPayment), highlight: true },
              { label: 'Total payment',   value: formatCurrency(result.totalPayment) },
              { label: 'Total interest',  value: formatCurrency(result.totalInterest) },
            ].map(s => (
              <div key={s.label} style={{ background: s.highlight ? 'var(--color-brand-50)' : 'var(--color-surface)', border: '1px solid ' + (s.highlight ? 'var(--color-brand-500)' : 'var(--color-border)'), borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.07em', textTransform: 'uppercase', color: s.highlight ? 'var(--color-brand-500)' : 'var(--color-text-tertiary)', marginBottom: 'var(--space-2)' }}>{s.label}</div>
                <div style={{ fontSize: '22px', fontWeight: '800', color: s.highlight ? 'var(--color-brand-500)' : 'var(--color-text-primary)', fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Amortization schedule */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Amortization schedule</span>
              <button onClick={() => setShowAll(s => !s)} style={{ fontSize: '13px', color: 'var(--color-brand-500)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '600' }}>
                {showAll ? 'Show less' : `Show all ${result.schedule.length} months`}
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: 'var(--color-surface-2)' }}>
                    {['Month', 'Payment', 'Principal', 'Interest', 'Balance'].map(h => (
                      <th key={h} style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right', fontWeight: '600', color: 'var(--color-text-secondary)', borderBottom: '1px solid var(--color-border)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(showAll ? result.schedule : result.schedule.slice(0, 12)).map((row, i) => (
                    <tr key={row.month} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--color-surface-2)' }}>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right', color: 'var(--color-text-tertiary)' }}>{row.month}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>{formatCurrency(row.payment)}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-success)' }}>{formatCurrency(row.principal)}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-warning)' }}>{formatCurrency(row.interest)}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
