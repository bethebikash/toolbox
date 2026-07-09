import { useState } from 'react';
import { calculateAspectRatio, scaleToWidth, scaleToHeight, COMMON_SIZES } from './engine';

export default function AspectRatioPage() {
  const [w,       setW]       = useState('1920');
  const [h,       setH]       = useState('1080');
  const [scaleW,  setScaleW]  = useState('1280');
  const [scaleH,  setScaleH]  = useState('720');

  const width  = parseInt(w)  || 1;
  const height = parseInt(h)  || 1;
  const ratio  = calculateAspectRatio(width, height);

  const fromWidth  = scaleToWidth(ratio,  parseInt(scaleW) || 1);
  const fromHeight = scaleToHeight(ratio, parseInt(scaleH) || 1);

  function applyPreset(pw: number, ph: number) {
    setW(String(pw)); setH(String(ph));
    setScaleW(String(pw)); setScaleH(String(ph));
  }

  const inputStyle = { width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '18px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box' as const, fontWeight: '700' as const, textAlign: 'center' as const };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/utility" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Utility</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Aspect Ratio</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Aspect Ratio Calculator</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Calculate and scale aspect ratios for images, videos and screens.</p>
      </div>

      {/* Input */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 'var(--space-4)', alignItems: 'flex-end', marginBottom: 'var(--space-5)' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)', textAlign: 'center' }}>Width (px)</label>
            <input type="number" value={w} onChange={e => setW(e.target.value)} min="1" style={inputStyle} />
          </div>
          <div style={{ fontSize: '24px', color: 'var(--color-text-tertiary)', paddingBottom: 'var(--space-1)', textAlign: 'center' }}>×</div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)', textAlign: 'center' }}>Height (px)</label>
            <input type="number" value={h} onChange={e => setH(e.target.value)} min="1" style={inputStyle} />
          </div>
        </div>

        {/* Result */}
        <div style={{ textAlign: 'center', padding: 'var(--space-5)', background: 'var(--color-brand-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-brand-500)' }}>
          <div style={{ fontSize: '40px', fontWeight: '900', color: 'var(--color-brand-500)', letterSpacing: '-0.02em' }}>{ratio.ratio}</div>
          {ratio.commonName && <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>{ratio.commonName}</div>}
          <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginTop: '4px' }}>decimal: {ratio.decimal}</div>
        </div>
      </div>

      {/* Scale */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-5)', marginBottom: 'var(--space-4)' }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Scale to size</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-2)' }}>Given width →</label>
            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
              <input type="number" value={scaleW} onChange={e => setScaleW(e.target.value)} min="1" style={{ ...inputStyle, width: '100px', fontSize: '15px' }} />
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>→ height: <strong style={{ color: 'var(--color-brand-500)' }}>{fromWidth.height}px</strong></span>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-2)' }}>Given height →</label>
            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
              <input type="number" value={scaleH} onChange={e => setScaleH(e.target.value)} min="1" style={{ ...inputStyle, width: '100px', fontSize: '15px' }} />
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>→ width: <strong style={{ color: 'var(--color-brand-500)' }}>{fromHeight.width}px</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Common sizes */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>Common sizes</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 0 }}>
          {COMMON_SIZES.map((s, i) => {
            const r = calculateAspectRatio(s.w, s.h);
            return (
              <button key={s.label} onClick={() => applyPreset(s.w, s.h)} style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)', cursor: 'pointer', background: 'transparent', fontFamily: 'var(--font-sans)', textAlign: 'left', transition: 'background var(--duration-fast)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-brand-50)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '2px' }}>{s.label}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>{r.ratio}{r.commonName ? ` · ${r.commonName}` : ''}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
