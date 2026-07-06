import { useState } from 'react';
import { generateCSS, generateTailwind, generateSCSS, DIRECTIONS, PRESETS, DEFAULT_GRADIENT } from './engine';
import type { GradientOptions, ColorStop, GradientType } from './engine';

type CopyKey = 'css' | 'tailwind' | 'scss' | null;

export default function GradientGeneratorPage() {
  const [opts,   setOpts]   = useState<GradientOptions>(DEFAULT_GRADIENT);
  const [copied, setCopied] = useState<CopyKey>(null);

  const css      = generateCSS(opts);
  const tailwind = generateTailwind(opts);
  const scss     = generateSCSS(opts);

  function copy(text: string, key: CopyKey) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  function addStop() {
    const mid: ColorStop = { id: crypto.randomUUID(), color: '#ffffff', position: 50 };
    setOpts(o => ({ ...o, stops: [...o.stops, mid].sort((a, b) => a.position - b.position) }));
  }

  function removeStop(id: string) {
    if (opts.stops.length <= 2) return;
    setOpts(o => ({ ...o, stops: o.stops.filter(s => s.id !== id) }));
  }

  function updateStop(id: string, patch: Partial<ColorStop>) {
    setOpts(o => ({ ...o, stops: o.stops.map(s => s.id === id ? { ...s, ...patch } : s) }));
  }

  function applyPreset(preset: typeof PRESETS[0]) {
    setOpts(o => ({
      ...o,
      stops: preset.stops.map((s, i) => ({ ...s, id: String(i + 1) })),
    }));
  }

  const btnStyle = (active: boolean) => ({
    padding: 'var(--space-2) var(--space-3)',
    background: active ? 'var(--color-brand-500)' : 'var(--color-surface-2)',
    color: active ? '#fff' : 'var(--color-text-secondary)',
    border: '1px solid ' + (active ? 'var(--color-brand-500)' : 'var(--color-border)'),
    borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '500',
    cursor: 'pointer', fontFamily: 'var(--font-sans)',
  });

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/color" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Color & Design</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Gradient Generator</span>
      </div>

      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Gradient Generator</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>
          Create CSS gradients visually. Copy as CSS, Tailwind or SCSS.
        </p>
      </div>

      {/* Live preview */}
      <div style={{ height: '200px', borderRadius: 'var(--radius-2xl)', background: css, marginBottom: 'var(--space-6)', boxShadow: 'var(--shadow-xl)', transition: 'background var(--duration-normal)' }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--space-6)' }}>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

          {/* Type */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-5)' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>Type</div>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              {(['linear', 'radial', 'conic'] as GradientType[]).map(t => (
                <button key={t} onClick={() => setOpts(o => ({ ...o, type: t }))} style={{ ...btnStyle(opts.type === t), textTransform: 'capitalize', flex: 1, padding: 'var(--space-2)' }}>{t}</button>
              ))}
            </div>
          </div>

          {/* Direction — linear only */}
          {opts.type === 'linear' && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-5)' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>Direction</div>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {DIRECTIONS.map(d => (
                  <button key={d.value} onClick={() => setOpts(o => ({ ...o, direction: d.value }))} style={{ ...btnStyle(opts.direction === d.value), fontSize: '18px', width: '44px', textAlign: 'center' }}>{d.label}</button>
                ))}
              </div>
            </div>
          )}

          {/* Color stops */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Color stops</div>
              <button onClick={addStop} style={{ ...btnStyle(false), fontSize: '12px' }}>+ Add stop</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {opts.stops.map(stop => (
                <div key={stop.id} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 60px auto', gap: 'var(--space-3)', alignItems: 'center' }}>
                  <input type="color" value={stop.color} onChange={e => updateStop(stop.id, { color: e.target.value })}
                    style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', cursor: 'pointer', padding: '2px' }}
                  />
                  <input type="range" min={0} max={100} value={stop.position}
                    onChange={e => updateStop(stop.id, { position: Number(e.target.value) })}
                    style={{ accentColor: stop.color }}
                  />
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', textAlign: 'center' }}>{stop.position}%</div>
                  <button onClick={() => removeStop(stop.id)} disabled={opts.stops.length <= 2}
                    style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', cursor: opts.stops.length <= 2 ? 'not-allowed' : 'pointer', color: 'var(--color-text-tertiary)', opacity: opts.stops.length <= 2 ? 0.3 : 1, fontSize: '14px' }}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel — presets + code */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

          {/* Presets */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-5)' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>Presets</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
              {PRESETS.map(p => {
                const previewCss = `linear-gradient(to right, ${p.stops.map(s => `${s.color} ${s.position}%`).join(', ')})`;
                return (
                  <button key={p.name} onClick={() => applyPreset(p)} style={{ padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', background: 'var(--color-surface)', transition: 'border-color var(--duration-fast)' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: 'var(--radius-sm)', background: previewCss, flexShrink: 0 }} />
                    <span style={{ fontSize: '12px', color: 'var(--color-text-primary)', fontWeight: '500' }}>{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code outputs */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            {([
              { key: 'css' as CopyKey,      label: 'CSS',      code: `background: ${css};` },
              { key: 'tailwind' as CopyKey, label: 'Tailwind', code: tailwind },
              { key: 'scss' as CopyKey,     label: 'SCSS',     code: scss },
            ]).map((item, i) => (
              <div key={item.key} style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: i < 2 ? '1px solid var(--color-border)' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.06em', color: 'var(--color-text-tertiary)' }}>{item.label}</span>
                  <button onClick={() => copy(item.code, item.key)} style={{ background: copied === item.key ? 'var(--color-success)' : 'none', color: copied === item.key ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied === item.key ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>
                    {copied === item.key ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <code style={{ display: 'block', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)', wordBreak: 'break-all', lineHeight: 1.5 }}>{item.code}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
