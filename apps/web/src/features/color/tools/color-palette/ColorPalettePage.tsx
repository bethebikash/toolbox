import { useState } from 'react';
import { generatePalette } from './engine';

export default function ColorPalettePage() {
  const [color,  setColor]  = useState('#2E7CF6');
  const [copied, setCopied] = useState<string | null>(null);

  const palettes = generatePalette(color);

  function copy(hex: string) {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/color" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Design</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Color Palette</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Color Palette Generator</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Generate harmonious color palettes from any base color.</p>
      </div>

      {/* Picker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-8)', padding: 'var(--space-5)', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
        <input type="color" value={color} onChange={e => setColor(e.target.value)}
          style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', cursor: 'pointer', padding: '3px' }}
        />
        <div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{color.toUpperCase()}</div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>Base color — 4 harmony types generated</div>
        </div>
        <input type="text" value={color.toUpperCase()} onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setColor(e.target.value); }}
          style={{ marginLeft: 'auto', padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '15px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', width: '120px' }}
        />
      </div>

      {/* Palettes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {palettes.map(palette => (
          <div key={palette.name} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: '14px', fontWeight: '700', color: 'var(--color-text-primary)' }}>{palette.name}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
              {palette.colors.map(c => (
                <button key={c.hex} onClick={() => copy(c.hex)} title={c.hex}
                  style={{ padding: 0, border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', background: 'transparent' }}>
                  <div style={{ height: '80px', background: c.hex, position: 'relative', transition: 'transform var(--duration-fast)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scaleY(1.08)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scaleY(1)'; }}>
                    {copied === c.hex && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: '20px' }}>✓</div>
                    )}
                  </div>
                  <div style={{ padding: 'var(--space-2)', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: '1px' }}>{c.name}</div>
                    <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{c.hex.toUpperCase()}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
