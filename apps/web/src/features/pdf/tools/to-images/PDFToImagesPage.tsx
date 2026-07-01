import { useState, useRef } from 'react';
import { pdfToImages, formatBytes } from './engine';
import type { ToImagesOptions, PageImage } from './engine';

type AppState = 'idle' | 'processing' | 'done' | 'error';

const DEFAULT_OPTS: ToImagesOptions = { scale: 2, format: 'image/jpeg', quality: 0.9 };

export default function PDFToImagesPage() {
  const [file,     setFile]     = useState<File | null>(null);
  const [opts,     setOpts]     = useState<ToImagesOptions>(DEFAULT_OPTS);
  const [state,    setState]    = useState<AppState>('idle');
  const [progress, setProgress] = useState(0);
  const [pages,    setPages]    = useState<PageImage[]>([]);
  const [error,    setError]    = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function convert() {
    if (!file) return;
    setState('processing');
    setProgress(0);
    setError('');
    try {
      const res = await pdfToImages(file, opts, setProgress);
      setPages(res);
      setState('done');
    } catch (e) {
      setError((e as Error).message);
      setState('error');
    }
  }

  function downloadOne(page: PageImage) {
    const ext = opts.format === 'image/jpeg' ? 'jpg' : 'png';
    const baseName = file?.name.replace(/\.pdf$/i, '') ?? 'page';
    const a = document.createElement('a');
    a.href = page.url;
    a.download = `${baseName}_page${page.pageNumber}.${ext}`;
    a.click();
  }

  function downloadAll() { pages.forEach(downloadOne); }

  const dpiLabel = { 1: '72 DPI', 2: '144 DPI (Retina)', 3: '216 DPI (Print)' }[opts.scale] ?? '';

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/pdf" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>PDF Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>PDF to Images</span>
      </div>

      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>PDF to Images</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>
          Convert each PDF page to a JPG or PNG image. Choose resolution and format.
        </p>
      </div>

      {/* Drop zone */}
      {!file && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f?.type === 'application/pdf') { setFile(f); setState('idle'); setPages([]); } }}
          style={{ border: '2px dashed ' + (dragging ? 'var(--color-brand-500)' : 'var(--color-border-2)'), borderRadius: 'var(--radius-2xl)', padding: 'var(--space-16) var(--space-8)', textAlign: 'center', cursor: 'pointer', background: dragging ? 'var(--color-brand-50)' : 'var(--color-surface)', transition: 'all var(--duration-normal)', marginBottom: 'var(--space-6)' }}
        >
          <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-xl)', background: 'var(--color-brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)', fontSize: '24px' }}>🖼️</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Drop a PDF or <span style={{ color: 'var(--color-brand-500)' }}>browse files</span></div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>PDF only — each page becomes an image</div>
          <input ref={inputRef} type="file" accept="application/pdf" style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setState('idle'); setPages([]); } }} />
        </div>
      )}

      {file && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

          {/* File info */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '2px' }}>{file.name}</div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>{formatBytes(file.size)}</div>
            </div>
            <button onClick={() => { setFile(null); setPages([]); setState('idle'); }}
              style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', fontSize: '13px', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
              Change file
            </button>
          </div>

          {/* Options */}
          {state === 'idle' && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-8)', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>Output format</div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  {(['image/jpeg', 'image/png'] as const).map(f => (
                    <button key={f} onClick={() => setOpts(o => ({ ...o, format: f }))} style={{
                      padding: 'var(--space-2) var(--space-5)',
                      background: opts.format === f ? 'var(--color-brand-500)' : 'var(--color-surface-2)',
                      color: opts.format === f ? '#fff' : 'var(--color-text-secondary)',
                      border: '1px solid ' + (opts.format === f ? 'var(--color-brand-500)' : 'var(--color-border)'),
                      borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: '600',
                      cursor: 'pointer', fontFamily: 'var(--font-sans)',
                    }}>{f === 'image/jpeg' ? 'JPG' : 'PNG'}</button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>Resolution — {dpiLabel}</div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  {[1, 2, 3].map(s => (
                    <button key={s} onClick={() => setOpts(o => ({ ...o, scale: s }))} style={{
                      padding: 'var(--space-2) var(--space-4)',
                      background: opts.scale === s ? 'var(--color-brand-500)' : 'var(--color-surface-2)',
                      color: opts.scale === s ? '#fff' : 'var(--color-text-secondary)',
                      border: '1px solid ' + (opts.scale === s ? 'var(--color-brand-500)' : 'var(--color-border)'),
                      borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '600',
                      cursor: 'pointer', fontFamily: 'var(--font-sans)',
                    }}>{s === 1 ? '1x' : s === 2 ? '2x' : '3x'}</button>
                  ))}
                </div>
              </div>

              {opts.format === 'image/jpeg' && (
                <div style={{ flex: '1 1 160px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>JPEG quality</span>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-brand-500)' }}>{Math.round(opts.quality * 100)}%</span>
                  </div>
                  <input type="range" min={0.5} max={1} step={0.05} value={opts.quality}
                    onChange={e => setOpts(o => ({ ...o, quality: Number(e.target.value) }))}
                    style={{ width: '100%', accentColor: 'var(--color-brand-500)' }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Progress */}
          {state === 'processing' && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)', textAlign: 'center' }}>
              <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>Converting pages... {progress}%</div>
              <div style={{ height: '6px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden', maxWidth: '400px', margin: '0 auto' }}>
                <div style={{ height: '100%', width: progress + '%', background: 'var(--color-brand-500)', borderRadius: 'var(--radius-full)', transition: 'width 0.2s linear' }} />
              </div>
            </div>
          )}

          {/* Error */}
          {state === 'error' && (
            <div style={{ background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4) var(--space-5)', fontSize: '14px', color: 'var(--color-danger)' }}>⚠ {error}</div>
          )}

          {/* Image grid */}
          {state === 'done' && pages.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>{pages.length} page{pages.length !== 1 ? 's' : ''} converted</span>
                <button onClick={downloadAll} style={{ padding: 'var(--space-2) var(--space-5)', background: 'var(--color-success)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>↓ Download all</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                {pages.map(pg => (
                  <div key={pg.pageNumber} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                    <img src={pg.url} alt={`Page ${pg.pageNumber}`} style={{ width: '100%', display: 'block', background: 'var(--color-surface-2)' }} />
                    <div style={{ padding: 'var(--space-3) var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text-primary)' }}>Page {pg.pageNumber}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>{pg.width}×{pg.height}</div>
                      </div>
                      <button onClick={() => downloadOne(pg)} style={{ padding: '3px 10px', background: 'var(--color-brand-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>↓</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action */}
          {state === 'idle' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 'var(--space-2)' }}>
              <button onClick={convert} style={{ padding: 'var(--space-3) var(--space-8)', background: 'var(--color-brand-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 4px 12px rgb(46 124 246 / 0.35)' }}>
                Convert to images →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
