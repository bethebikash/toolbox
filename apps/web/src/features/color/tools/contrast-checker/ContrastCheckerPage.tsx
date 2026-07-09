import { useState } from 'react';
import { checkContrast } from './engine';

export default function ContrastCheckerPage() {
  const [fg, setFg] = useState('#1a1d27');
  const [bg, setBg] = useState('#ffffff');

  const result = checkContrast(fg, bg);

  const Badge = ({ pass, label }: { pass: boolean; label: string }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) var(--space-4)', background: pass ? 'var(--color-success-bg)' : 'var(--color-danger-bg)', border: '1px solid ' + (pass ? 'var(--color-success)' : 'var(--color-danger)'), borderRadius: 'var(--radius-lg)' }}>
      <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)' }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: '700', color: pass ? 'var(--color-success)' : 'var(--color-danger)' }}>{pass ? '✓ Pass' : '✗ Fail'}</span>
    </div>
  );

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/color" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Design</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Contrast Checker</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>WCAG Contrast Checker</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Check color contrast ratios for WCAG AA and AAA accessibility compliance.</p>
      </div>

      {/* Live preview */}
      <div style={{ height: '140px', borderRadius: 'var(--radius-2xl)', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-6)', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: '900', color: fg, marginBottom: '4px' }}>The quick brown fox</div>
          <div style={{ fontSize: '14px', color: fg, opacity: 0.8 }}>Normal text sample — 14px regular</div>
        </div>
      </div>

      {/* Color pickers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        {[
          { label: 'Text color (foreground)', value: fg, set: setFg },
          { label: 'Background color',        value: bg, set: setBg },
        ].map(({ label, value, set }) => (
          <div key={label} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-4)' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>{label}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <input type="color" value={value} onChange={e => set(e.target.value)}
                style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', cursor: 'pointer', padding: '2px' }}
              />
              <input type="text" value={value.toUpperCase()} onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) set(e.target.value); }}
                style={{ flex: 1, padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '15px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none' }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Ratio + level */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)' }}>Contrast ratio</div>
          <div style={{ fontSize: '48px', fontWeight: '900', color: 'var(--color-text-primary)', lineHeight: 1 }}>{result.ratioFormatted}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-2)', textTransform: 'uppercase' }}>WCAG Level</div>
          <div style={{ fontSize: '28px', fontWeight: '900', padding: 'var(--space-2) var(--space-5)', borderRadius: 'var(--radius-lg)', background: result.level === 'Fail' ? 'var(--color-danger-bg)' : 'var(--color-success-bg)', color: result.level === 'Fail' ? 'var(--color-danger)' : 'var(--color-success)', border: '2px solid ' + (result.level === 'Fail' ? 'var(--color-danger)' : 'var(--color-success)') }}>
            {result.level}
          </div>
        </div>
      </div>

      {/* WCAG badges */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
        <Badge pass={result.aa_normal}  label="AA — Normal text (4.5:1)" />
        <Badge pass={result.aa_large}   label="AA — Large text (3:1)" />
        <Badge pass={result.aaa_normal} label="AAA — Normal text (7:1)" />
        <Badge pass={result.aaa_large}  label="AAA — Large text (4.5:1)" />
      </div>

      {/* Swap button */}
      <div style={{ textAlign: 'center' }}>
        <button onClick={() => { setFg(bg); setBg(fg); }} style={{ padding: 'var(--space-3) var(--space-6)', background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-lg)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
          ⇄ Swap colors
        </button>
      </div>
    </div>
  );
}
