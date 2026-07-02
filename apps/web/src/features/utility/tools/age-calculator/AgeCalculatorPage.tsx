import { useState } from 'react';
import { calculateAge } from './engine';
import type { AgeResult } from './engine';

export default function AgeCalculatorPage() {
  const today = new Date().toISOString().split('T')[0]!;
  const [birth,  setBirth]  = useState('1990-01-01');
  const [toDate, setToDate] = useState(today);
  const [result, setResult] = useState<AgeResult | null>(null);
  const [error,  setError]  = useState('');

  function calculate() {
    if (!birth) { setError('Please enter a birth date'); return; }
    if (new Date(birth) > new Date(toDate)) { setError('Birth date must be before the target date'); return; }
    setError('');
    setResult(calculateAge(birth, toDate));
  }

  const stats = result ? [
    { label: 'Total days',    value: result.totalDays.toLocaleString() },
    { label: 'Total weeks',   value: result.totalWeeks.toLocaleString() },
    { label: 'Total hours',   value: result.totalHours.toLocaleString() },
    { label: 'Total minutes', value: result.totalMinutes.toLocaleString() },
  ] : [];

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/utility" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Utility Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Age Calculator</span>
      </div>

      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Age Calculator</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>
          Calculate exact age in years, months and days. Get total days, weeks, hours and more.
        </p>
      </div>

      {/* Input */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Date of birth</label>
            <input type="date" value={birth} max={today}
              onChange={e => setBirth(e.target.value)}
              style={{ width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '15px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Age at date</label>
            <input type="date" value={toDate} max={today}
              onChange={e => setToDate(e.target.value)}
              style={{ width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '15px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>
        {error && <div style={{ fontSize: '13px', color: 'var(--color-danger)', marginBottom: 'var(--space-4)' }}>⚠ {error}</div>}
        <button onClick={calculate} style={{ width: '100%', padding: 'var(--space-3)', background: 'var(--color-brand-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 4px 12px rgb(46 124 246 / 0.35)' }}>
          Calculate age →
        </button>
      </div>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

          {/* Main result */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-8)', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-4)' }}>You are</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-8)', flexWrap: 'wrap' }}>
              {[
                { value: result.years,  label: 'Years' },
                { value: result.months, label: 'Months' },
                { value: result.days,   label: 'Days' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '56px', fontWeight: '800', color: 'var(--color-brand-500)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
                  <div style={{ fontSize: '14px', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-1)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }}>
            {stats.map(s => (
              <div key={s.label} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--space-4)' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)' }}>{s.label}</div>
                <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-brand-500)', fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Extra info */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            {[
              ['Born on',         result.dayOfWeek],
              ['Zodiac sign',     result.zodiac],
              ['Chinese zodiac',  result.chineseZodiac],
              ['Next birthday',   `${result.nextBirthday.date} (in ${result.nextBirthday.daysUntil} day${result.nextBirthday.daysUntil !== 1 ? 's' : ''})`],
            ].map(([label, value], i) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4) var(--space-5)', borderBottom: i < 3 ? '1px solid var(--color-border)' : 'none' }}>
                <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>{label}</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
