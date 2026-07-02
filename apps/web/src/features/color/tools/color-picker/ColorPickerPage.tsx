import { useState } from 'react';
import { parseColor, generateShades } from './engine';
import type { ColorValue } from './engine';

export default function ColorPickerPage() {
  const [hex,    setHex]    = useState('#2E7CF6');
  const [copied, setCopied] = useState<string | null>(null);
  const color  = parseColor(hex);
  const shades = generateShades(hex);

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  }

  const formats: { label: string; value: string }[] = [
    { label: 'HEX',  value: color.hex },
    { label: 'RGB',  value: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})` },
    { label: 'HSL',  value: `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)` },
    { label: 'HSV',  value: `hsv(${color.hsv.h}, ${color.hsv.s}%, ${color.hsv.v}%)` },
    { label: 'CMYK', value: `cmyk(${color.cmyk.c}%, ${color.cmyk.m}%, ${color.cmyk.y}%, ${color.cmyk.k}%)` },
  ];

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/color" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Color & Design</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Color Picker</span>
      </div>

      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Color Picker</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>
          Pick a color and get HEX, RGB, HSL, HSV and CMYK values instantly.
        </p>
      </div>

      {/* Picker + preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ height: '160px', background: hex }} />
          <div style={{ padding: 'var(--space-4)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer' }}>
              <input type="color" value={hex}
                onChange={e => setHex(e.target.value)}
                style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', cursor: 'pointer', padding: '2px' }}
              />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '600' }}>Click to pick</div>
                <input
                  type="text"
                  value={hex}
                  onChange={e => {
                    const v = e.target.value;
                    if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setHex(v);
                  }}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: '700', color: 'var(--color-text-primary)', background: 'none', border: 'none', outline: 'none', width: '120px' }}
                />
              </div>
            </label>
          </div>
        </div>

        {/* Color values */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          {formats.map((f, i) => (
            <div key={f.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-4)', borderBottom: i < formats.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-text-tertiary)', width: '36px', letterSpacing: '0.04em' }}>{f.label}</span>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-text-primary)' }}>{f.value}</code>
              </div>
              <button onClick={() => copy(f.value)} style={{
                padding: '2px 10px',
                background: copied === f.value ? 'var(--color-success)' : 'var(--color-surface-2)',
                color: copied === f.value ? '#fff' : 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
                fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500',
                transition: 'all var(--duration-fast)',
              }}>
                {copied === f.value ? '✓' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Shades */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
          Shades
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)' }}>
          {shades.map((shade, i) => (
            <button key={i} onClick={() => copy(shade)} title={shade}
              style={{ height: '80px', background: shade, border: 'none', cursor: 'pointer', position: 'relative', transition: 'transform var(--duration-fast)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scaleY(1.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scaleY(1)'; }}
            >
              {copied === shade && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: '16px' }}>✓</div>
              )}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)' }}>
          {shades.map((shade, i) => (
            <div key={i} style={{ padding: '4px 2px', textAlign: 'center', fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)', overflow: 'hidden' }}>
              {shade.toUpperCase()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
