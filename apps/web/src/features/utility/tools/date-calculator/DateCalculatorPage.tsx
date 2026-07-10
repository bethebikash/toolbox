import { useState } from 'react';
import { dateDiff, addDays, addMonths, getWorkdays } from './engine';

export default function DateCalculatorPage() {
  const today = new Date().toISOString().split('T')[0]!;
  const [dateA,    setDateA]    = useState(today);
  const [dateB,    setDateB]    = useState(today);
  const [addDate,  setAddDate]  = useState(today);
  const [addAmt,   setAddAmt]   = useState('30');
  const [addUnit,  setAddUnit]  = useState<'days' | 'months'>('days');
  const [tab,      setTab]      = useState<'diff' | 'add'>('diff');

  const diff       = dateDiff(dateA, dateB);
  const addResult  = addUnit === 'days' ? addDays(addDate, parseInt(addAmt) || 0) : addMonths(addDate, parseInt(addAmt) || 0);
  const workdays   = getWorkdays(dateA, dateB);

  const inputStyle = { padding: 'var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '15px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', width: '100%', boxSizing: 'border-box' as const };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/utility" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Utility</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Date Calculator</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Date Calculator</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Calculate the difference between two dates or add days/months to a date.</p>
      </div>

      {/* Tab toggle */}
      <div style={{ display: 'flex', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)', padding: '3px', gap: '2px', width: 'fit-content', marginBottom: 'var(--space-6)' }}>
        {([['diff', 'Date difference'], ['add', 'Add / subtract']] as const).map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: 'var(--space-2) var(--space-5)', background: tab === t ? 'var(--color-surface)' : 'transparent', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: tab === t ? '600' : '400', color: tab === t ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: tab === t ? 'var(--shadow-sm)' : 'none' }}>{l}</button>
        ))}
      </div>

      {tab === 'diff' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div><label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Start date</label><input type="date" value={dateA} onChange={e => setDateA(e.target.value)} style={inputStyle} /></div>
              <div><label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>End date</label><input type="date" value={dateB} onChange={e => setDateB(e.target.value)} style={inputStyle} /></div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
            {[
              { label: 'Total days',  value: diff.totalDays.toLocaleString() },
              { label: 'Weeks + days',value: `${diff.weeks}w ${diff.days}d` },
              { label: 'Workdays',    value: workdays.toLocaleString() },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-1)' }}>{s.label}</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-brand-500)' }}>{s.value}</div>
              </div>
            ))}
          </div>

          {diff.totalDays > 0 && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-5)', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                {diff.years > 0 && <span>{diff.years} year{diff.years !== 1 ? 's' : ''}, </span>}
                {diff.months > 0 && <span>{diff.months} month{diff.months !== 1 ? 's' : ''}, </span>}
                <span>{diff.totalDays % 365 % 30} day{diff.totalDays % 365 % 30 !== 1 ? 's' : ''}</span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-1)' }}>{diff.isPast ? 'in the past' : 'in the future'}</div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)' }}>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Start date</label>
              <input type="date" value={addDate} onChange={e => setAddDate(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Amount</label>
                <input type="number" value={addAmt} onChange={e => setAddAmt(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Unit</label>
                <select value={addUnit} onChange={e => setAddUnit(e.target.value as 'days' | 'months')} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="days">Days</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>
          </div>
          <div style={{ background: 'var(--color-brand-50)', border: '1px solid var(--color-brand-500)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>{addDate} + {addAmt} {addUnit} =</div>
            <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--color-brand-500)', fontFamily: 'var(--font-mono)' }}>{addResult}</div>
          </div>
        </div>
      )}
    </div>
  );
}
