import { useState, useRef } from 'react';
import { addWatermark, formatBytes, DEFAULT_OPTS } from './engine';
import type { WatermarkOptions, WatermarkResult, WatermarkPosition } from './engine';

const POSITIONS: { id: WatermarkPosition; label: string }[] = [
  { id: 'top-left',      label: '↖' },
  { id: 'top-center',    label: '↑' },
  { id: 'top-right',     label: '↗' },
  { id: 'center',        label: '⊙' },
  { id: 'bottom-left',   label: '↙' },
  { id: 'bottom-center', label: '↓' },
  { id: 'bottom-right',  label: '↘' },
];

const FORMATS = [
  { id: 'image/jpeg' as const, label: 'JPG' },
  { id: 'image/png'  as const, label: 'PNG' },
  { id: 'image/webp' as const, label: 'WebP' },
];

export default function WatermarkPage() {
  const [file,     setFile]     = useState<File | null>(null);
  const [preview,  setPreview]  = useState<string | null>(null);
  const [opts,     setOpts]     = useState<WatermarkOptions>(DEFAULT_OPTS);
  const [result,   setResult]   = useState<WatermarkResult | null>(null);
  const [busy,     setBusy]     = useState(false);
  const [error,    setError]    = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError('');
  }

  async function apply() {
    if (!file || !opts.text.trim()) return;
    setBusy(true);
    setError('');
    try {
      const res = await addWatermark(file, opts);
      setResult(res);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function download() {
    if (!result || !file) return;
    const ext = opts.format.split('/')[1];
    const a   = document.createElement('a');
    a.href     = result.url;
    a.download = 'watermarked_' + file.name.replace(/\.[^.]+$/, '') + '.' + ext;
    a.click();
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/image" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Image Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Add Watermark</span>
      </div>

      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Add Watermark</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>
          Add a text watermark to your image. Choose position, size, color and opacity.
        </p>
      </div>

      {!file && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) handleFile(f); }}
          style={{ border: '2px dashed ' + (dragging ? 'var(--color-brand-500)' : 'var(--color-border-2)'), borderRadius: 'var(--radius-2xl)', padding: 'var(--space-16) var(--space-8)', textAlign: 'center', cursor: 'pointer', background: dragging ? 'var(--color-brand-50)' : 'var(--color-surface)', transition: 'all var(--duration-normal)' }}
        >
          <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-xl)', background: 'var(--color-brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)', fontSize: '24px' }}>💧</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Drop an image or <span style={{ color: 'var(--color-brand-500)' }}>browse files</span></div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>JPG, PNG, WebP, AVIF</div>
          <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      )}

      {file && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--space-6)' }}>

          {/* Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <img src={result?.url ?? preview ?? ''} alt="" style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', display: 'block', background: 'var(--color-surface-2)' }} />
              <div style={{ padding: 'var(--space-3) var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>{file.name} · {formatBytes(file.size)}</div>
                <button onClick={() => { setFile(null); setPreview(null); setResult(null); }}
                  style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-1) var(--space-3)', fontSize: '12px', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                  Change
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-3) var(--space-4)', fontSize: '14px', color: 'var(--color-danger)' }}>⚠ {error}</div>
            )}

            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              {result && (
                <button onClick={download} style={{ padding: 'var(--space-3) var(--space-5)', background: 'var(--color-success)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>↓ Download</button>
              )}
              <button onClick={apply} disabled={busy || !opts.text.trim()} style={{ flex: 1, padding: 'var(--space-3)', background: (busy || !opts.text.trim()) ? 'var(--color-border)' : 'var(--color-brand-500)', color: (busy || !opts.text.trim()) ? 'var(--color-text-tertiary)' : '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '14px', fontWeight: '600', cursor: (busy || !opts.text.trim()) ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', boxShadow: busy ? 'none' : '0 4px 12px rgb(46 124 246 / 0.35)' }}>
                {busy ? 'Adding watermark...' : 'Apply watermark →'}
              </button>
            </div>
          </div>

          {/* Options panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-5)' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-4)' }}>Watermark settings</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

                {/* Text */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Text</label>
                  <input type="text" value={opts.text} onChange={e => setOpts(o => ({ ...o, text: e.target.value }))}
                    style={{ width: '100%', padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '14px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Position grid */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Position</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', maxWidth: '160px' }}>
                    {POSITIONS.map(p => (
                      <button key={p.id} onClick={() => setOpts(o => ({ ...o, position: p.id }))} style={{
                        padding: 'var(--space-3)',
                        background: opts.position === p.id ? 'var(--color-brand-500)' : 'var(--color-surface-2)',
                        color: opts.position === p.id ? '#fff' : 'var(--color-text-secondary)',
                        border: '1px solid ' + (opts.position === p.id ? 'var(--color-brand-500)' : 'var(--color-border)'),
                        borderRadius: 'var(--radius-md)', fontSize: '16px',
                        cursor: 'pointer', fontFamily: 'var(--font-sans)',
                      }}>{p.label}</button>
                    ))}
                  </div>
                </div>

                {/* Font size */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Font size</label>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-brand-500)' }}>{opts.fontSize}px</span>
                  </div>
                  <input type="range" min={10} max={120} step={2} value={opts.fontSize}
                    onChange={e => setOpts(o => ({ ...o, fontSize: Number(e.target.value) }))}
                    style={{ width: '100%', accentColor: 'var(--color-brand-500)' }}
                  />
                </div>

                {/* Opacity */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Opacity</label>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-brand-500)' }}>{Math.round(opts.opacity * 100)}%</span>
                  </div>
                  <input type="range" min={0.1} max={1} step={0.05} value={opts.opacity}
                    onChange={e => setOpts(o => ({ ...o, opacity: Number(e.target.value) }))}
                    style={{ width: '100%', accentColor: 'var(--color-brand-500)' }}
                  />
                </div>

                {/* Color + Bold */}
                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                    <input type="color" value={opts.color} onChange={e => setOpts(o => ({ ...o, color: e.target.value }))}
                      style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', cursor: 'pointer', padding: '2px' }}
                    />
                    Color
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={opts.bold} onChange={e => setOpts(o => ({ ...o, bold: e.target.checked }))}
                      style={{ accentColor: 'var(--color-brand-500)', width: '16px', height: '16px' }}
                    />
                    Bold
                  </label>
                </div>

                {/* Output format */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Output</label>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    {FORMATS.map(f => (
                      <button key={f.id} onClick={() => setOpts(o => ({ ...o, format: f.id }))} style={{
                        flex: 1, padding: 'var(--space-2)',
                        background: opts.format === f.id ? 'var(--color-brand-500)' : 'var(--color-surface-2)',
                        color: opts.format === f.id ? '#fff' : 'var(--color-text-secondary)',
                        border: '1px solid ' + (opts.format === f.id ? 'var(--color-brand-500)' : 'var(--color-border)'),
                        borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '600',
                        cursor: 'pointer', fontFamily: 'var(--font-sans)',
                      }}>{f.label}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
