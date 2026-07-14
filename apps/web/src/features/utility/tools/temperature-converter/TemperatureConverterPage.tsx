import { useState } from 'react';
import { convertTemperature, UNIT_LABELS, NOTABLE } from './engine';
import type { TempUnit } from './engine';

const UNITS: TempUnit[] = ['celsius', 'fahrenheit', 'kelvin', 'rankine'];
const SYMBOLS: Record<TempUnit, string> = { celsius: '°C', fahrenheit: '°F', kelvin: 'K', rankine: '°R' };

export default function TemperatureConverterPage() {
  const [value,  setValue]  = useState('100');
  const [from,   setFrom]   = useState<TempUnit>('celsius');
  const [copied, setCopied] = useState<string | null>(null);

  const result = convertTemperature(parseFloat(value) || 0, from);

  function copy(unit: TempUnit) {
    const val = result[unit];
    navigator.clipboard.writeText(String(val));
    setCopied(unit);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div style={{ maxWidth: '620px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/utility" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Utility</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Temperature Converter</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Temperature Converter</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Convert between Celsius, Fahrenheit, Kelvin and Rankine.</p>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
          {UNITS.map(u => (
            <button key={u} onClick={() => setFrom(u)} style={{ padding: 'var(--space-2) var(--space-4)', background: from === u ? 'var(--color-brand-500)' : 'var(--color-surface-2)', color: from === u ? '#fff' : 'var(--color-text-secondary)', border: '1px solid ' + (from === u ? 'var(--color-brand-500)' : 'var(--color-border)'), borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>{SYMBOLS[u]}</button>
          ))}
        </div>
        <div style={{ position: 'relative' }}>
          <input type="number" value={value} onChange={e => setValue(e.target.value)}
            style={{ width: '100%', padding: 'var(--space-4) var(--space-16) var(--space-4) var(--space-4)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '28px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box', fontWeight: '800' }}
          />
          <span style={{ position: 'absolute', right: 'var(--space-4)', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', fontWeight: '700', color: 'var(--color-brand-500)' }}>{SYMBOLS[from]}</span>
        </div>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden', marginBottom: 'var(--space-4)' }}>
        {UNITS.filter(u => u !== from).map((u, i, arr) => (
          <div key={u} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4) var(--space-5)', borderBottom: i < arr.length - 1 ? '1px solid var(--color-border)' : 'none', gap: 'var(--space-4)' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text-tertiary)', marginBottom: '2px' }}>{UNIT_LABELS[u]}</div>
              <div style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>{result[u]} <span style={{ fontSize: '16px', color: 'var(--color-text-tertiary)' }}>{SYMBOLS[u]}</span></div>
            </div>
            <button onClick={() => copy(u)} style={{ background: copied === u ? 'var(--color-success)' : 'none', color: copied === u ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied === u ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>
              {copied === u ? '✓' : 'Copy'}
            </button>
          </div>
        ))}
      </div>

      {/* Notable temps */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>Notable temperatures</div>
        {NOTABLE.map((n, i) => {
          const r = convertTemperature(n.celsius, 'celsius');
          return (
            <button key={n.label} onClick={() => { setValue(String(r[from])); }}
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) var(--space-5)', borderBottom: i < NOTABLE.length - 1 ? '1px solid var(--color-border)' : 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'background var(--duration-fast)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-brand-50)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
              <span style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>{n.label}</span>
              <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>{n.celsius}°C / {r.fahrenheit}°F</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
