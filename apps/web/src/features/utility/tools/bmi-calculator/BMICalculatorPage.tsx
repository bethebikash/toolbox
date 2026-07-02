import { useState } from 'react';
import { calculateBMI } from './engine';
import type { Unit, BMIResult } from './engine';

export default function BMICalculatorPage() {
  const [unit,   setUnit]   = useState<Unit>('metric');
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('175');
  const [result, setResult] = useState<BMIResult | null>(null);

  function calculate() {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!w || !h || w <= 0 || h <= 0) return;
    setResult(calculateBMI(w, h, unit));
  }

  const bmiPct = result ? Math.min(100, Math.max(0, ((result.bmi - 10) / 30) * 100)) : 0;

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/utility" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Utility Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>BMI Calculator</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>BMI Calculator</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Calculate your Body Mass Index. Supports metric and imperial units.</p>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
        {/* Unit toggle */}
        <div style={{ display: 'flex', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)', padding: '3px', gap: '2px', marginBottom: 'var(--space-5)', width: 'fit-content' }}>
          {(['metric', 'imperial'] as Unit[]).map(u => (
            <button key={u} onClick={() => setUnit(u)} style={{
              padding: 'var(--space-2) var(--space-6)',
              background: unit === u ? 'var(--color-surface)' : 'transparent',
              border: 'none', borderRadius: 'var(--radius-md)',
              fontSize: '14px', fontWeight: unit === u ? '600' : '400',
              color: unit === u ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              cursor: 'pointer', fontFamily: 'var(--font-sans)',
              boxShadow: unit === u ? 'var(--shadow-sm)' : 'none',
              textTransform: 'capitalize',
            }}>{u}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
              Weight ({unit === 'metric' ? 'kg' : 'lbs'})
            </label>
            <input type="number" value={weight} onChange={e => setWeight(e.target.value)} min="1"
              style={{ width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '18px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box', textAlign: 'center', fontWeight: '600' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
              Height ({unit === 'metric' ? 'cm' : 'inches'})
            </label>
            <input type="number" value={height} onChange={e => setHeight(e.target.value)} min="1"
              style={{ width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '18px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box', textAlign: 'center', fontWeight: '600' }}
            />
          </div>
        </div>

        <button onClick={calculate} style={{ width: '100%', padding: 'var(--space-3)', background: 'var(--color-brand-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 4px 12px rgb(46 124 246 / 0.35)' }}>
          Calculate BMI →
        </button>
      </div>

      {result && (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <div style={{ fontSize: '64px', fontWeight: '800', color: result.color, lineHeight: 1 }}>{result.bmi}</div>
            <div style={{ fontSize: '20px', fontWeight: '600', color: result.color, marginTop: 'var(--space-2)' }}>{result.category}</div>
            <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>{result.description}</div>
          </div>

          {/* BMI scale */}
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <div style={{ height: '12px', borderRadius: 'var(--radius-full)', background: 'linear-gradient(to right, #3B82F6 0%, #10B981 30%, #D97706 55%, #EF4444 75%, #991B1B 100%)', position: 'relative', overflow: 'visible' }}>
              <div style={{ position: 'absolute', top: '-4px', left: `calc(${bmiPct}% - 10px)`, width: '20px', height: '20px', borderRadius: 'var(--radius-full)', background: '#fff', border: `3px solid ${result.color}`, boxShadow: 'var(--shadow-md)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-2)' }}>
              <span>10</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
            </div>
          </div>

          <div style={{ padding: 'var(--space-4)', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)', fontSize: '14px', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
            Healthy BMI range: <strong style={{ color: 'var(--color-success)' }}>18.5 – 24.9</strong>
            <br />
            Your ideal weight: <strong style={{ color: 'var(--color-text-primary)' }}>
              {result.idealMin}–{result.idealMax} {unit === 'metric' ? 'kg' : 'lbs'}
            </strong>
          </div>
        </div>
      )}
    </div>
  );
}
