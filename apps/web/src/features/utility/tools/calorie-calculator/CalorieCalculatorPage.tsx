import { useState } from 'react';
import { calculateCalories, ACTIVITY_LABELS } from './engine';
import type { CalorieOptions, ActivityLevel, Goal } from './engine';

const DEFAULT: CalorieOptions = { weight: 75, height: 175, age: 30, sex: 'male', activity: 'moderate', goal: 'maintain', unit: 'metric' };

export default function CalorieCalculatorPage() {
  const [opts,   setOpts]   = useState<CalorieOptions>(DEFAULT);
  const [result, setResult] = useState<ReturnType<typeof calculateCalories> | null>(null);

  function set<K extends keyof CalorieOptions>(key: K, val: CalorieOptions[K]) { setOpts(o => ({ ...o, [key]: val })); }

  function calculate() { setResult(calculateCalories(opts)); }

  const inputStyle = { width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '16px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box' as const };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/utility" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Utility</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Calorie Calculator</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Calorie Calculator</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Calculate daily calorie needs (TDEE) and macros using the Mifflin-St Jeor equation.</p>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
        {/* Unit toggle */}
        <div style={{ display: 'flex', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)', padding: '3px', gap: '2px', width: 'fit-content', marginBottom: 'var(--space-5)' }}>
          {(['metric', 'imperial'] as const).map(u => (
            <button key={u} onClick={() => set('unit', u)} style={{ padding: 'var(--space-2) var(--space-5)', background: opts.unit === u ? 'var(--color-surface)' : 'transparent', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: opts.unit === u ? '600' : '400', color: opts.unit === u ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)', textTransform: 'capitalize' }}>{u}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Weight ({opts.unit === 'metric' ? 'kg' : 'lbs'})</label>
            <input type="number" value={opts.weight} onChange={e => set('weight', parseFloat(e.target.value) || 0)} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Height ({opts.unit === 'metric' ? 'cm' : 'inches'})</label>
            <input type="number" value={opts.height} onChange={e => set('height', parseFloat(e.target.value) || 0)} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Age</label>
            <input type="number" value={opts.age} onChange={e => set('age', parseInt(e.target.value) || 0)} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Sex</label>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              {(['male', 'female'] as const).map(s => (
                <button key={s} onClick={() => set('sex', s)} style={{ flex: 1, padding: 'var(--space-3)', background: opts.sex === s ? 'var(--color-brand-500)' : 'var(--color-surface-2)', color: opts.sex === s ? '#fff' : 'var(--color-text-secondary)', border: '1px solid ' + (opts.sex === s ? 'var(--color-brand-500)' : 'var(--color-border)'), borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)', textTransform: 'capitalize' }}>{s}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Activity level</label>
          <select value={opts.activity} onChange={e => set('activity', e.target.value as ActivityLevel)} style={{ ...inputStyle, cursor: 'pointer' }}>
            {(Object.entries(ACTIVITY_LABELS) as [ActivityLevel, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 'var(--space-5)' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>Goal</label>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {([['lose', '🏃 Lose weight'], ['maintain', '⚖️ Maintain'], ['gain', '💪 Gain muscle']] as [Goal, string][]).map(([g, l]) => (
              <button key={g} onClick={() => set('goal', g)} style={{ flex: 1, padding: 'var(--space-3)', background: opts.goal === g ? 'var(--color-brand-500)' : 'var(--color-surface-2)', color: opts.goal === g ? '#fff' : 'var(--color-text-secondary)', border: '1px solid ' + (opts.goal === g ? 'var(--color-brand-500)' : 'var(--color-border)'), borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>{l}</button>
            ))}
          </div>
        </div>

        <button onClick={calculate} style={{ width: '100%', padding: 'var(--space-3)', background: 'var(--color-brand-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 4px 12px rgb(46 124 246 / 0.35)' }}>
          Calculate →
        </button>
      </div>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
            {[
              { label: 'BMR', value: result.bmr + ' cal', sub: 'Basal metabolic rate' },
              { label: 'TDEE', value: result.tdee + ' cal', sub: 'Total daily energy' },
              { label: 'Target', value: result.target + ' cal', sub: opts.goal === 'lose' ? 'Deficit -500' : opts.goal === 'gain' ? 'Surplus +300' : 'Maintenance', highlight: true },
            ].map(s => (
              <div key={s.label} style={{ background: s.highlight ? 'var(--color-brand-50)' : 'var(--color-surface)', border: '1px solid ' + (s.highlight ? 'var(--color-brand-500)' : 'var(--color-border)'), borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.07em', textTransform: 'uppercase', color: s.highlight ? 'var(--color-brand-500)' : 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)' }}>{s.label}</div>
                <div style={{ fontSize: '22px', fontWeight: '900', color: s.highlight ? 'var(--color-brand-500)' : 'var(--color-text-primary)' }}>{s.value}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginTop: '4px' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-5)' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>Daily macros</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
              {[
                { label: 'Protein', value: result.protein + 'g', color: '#3B82F6', pct: Math.round(result.protein * 4 / result.target * 100) },
                { label: 'Carbs',   value: result.carbs   + 'g', color: '#10B981', pct: Math.round(result.carbs * 4   / result.target * 100) },
                { label: 'Fat',     value: result.fat     + 'g', color: '#F59E0B', pct: 25 },
              ].map(m => (
                <div key={m.label} style={{ textAlign: 'center', padding: 'var(--space-4)', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ fontSize: '24px', fontWeight: '900', color: m.color }}>{m.value}</div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>{m.label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>{m.pct}% of calories</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--space-4) var(--space-5)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>BMI: <strong style={{ color: 'var(--color-text-primary)' }}>{result.bmi}</strong> — {result.bmiCategory}</span>
          </div>
        </div>
      )}
    </div>
  );
}
