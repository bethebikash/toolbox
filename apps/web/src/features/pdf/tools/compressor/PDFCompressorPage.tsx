import { useState, useRef } from 'react';
import { compressPDF, formatBytes } from './engine';
import type { CompressOptions, CompressResult, CompressionLevel } from './engine';

type AppState = 'idle' | 'processing' | 'done' | 'error';

const LEVELS: { id: CompressionLevel; label: string; desc: string }[] = [
  { id: 'low',    label: 'Low',    desc: 'Faster, minimal size reduction' },
  { id: 'medium', label: 'Medium', desc: 'Balanced compression' },
  { id: 'high',   label: 'High',   desc: 'Maximum compression, slower' },
];

export default function PDFCompressorPage() {
  const [file,     setFile]     = useState<File | null>(null);
  const [opts,     setOpts]     = useState<CompressOptions>({ level: 'medium' });
  const [state,    setState]    = useState<AppState>('idle');
  const [progress, setProgress] = useState(0);
  const [result,   setResult]   = useState<CompressResult | null>(null);
  const [error,    setError]    = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function compress() {
    if (!file) return;
    setState('processing');
    setProgress(0);
    setError('');
    try {
      const res = await compressPDF(file, opts, setProgress);
      setResult(res);
      setState('done');
    } catch (e) {
      setError((e as Error).message);
      setState('error');
    }
  }

  function download() {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = 'compressed_' + (file?.name ?? 'document.pdf');
    a.click();
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/pdf" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>PDF Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Compressor</span>
      </div>

      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>PDF Compressor</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>
          Reduce PDF file size using object stream compression. Files never leave your device.
        </p>
      </div>

      {/* Drop zone */}
      {!file && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f?.type === 'application/pdf') { setFile(f); setState('idle'); setResult(null); } }}
          style={{ border: '2px dashed ' + (dragging ? 'var(--color-brand-500)' : 'var(--color-border-2)'), borderRadius: 'var(--radius-2xl)', padding: 'var(--space-16) var(--space-8)', textAlign: 'center', cursor: 'pointer', background: dragging ? 'var(--color-brand-50)' : 'var(--color-surface)', transition: 'all var(--duration-normal)', marginBottom: 'var(--space-6)' }}
        >
          <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-xl)', background: 'var(--color-brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)', fontSize: '24px' }}>📦</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Drop a PDF or <span style={{ color: 'var(--color-brand-500)' }}>browse files</span></div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>PDF only · up to 100 MB</div>
          <input ref={inputRef} type="file" accept="application/pdf" style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setState('idle'); setResult(null); } }} />
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
            <button onClick={() => { setFile(null); setResult(null); setState('idle'); }}
              style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', fontSize: '13px', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
              Change file
            </button>
          </div>

          {/* Level selector */}
          {state === 'idle' && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-4)' }}>Compression level</div>
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                {LEVELS.map(l => (
                  <button key={l.id} onClick={() => setOpts({ level: l.id })} style={{
                    flex: 1, padding: 'var(--space-4)',
                    background: opts.level === l.id ? 'var(--color-brand-50)' : 'var(--color-surface-2)',
                    border: '1px solid ' + (opts.level === l.id ? 'var(--color-brand-500)' : 'var(--color-border)'),
                    borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontFamily: 'var(--font-sans)', textAlign: 'left',
                    transition: 'all var(--duration-fast)',
                  }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: opts.level === l.id ? 'var(--color-brand-500)' : 'var(--color-text-primary)', marginBottom: '4px' }}>{l.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', lineHeight: 1.4 }}>{l.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Progress */}
          {state === 'processing' && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)', textAlign: 'center' }}>
              <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>Compressing... {progress}%</div>
              <div style={{ height: '6px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden', maxWidth: '400px', margin: '0 auto' }}>
                <div style={{ height: '100%', width: progress + '%', background: 'var(--color-brand-500)', borderRadius: 'var(--radius-full)', transition: 'width 0.15s linear' }} />
              </div>
            </div>
          )}

          {/* Result */}
          {state === 'done' && result && (
            <div style={{ background: result.savedPercent > 0 ? 'var(--color-success-bg)' : 'var(--color-surface)', border: '1px solid ' + (result.savedPercent > 0 ? 'var(--color-success)' : 'var(--color-border)'), borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: result.savedPercent > 0 ? 'var(--color-success)' : 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                  {result.savedPercent > 0 ? '✓ Compressed successfully' : 'ℹ PDF already optimized'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '13px', color: 'var(--color-text-secondary)', flexWrap: 'wrap' }}>
                  <span style={{ textDecoration: 'line-through', color: 'var(--color-text-tertiary)' }}>{formatBytes(result.originalSize)}</span>
                  <span>→</span>
                  <span style={{ fontWeight: '600', color: result.savedPercent > 0 ? 'var(--color-success)' : 'var(--color-text-primary)' }}>{formatBytes(result.outputSize)}</span>
                  {result.savedPercent > 0 && (
                    <span style={{ background: 'var(--color-success)', color: '#fff', fontWeight: '700', fontSize: '11px', padding: '1px 7px', borderRadius: 'var(--radius-full)' }}>-{result.savedPercent}%</span>
                  )}
                  <span style={{ color: 'var(--color-text-tertiary)' }}>· {result.pageCount} pages</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button onClick={download} style={{ padding: 'var(--space-3) var(--space-6)', background: 'var(--color-success)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>↓ Download</button>
                <button onClick={() => { setState('idle'); setResult(null); }} style={{ padding: 'var(--space-3) var(--space-4)', background: 'none', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-lg)', fontSize: '15px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Try again</button>
              </div>
            </div>
          )}

          {/* Error */}
          {state === 'error' && (
            <div style={{ background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4) var(--space-5)', fontSize: '14px', color: 'var(--color-danger)' }}>⚠ {error}</div>
          )}

          {/* Action */}
          {state === 'idle' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 'var(--space-2)' }}>
              <button onClick={compress} style={{ padding: 'var(--space-3) var(--space-8)', background: 'var(--color-brand-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 4px 12px rgb(46 124 246 / 0.35)' }}>
                Compress PDF →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
