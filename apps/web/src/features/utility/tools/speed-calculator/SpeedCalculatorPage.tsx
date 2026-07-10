import { useState } from 'react';
import { calcSpeed, convertSpeed, toMeters, toSeconds, SPEED_LABELS } from './engine';
import type { SpeedUnit, DistanceUnit, TimeUnit } from './engine';

export default function SpeedCalculatorPage() {
  const [distance,   setDistance]   = useState('100');
  const [distUnit,   setDistUnit]   = useState<DistanceUnit>('meters');
  const [time,       setTime]       = useState('10');
  const [timeUnit,   setTimeUnit]   = useState<TimeUnit>('seconds');
  const [copied,     setCopied]     = useState<string | null>(null);

  const distM  = toMeters(parseFloat(distance) || 0, distUnit);
  const timeSec= toSeconds(parseFloat(time) || 0, timeUnit);
  const result = calcSpeed(distM, timeSec);

  function copy(unit: SpeedUnit) {
    const val = result.allSpeeds[unit];
    navigator.clipboard.writeText(val.toFixed(4));
    setCopied(unit);
    setTimeout(() => setCopied(null), 1500);
  }

  const selectStyle = { padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '14px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', cursor: 'pointer' };
  const inputStyle  = { width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '18px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box' as const, fontWeight: '700' as const };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/utility" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Utility</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Speed Calculator</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Speed Calculator</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Calculate speed from distance and time, with automatic unit conversion.</p>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 'var(--space-4)', alignItems: 'end', marginBottom: 'var(--space-4)' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Distance</label>
            <input type="number" value={distance} onChange={e => setDistance(e.target.value)} min="0" style={inputStyle} />
            <select value={distUnit} onChange={e => setDistUnit(e.target.value as DistanceUnit)} style={{ ...selectStyle, width: '100%', marginTop: 'var(--space-2)' }}>
              <option value="meters">Meters</option>
              <option value="km">Kilometers</option>
              <option value="miles">Miles</option>
              <option value="feet">Feet</option>
              <option value="nautical-miles">Nautical miles</option>
            </select>
          </div>
          <div style={{ fontSize: '24px', color: 'var(--color-text-tertiary)', paddingBottom: 'var(--space-8)', textAlign: 'center' }}>÷</div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Time</label>
            <input type="number" value={time} onChange={e => setTime(e.target.value)} min="0" style={inputStyle} />
            <select value={timeUnit} onChange={e => setTimeUnit(e.target.value as TimeUnit)} style={{ ...selectStyle, width: '100%', marginTop: 'var(--space-2)' }}>
              <option value="seconds">Seconds</option>
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
          Speed in all units
        </div>
        {(Object.keys(SPEED_LABELS) as SpeedUnit[]).map((unit, i, arr) => {
          const val = result.allSpeeds[unit];
          return (
            <div key={unit} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4) var(--space-5)', borderBottom: i < arr.length - 1 ? '1px solid var(--color-border)' : 'none', gap: 'var(--space-4)' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', minWidth: '80px' }}>{SPEED_LABELS[unit]}</span>
              <span style={{ fontSize: '16px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--color-text-primary)', flex: 1 }}>{val.toFixed(4)}</span>
              <button onClick={() => copy(unit)} style={{ background: copied === unit ? 'var(--color-success)' : 'none', color: copied === unit ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied === unit ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>
                {copied === unit ? '✓' : 'Copy'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
