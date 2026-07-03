import { useState, useRef } from 'react';
import { transformImage, formatBytes } from './engine';
import type { TransformOptions, TransformResult, RotateAngle, FlipDirection } from './engine';

const DEFAULT_OPTS: TransformOptions = {
  rotate:  0,
  flip:    'none',
  quality: 0.92,
  format:  'image/jpeg',
};

const FORMATS = [
  { id: 'image/jpeg' as const, label: 'JPG' },
  { id: 'image/png'  as const, label: 'PNG' },
  { id: 'image/webp' as const, label: 'WebP' },
];

export default function FlipRotatePage() {
  const [file,     setFile]     = useState<File | null>(null);
  const [preview,  setPreview]  = useState<string | null>(null);
  const [opts,     setOpts]     = useState<TransformOptions>(DEFAULT_OPTS);
  const [result,   setResult]   = useState<TransformResult | null>(null);
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

  async function run() {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const res = await transformImage(file, opts);
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
    a.download = file.name.replace(/\.[^.]+$/, '') + '_transformed.' + ext;
    a.click();
  }

  const rotateOptions: RotateAngle[] = [0, 90, 180, 270];
  const flipOptions: { id: FlipDirection; label: string }[] = [
    { id: 'none',       label: 'None' },
    { id: 'horizontal', label: '↔ Horizontal' },
    { id: 'vertical',   label: '↕ Vertical' },
    { id: 'both',       label: '↔↕ Both' },
  ];

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/image" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Image Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Flip & Rotate</span>
      </div>

      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Flip & Rotate Image</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>
          Rotate images 90°/180°/270° and flip horizontally or vertically. Files never leave your device.
        </p>
      </div>

      {/* Drop zone */}
      {!file && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) handleFile(f); }}
          style={{ border: '2px dashed ' + (dragging ? 'var(--color-brand-500)' : 'var(--color-border-2)'), borderRadius: 'var(--radius-2xl)', padding: 'var(--space-16) var(--space-8)', textAlign: 'center', cursor: 'pointer', background: dragging ? 'var(--color-brand-50)' : 'var(--color-surface)', transition: 'all var(--duration-normal)' }}
        >
          <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-xl)', background: 'var(--color-brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)', fontSize: '24px' }}>🔄</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Drop an image or <span style={{ color: 'var(--color-brand-500)' }}>browse files</span></div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>JPG, PNG, WebP, AVIF</div>
          <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      )}

      {file && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

          {/* Preview */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <img
              src={result?.url ?? preview ?? ''}
              alt=""
              style={{
                width: '100%', maxHeight: '360px', objectFit: 'contain',
                display: 'block', background: 'var(--color-surface-2)',
              }}
            />
            <div style={{ padding: 'var(--space-4) var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '2px' }}>{file.name}</div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
                  {formatBytes(file.size)}
                  {result && <span style={{ color: 'var(--color-success)', marginLeft: 'var(--space-2)' }}>→ {result.width}×{result.height}px</span>}
                </div>
              </div>
              <button onClick={() => { setFile(null); setPreview(null); setResult(null); }}
                style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', fontSize: '13px', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                Change
              </button>
            </div>
          </div>

          {/* Options */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)' }}>Transform</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {/* Rotate */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>Rotate</div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  {rotateOptions.map(r => (
                    <button key={r} onClick={() => setOpts(o => ({ ...o, rotate: r }))} style={{
                      padding: 'var(--space-2) var(--space-5)',
                      background: opts.rotate === r ? 'var(--color-brand-500)' : 'var(--color-surface-2)',
                      color: opts.rotate === r ? '#fff' : 'var(--color-text-secondary)',
                      border: '1px solid ' + (opts.rotate === r ? 'var(--color-brand-500)' : 'var(--color-border)'),
                      borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: '600',
                      cursor: 'pointer', fontFamily: 'var(--font-sans)',
                    }}>{r}°</button>
                  ))}
                </div>
              </div>

              {/* Flip */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>Flip</div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  {flipOptions.map(f => (
                    <button key={f.id} onClick={() => setOpts(o => ({ ...o, flip: f.id }))} style={{
                      padding: 'var(--space-2) var(--space-4)',
                      background: opts.flip === f.id ? 'var(--color-brand-500)' : 'var(--color-surface-2)',
                      color: opts.flip === f.id ? '#fff' : 'var(--color-text-secondary)',
                      border: '1px solid ' + (opts.flip === f.id ? 'var(--color-brand-500)' : 'var(--color-border)'),
                      borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '500',
                      cursor: 'pointer', fontFamily: 'var(--font-sans)',
                    }}>{f.label}</button>
                  ))}
                </div>
              </div>

              {/* Format + Quality */}
              <div style={{ display: 'flex', gap: 'var(--space-8)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>Output format</div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    {FORMATS.map(f => (
                      <button key={f.id} onClick={() => setOpts(o => ({ ...o, format: f.id }))} style={{
                        padding: 'var(--space-2) var(--space-4)',
                        background: opts.format === f.id ? 'var(--color-brand-500)' : 'var(--color-surface-2)',
                        color: opts.format === f.id ? '#fff' : 'var(--color-text-secondary)',
                        border: '1px solid ' + (opts.format === f.id ? 'var(--color-brand-500)' : 'var(--color-border)'),
                        borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '600',
                        cursor: 'pointer', fontFamily: 'var(--font-sans)',
                      }}>{f.label}</button>
                    ))}
                  </div>
                </div>
                {opts.format !== 'image/png' && (
                  <div style={{ flex: '1 1 160px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>Quality</span>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-brand-500)' }}>{Math.round(opts.quality * 100)}%</span>
                    </div>
                    <input type="range" min={0.1} max={1} step={0.05} value={opts.quality}
                      onChange={e => setOpts(o => ({ ...o, quality: Number(e.target.value) }))}
                      style={{ width: '100%', accentColor: 'var(--color-brand-500)' }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div style={{ background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4) var(--space-5)', fontSize: '14px', color: 'var(--color-danger)' }}>⚠ {error}</div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', paddingTop: 'var(--space-2)' }}>
            {result && (
              <button onClick={download} style={{ padding: 'var(--space-3) var(--space-6)', background: 'var(--color-success)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>↓ Download</button>
            )}
            <button onClick={run} disabled={busy} style={{ padding: 'var(--space-3) var(--space-8)', background: busy ? 'var(--color-border)' : 'var(--color-brand-500)', color: busy ? 'var(--color-text-tertiary)' : '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', cursor: busy ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', boxShadow: busy ? 'none' : '0 4px 12px rgb(46 124 246 / 0.35)' }}>
              {busy ? 'Processing...' : result ? 'Apply again →' : 'Apply transform →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
