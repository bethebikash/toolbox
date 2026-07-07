import { useState, useRef } from 'react';
import { applyFilter, formatBytes, FILTER_LABELS } from './engine';
import type { FilterType, FilterOptions, FilterResult } from './engine';

const FILTERS = Object.keys(FILTER_LABELS) as FilterType[];

export default function ImageFiltersPage() {
  const [file,     setFile]     = useState<File | null>(null);
  const [preview,  setPreview]  = useState<string | null>(null);
  const [opts,     setOpts]     = useState<FilterOptions>({ filter: 'grayscale', intensity: 100 });
  const [result,   setResult]   = useState<FilterResult | null>(null);
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
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const res = await applyFilter(file, opts);
      setResult(res);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function download() {
    if (!result || !file) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = `${opts.filter}_${file.name}`;
    a.click();
  }

  const intensityLabel: Record<FilterType, string> = {
    grayscale: 'Intensity', sepia: 'Intensity', invert: 'Intensity',
    blur: 'Amount', sharpen: 'Strength', brightness: 'Level',
    contrast: 'Level', saturate: 'Level',
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/image" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Image Tools</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Image Filters</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Image Filters</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Apply grayscale, sepia, blur, sharpen and other filters to images.</p>
      </div>

      {!file && (
        <div onClick={() => inputRef.current?.click()} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) handleFile(f); }}
          style={{ border: '2px dashed ' + (dragging ? 'var(--color-brand-500)' : 'var(--color-border-2)'), borderRadius: 'var(--radius-2xl)', padding: 'var(--space-16) var(--space-8)', textAlign: 'center', cursor: 'pointer', background: dragging ? 'var(--color-brand-50)' : 'var(--color-surface)', transition: 'all var(--duration-normal)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-xl)', background: 'var(--color-brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)', fontSize: '24px' }}>🎨</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Drop an image or <span style={{ color: 'var(--color-brand-500)' }}>browse files</span></div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>JPG, PNG, WebP</div>
          <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      )}

      {file && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <img src={result?.url ?? preview ?? ''} alt="" style={{ width: '100%', maxHeight: '360px', objectFit: 'contain', display: 'block', background: 'var(--color-surface-2)' }} />
            <div style={{ padding: 'var(--space-3) var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>{file.name} · {formatBytes(file.size)}</span>
              <button onClick={() => { setFile(null); setPreview(null); setResult(null); }} style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-1) var(--space-3)', fontSize: '12px', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Change</button>
            </div>
          </div>

          {/* Filter selector */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-5)' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-4)' }}>Filter</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
              {FILTERS.map(f => (
                <button key={f} onClick={() => setOpts(o => ({ ...o, filter: f }))} style={{
                  padding: 'var(--space-2) var(--space-4)',
                  background: opts.filter === f ? 'var(--color-brand-500)' : 'var(--color-surface-2)',
                  color: opts.filter === f ? '#fff' : 'var(--color-text-secondary)',
                  border: '1px solid ' + (opts.filter === f ? 'var(--color-brand-500)' : 'var(--color-border)'),
                  borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '500',
                  cursor: 'pointer', fontFamily: 'var(--font-sans)',
                }}>{FILTER_LABELS[f]}</button>
              ))}
            </div>
            <div style={{ maxWidth: '400px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>{intensityLabel[opts.filter]}</span>
                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-brand-500)' }}>{opts.intensity}%</span>
              </div>
              <input type="range" min={0} max={100} value={opts.intensity}
                onChange={e => setOpts(o => ({ ...o, intensity: Number(e.target.value) }))}
                style={{ width: '100%', accentColor: 'var(--color-brand-500)' }}
              />
            </div>
          </div>

          {error && <div style={{ background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4) var(--space-5)', fontSize: '14px', color: 'var(--color-danger)' }}>⚠ {error}</div>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
            {result && (
              <button onClick={download} style={{ padding: 'var(--space-3) var(--space-6)', background: 'var(--color-success)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>↓ Download</button>
            )}
            <button onClick={apply} disabled={busy} style={{ padding: 'var(--space-3) var(--space-8)', background: busy ? 'var(--color-border)' : 'var(--color-brand-500)', color: busy ? 'var(--color-text-tertiary)' : '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', cursor: busy ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', boxShadow: busy ? 'none' : '0 4px 12px rgb(46 124 246 / 0.35)' }}>
              {busy ? 'Applying...' : 'Apply filter →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
