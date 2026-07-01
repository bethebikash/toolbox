import { useState, useRef } from 'react';
import { resizeImage, getImageDimensions, formatBytes } from './engine';
import type { ResizeOptions, ResizeResult, ResizeMode } from './engine';

const DEFAULT_OPTS: ResizeOptions = {
  mode:       'fit',
  width:      1280,
  height:     720,
  percentage: 50,
  quality:    0.9,
};

export default function ImageResizerPage() {
  const [file,     setFile]     = useState<File | null>(null);
  const [preview,  setPreview]  = useState<string | null>(null);
  const [dims,     setDims]     = useState<{ w: number; h: number } | null>(null);
  const [opts,     setOpts]     = useState<ResizeOptions>(DEFAULT_OPTS);
  const [result,   setResult]   = useState<ResizeResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [busy,     setBusy]     = useState(false);
  const [error,    setError]    = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(f: File) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError('');
    const d = await getImageDimensions(f);
    setDims(d);
  }

  async function run() {
    if (!file) return;
    setBusy(true);
    setProgress(0);
    setError('');
    try {
      const res = await resizeImage(file, opts, setProgress);
      setResult(res);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function download() {
    if (!result) return;
    const a = document.createElement('a');
    a.href     = result.url;
    a.download = 'resized_' + (file?.name ?? 'image');
    a.click();
  }

  function setWidth(val: string) {
    const n = Number(val);
    if (n > 0) setOpts(o => ({ ...o, width: n }));
    else {
      setOpts(o => {
        const next = { ...o };
        delete next.width;
        return next;
      });
    }
  }

  function setHeight(val: string) {
    const n = Number(val);
    if (n > 0) setOpts(o => ({ ...o, height: n }));
    else {
      setOpts(o => {
        const next = { ...o };
        delete next.height;
        return next;
      });
    }
  }

  const modeLabels: Record<ResizeMode, string> = {
    exact: 'Exact size', fit: 'Fit within', percentage: 'Percentage',
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/image" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Image Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Resizer</span>
      </div>

      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Image Resizer</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>
          Resize images by exact dimensions, fit within bounds, or by percentage. Files never leave your device.
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
          <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-xl)', background: 'var(--color-brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)', fontSize: '24px' }}>📐</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Drop an image or <span style={{ color: 'var(--color-brand-500)' }}>browse files</span></div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>JPG, PNG, WebP, AVIF</div>
          <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      )}

      {file && dims && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

          {/* Preview */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <img src={result?.url ?? preview ?? ''} alt="" style={{ width: '100%', maxHeight: '320px', objectFit: 'contain', display: 'block', background: 'var(--color-surface-2)' }} />
            <div style={{ padding: 'var(--space-4) var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '2px' }}>{file.name}</div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
                  {dims.w} × {dims.h}px · {formatBytes(file.size)}
                  {result && <span style={{ color: 'var(--color-success)', marginLeft: 'var(--space-2)' }}>→ {result.outputW} × {result.outputH}px · {formatBytes(result.outputSize)}</span>}
                </div>
              </div>
              <button onClick={() => { setFile(null); setPreview(null); setDims(null); setResult(null); }}
                style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', fontSize: '13px', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                Change
              </button>
            </div>
          </div>

          {/* Options */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)' }}>Resize settings</div>

            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
              {(['fit', 'exact', 'percentage'] as ResizeMode[]).map(m => (
                <button key={m} onClick={() => setOpts(o => ({ ...o, mode: m }))} style={{
                  padding: 'var(--space-2) var(--space-4)',
                  background: opts.mode === m ? 'var(--color-brand-500)' : 'var(--color-surface-2)',
                  color: opts.mode === m ? '#fff' : 'var(--color-text-secondary)',
                  border: '1px solid ' + (opts.mode === m ? 'var(--color-brand-500)' : 'var(--color-border)'),
                  borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: '500',
                  cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all var(--duration-fast)',
                }}>{modeLabels[m]}</button>
              ))}
            </div>

            {opts.mode === 'percentage' ? (
              <div style={{ maxWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Scale</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <input type="number" min={1} max={400} value={opts.percentage ?? 50}
                    onChange={e => setOpts(o => ({ ...o, percentage: Number(e.target.value) }))}
                    style={{ width: '80px', padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '15px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none' }}
                  />
                  <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>%</span>
                  {opts.percentage && dims && (
                    <span style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
                      → {Math.round(dims.w * opts.percentage / 100)} × {Math.round(dims.h * opts.percentage / 100)}px
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Width (px)</label>
                  <input type="number" min={1} max={16000} value={opts.width ?? ''}
                    onChange={e => setWidth(e.target.value)}
                    style={{ width: '120px', padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '15px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none' }}
                  />
                </div>
                <div style={{ paddingBottom: 'var(--space-2)', color: 'var(--color-text-tertiary)', fontSize: '18px' }}>×</div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Height (px)</label>
                  <input type="number" min={1} max={16000} value={opts.height ?? ''}
                    onChange={e => setHeight(e.target.value)}
                    style={{ width: '120px', padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '15px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none' }}
                  />
                </div>
                {opts.mode === 'fit' && (
                  <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', paddingBottom: 'var(--space-2)' }}>
                    Aspect ratio preserved
                  </div>
                )}
              </div>
            )}
          </div>

          {busy && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-5)' }}>
              <div style={{ height: '4px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: 'var(--space-2)' }}>
                <div style={{ height: '100%', width: progress + '%', background: 'var(--color-brand-500)', borderRadius: 'var(--radius-full)', transition: 'width 0.1s linear' }} />
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>Resizing... {progress}%</div>
            </div>
          )}

          {error && (
            <div style={{ background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4) var(--space-5)', fontSize: '14px', color: 'var(--color-danger)' }}>⚠ {error}</div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', paddingTop: 'var(--space-2)' }}>
            {result && (
              <button onClick={download} style={{ padding: 'var(--space-3) var(--space-6)', background: 'var(--color-success)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                ↓ Download
              </button>
            )}
            {!busy && (
              <button onClick={run} style={{ padding: 'var(--space-3) var(--space-8)', background: 'var(--color-brand-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 4px 12px rgb(46 124 246 / 0.35)' }}>
                {result ? 'Resize again →' : 'Resize image →'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
