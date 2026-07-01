import { useState, useRef } from 'react';
import { convertImage, formatBytes, FORMAT_LABELS } from './engine';
import type { ConvertOptions, ConvertResult, OutputFormat } from './engine';

interface FileJob {
  id:       string;
  file:     File;
  preview:  string;
  status:   'pending' | 'processing' | 'done' | 'error';
  progress: number;
  result?:  ConvertResult;
  error?:   string;
}

const DEFAULT_OPTS: ConvertOptions = { format: 'image/webp', quality: 0.85 };
const FORMATS: OutputFormat[] = ['image/jpeg', 'image/png', 'image/webp'];

export default function ImageConverterPage() {
  const [jobs,    setJobs]    = useState<FileJob[]>([]);
  const [opts,    setOpts]    = useState<ConvertOptions>(DEFAULT_OPTS);
  const [dragging,setDragging]= useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function updateJob(id: string, patch: Partial<FileJob>) {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...patch } : j));
  }

  function addFiles(files: FileList | File[]) {
    const arr = Array.from(files).filter(f => f.type.startsWith('image/'));
    setJobs(prev => [...prev, ...arr.map(file => ({
      id: crypto.randomUUID(), file, preview: URL.createObjectURL(file),
      status: 'pending' as const, progress: 0,
    }))]);
  }

  async function convertAll() {
    const pending = jobs.filter(j => j.status === 'pending');
    for (const job of pending) {
      updateJob(job.id, { status: 'processing', progress: 0 });
      try {
        const result = await convertImage(job.file, opts, pct => updateJob(job.id, { progress: pct }));
        updateJob(job.id, { status: 'done', result, progress: 100 });
      } catch (e) {
        updateJob(job.id, { status: 'error', error: (e as Error).message });
      }
    }
  }

  function downloadOne(job: FileJob) {
    if (!job.result) return;
    const a = document.createElement('a');
    a.href = job.result.url;
    a.download = job.result.file.name;
    a.click();
  }

  function downloadAll() { jobs.filter(j => j.status === 'done').forEach(downloadOne); }

  const pendingCount = jobs.filter(j => j.status === 'pending').length;
  const doneCount    = jobs.filter(j => j.status === 'done').length;
  const processing   = jobs.some(j => j.status === 'processing');

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/image" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Image Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Converter</span>
      </div>

      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Image Converter</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>
          Convert images between JPG, PNG and WebP. Batch convert multiple files at once.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        style={{ border: '2px dashed ' + (dragging ? 'var(--color-brand-500)' : 'var(--color-border-2)'), borderRadius: 'var(--radius-2xl)', padding: 'var(--space-12) var(--space-8)', textAlign: 'center', cursor: 'pointer', background: dragging ? 'var(--color-brand-50)' : 'var(--color-surface)', transition: 'all var(--duration-normal)', marginBottom: 'var(--space-6)' }}
      >
        <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-xl)', background: 'var(--color-brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)', fontSize: '24px' }}>🔄</div>
        <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
          Drop images or <span style={{ color: 'var(--color-brand-500)' }}>browse files</span>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>JPG, PNG, WebP, AVIF, GIF · multiple files supported</div>
        <input ref={inputRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files && addFiles(e.target.files)} />
      </div>

      {jobs.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

          {/* Format options */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>Convert to</div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  {FORMATS.map(f => (
                    <button key={f} onClick={() => setOpts(o => ({ ...o, format: f }))} style={{
                      padding: 'var(--space-2) var(--space-5)',
                      background: opts.format === f ? 'var(--color-brand-500)' : 'var(--color-surface-2)',
                      color: opts.format === f ? '#fff' : 'var(--color-text-secondary)',
                      border: '1px solid ' + (opts.format === f ? 'var(--color-brand-500)' : 'var(--color-border)'),
                      borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: '600',
                      cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all var(--duration-fast)',
                    }}>{FORMAT_LABELS[f]}</button>
                  ))}
                </div>
              </div>
              {opts.format !== 'image/png' && (
                <div style={{ flex: '1 1 180px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Quality</span>
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

          {/* File list */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>{jobs.length} file{jobs.length !== 1 ? 's' : ''}</span>
              <button onClick={() => setJobs([])} style={{ background: 'none', border: 'none', fontSize: '13px', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Clear all</button>
            </div>
            {jobs.map((job, i) => (
              <div key={job.id} style={{ display: 'grid', gridTemplateColumns: '48px 1fr auto', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-6)', borderBottom: i < jobs.length - 1 ? '1px solid var(--color-border)' : 'none', background: job.status === 'done' ? 'var(--color-success-bg)' : 'transparent' }}>
                <img src={job.result?.url ?? job.preview} alt="" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '3px' }}>{job.file.name}</div>
                  {job.status === 'pending'    && <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{formatBytes(job.file.size)} · Ready</div>}
                  {job.status === 'processing' && (
                    <div>
                      <div style={{ height: '3px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '3px', width: '200px', maxWidth: '100%' }}>
                        <div style={{ height: '100%', width: job.progress + '%', background: 'var(--color-brand-500)', borderRadius: 'var(--radius-full)', transition: 'width 0.1s' }} />
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Converting... {job.progress}%</div>
                    </div>
                  )}
                  {job.status === 'done' && job.result && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '12px' }}>
                      <span style={{ textDecoration: 'line-through', color: 'var(--color-text-tertiary)' }}>{formatBytes(job.result.originalSize)}</span>
                      <span>→</span>
                      <span style={{ fontWeight: '600', color: 'var(--color-success)' }}>{formatBytes(job.result.outputSize)}</span>
                      <span style={{ background: 'var(--color-brand-50)', color: 'var(--color-brand-500)', fontWeight: '700', fontSize: '11px', padding: '1px 7px', borderRadius: 'var(--radius-full)' }}>{FORMAT_LABELS[job.result.format]}</span>
                    </div>
                  )}
                  {job.status === 'error' && <div style={{ fontSize: '12px', color: 'var(--color-danger)' }}>⚠ {job.error}</div>}
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  {job.status === 'done' && <button onClick={() => downloadOne(job)} style={{ padding: 'var(--space-2) var(--space-4)', background: 'var(--color-success)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>↓</button>}
                  <button onClick={() => setJobs(p => p.filter(j => j.id !== job.id))} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                </div>
              </div>
            ))}
          </div>

          {/* Action bar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', paddingTop: 'var(--space-2)' }}>
            {doneCount > 0 && <button onClick={downloadAll} style={{ padding: 'var(--space-3) var(--space-6)', background: 'var(--color-surface)', color: 'var(--color-success)', border: '2px solid var(--color-success)', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>↓ Download all ({doneCount})</button>}
            {pendingCount > 0 && !processing && (
              <button onClick={convertAll} style={{ padding: 'var(--space-3) var(--space-8)', background: 'var(--color-brand-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 4px 12px rgb(46 124 246 / 0.35)' }}>
                Convert to {FORMAT_LABELS[opts.format]} →
              </button>
            )}
            {processing && <button disabled style={{ padding: 'var(--space-3) var(--space-8)', background: 'var(--color-border)', color: 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', fontFamily: 'var(--font-sans)', cursor: 'not-allowed' }}>Converting...</button>}
          </div>
        </div>
      )}
    </div>
  );
}
