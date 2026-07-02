import { useState } from 'react';
import { convert, formatResult, UNITS, CATEGORY_LABELS } from './engine';
import type { UnitCategory } from './engine';

const CATEGORIES = Object.keys(CATEGORY_LABELS) as UnitCategory[];

export default function UnitConverterPage() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [value,    setValue]    = useState('1');
  const [fromId,   setFromId]   = useState('m');
  const [toId,     setToId]     = useState('ft');
  const [copied,   setCopied]   = useState(false);

  const units  = UNITS[category];
  const numVal = parseFloat(value) || 0;
  const result = convert(numVal, fromId, toId, category);

  function switchCategory(cat: UnitCategory) {
    setCategory(cat);
    const us = UNITS[cat];
    setFromId(us[0]!.id);
    setToId(us[1]!.id);
  }

  function swap() {
    setFromId(toId);
    setToId(fromId);
  }

  function copy() {
    navigator.clipboard.writeText(formatResult(result));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const selectStyle = {
    width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-border-2)',
    borderRadius: 'var(--radius-md)', fontSize: '15px', fontFamily: 'var(--font-sans)',
    color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none',
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/utility" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Utility Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Unit Converter</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Unit Converter</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Convert between length, weight, temperature, area, volume, speed and data units.</p>
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => switchCategory(cat)} style={{
            padding: 'var(--space-2) var(--space-4)',
            background: category === cat ? 'var(--color-brand-500)' : 'var(--color-surface)',
            color: category === cat ? '#fff' : 'var(--color-text-secondary)',
            border: '1px solid ' + (category === cat ? 'var(--color-brand-500)' : 'var(--color-border)'),
            borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: '500',
            cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all var(--duration-fast)',
          }}>{CATEGORY_LABELS[cat]}</button>
        ))}
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 'var(--space-4)', alignItems: 'end' }}>
          {/* From */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>From</label>
            <select value={fromId} onChange={e => setFromId(e.target.value)} style={selectStyle}>
              {units.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
            </select>
            <input type="number" value={value} onChange={e => setValue(e.target.value)}
              style={{ ...selectStyle, marginTop: 'var(--space-3)', fontSize: '24px', fontWeight: '700', textAlign: 'center' }}
            />
          </div>

          {/* Swap */}
          <button onClick={swap} style={{ padding: 'var(--space-3)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontSize: '18px', lineHeight: 1, marginBottom: 'var(--space-1)' }}>
            ⇄
          </button>

          {/* To */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>To</label>
            <select value={toId} onChange={e => setToId(e.target.value)} style={selectStyle}>
              {units.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
            </select>
            <div style={{ ...selectStyle, marginTop: 'var(--space-3)', fontSize: '24px', fontWeight: '700', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)', minHeight: '58px', cursor: 'pointer' }} onClick={copy}>
              <span style={{ color: 'var(--color-brand-500)' }}>{formatResult(result)}</span>
              <span style={{ fontSize: '12px', color: copied ? 'var(--color-success)' : 'var(--color-text-tertiary)', fontWeight: '500' }}>{copied ? '✓' : 'Copy'}</span>
            </div>
          </div>
        </div>

        {/* All conversions */}
        <div style={{ marginTop: 'var(--space-6)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-5)' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-3)' }}>
            {value || '0'} {units.find(u => u.id === fromId)?.label} =
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-2)' }}>
            {units.filter(u => u.id !== fromId).map(u => {
              const res = convert(numVal, fromId, u.id, category);
              return (
                <div key={u.id} style={{ padding: 'var(--space-3)', background: u.id === toId ? 'var(--color-brand-50)' : 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid ' + (u.id === toId ? 'var(--color-brand-500)' : 'var(--color-border)'), cursor: 'pointer' }}
                  onClick={() => setToId(u.id)}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: u.id === toId ? 'var(--color-brand-500)' : 'var(--color-text-primary)' }}>{formatResult(res)}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{u.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
