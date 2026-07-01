import { useState, useRef } from 'react';
import { compressImage, formatBytes } from '../compressor/engine';
import type { CompressOptions } from '../compressor/engine';

interface FileJob {
  id:             string;
  file:           File;
  preview:        string;
  status:         'pending' | 'processing' | 'done' | 'error';
  progress:       number;
  resultUrl?:     string;
  compressedSize?: number;
  savedPercent?:  number;
  error?:         string;
}

const DEFAULT_OPTS: CompressOptions = { maxSizeMB: 1, quality: 0.8, preserveExif: false };

export default function BulkImageCompressorPage() {
  const [jobs,    setJobs]    = useState<FileJob[]>([]);
  const [opts,    setOpts]    = useState<CompressOptions>(DEFAULT_OPTS);
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

  async function compressAll() {
    const pending = jobs.filter(j => j.status === 'pending');
    for (const job of pending) {
      updateJob(job.id, { status: 'processing', progress: 0 });
      try {
        const result = await compressImage(job.file, opts, pct => updateJob(job.id, { progress: pct }));
        updateJob(job.id, { status: 'done', resultUrl: result.url, compressedSize: result.compressedSize, savedPercent: result.savedPercent, progress: 100 });
      } catch (e) {
        updateJob(job.id, { status: 'error', error: (e as Error).message });
      }
    }
  }

  function downloadAll() {
    jobs.filter(j => j.status === 'done').forEach(job => {
      const a = document.createElement('a');
      a.href     = job.resultUrl!;
      a.download = 'compressed_' + job.file.name;
      a.click();
    });
  }

  const done        = jobs.filter(j => j.status === 'done');
  const pending     = jobs.filter(j => j.status === 'pending');
  const processing  = jobs.some(j => j.status === 'processing');
  const totalSaved  = done.reduce((acc, j) => acc + (j.file.size - (j.compressedSize ?? 0)), 0);
  const totalOrig   = done.reduce((acc, j) => acc + j.file.size, 0);
  const avgSaved    = done.length > 0 ? Math.round((totalSaved / totalOrig) * 100) : 0;

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/image" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Image Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Bulk Compressor</span>
      </div>

      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Bulk Image Compressor</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>
          Compress dozens of images at once. All files stay in your browser — nothing is uploaded.
        </p>
      </div>

      {/* Stats bar — shown after processing */}
      {done.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          {[
            { label: 'Compressed',  value: done.length + ' files' },
            { label: 'Total saved', value: formatBytes(totalSaved) },
            { label: 'Average',     value: '-' + avgSaved + '%' },
            { label: 'Original',    value: formatBytes(totalOrig) },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--space-4)' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)' }}>{stat.label}</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-brand-500)' }}>{stat.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        style={{ border: '2px dashed ' + (dragging ? 'var(--color-brand-500)' : 'var(--color-border-2)'), borderRadius: 'var(--radius-2xl)', padding: jobs.length > 0 ? 'var(--space-6) var(--space-8)' : 'var(--space-16) var(--space-8)', textAlign: 'center', cursor: 'pointer', background: dragging ? 'var(--color-brand-50)' : 'var(--color-surface)', transition: 'all var(--duration-normal)', marginBottom: 'var(--space-4)' }}
      >
        <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)' }}>
          {jobs.length > 0 ? '+ Add more images' : <>Drop images or <span style={{ color: 'var(--color-brand-500)' }}>browse files</span></>}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>JPG, PNG, WebP, AVIF · no limit on file count</div>
        <input ref={inputRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files && addFiles(e.target.files)} />
      </div>

      {jobs.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

          {/* Settings */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-5)', display: 'flex', gap: 'var(--space-8)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 180px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>Quality</span>
                <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-brand-500)' }}>{Math.round(opts.quality * 100)}%</span>
              </div>
              <input type="range" min={0.1} max={1} step={0.05} value={opts.quality}
                onChange={e => setOpts(o => ({ ...o, quality: Number(e.target.value) }))}
                style={{ width: '100%', accentColor: 'var(--color-brand-500)' }}
              />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Max size</div>
              <select value={opts.maxSizeMB} onChange={e => setOpts(o => ({ ...o, maxSizeMB: Number(e.target.value) }))}
                style={{ padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '14px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none' }}>
                <option value={0.5}>0.5 MB</option>
                <option value={1}>1 MB</option>
                <option value={2}>2 MB</option>
                <option value={5}>5 MB</option>
              </select>
            </div>
          </div>

          {/* File list */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>
                {jobs.length} files · {done.length} done · {pending.length} pending
              </span>
              <button onClick={() => setJobs([])} style={{ background: 'none', border: 'none', fontSize: '13px', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Clear all</button>
            </div>
            {jobs.map((job, i) => (
              <div key={job.id} style={{ display: 'grid', gridTemplateColumns: '40px 1fr auto', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-5)', borderBottom: i < jobs.length - 1 ? '1px solid var(--color-border)' : 'none', background: job.status === 'done' ? 'var(--color-success-bg)' : 'transparent' }}>
                <img src={job.resultUrl ?? job.preview} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '2px' }}>{job.file.name}</div>
                  {job.status === 'pending'    && <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>{formatBytes(job.file.size)}</div>}
                  {job.status === 'processing' && (
                    <div style={{ height: '3px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden', width: '160px', maxWidth: '100%' }}>
                      <div style={{ height: '100%', width: job.progress + '%', background: 'var(--color-brand-500)', borderRadius: 'var(--radius-full)', transition: 'width 0.1s' }} />
                    </div>
                  )}
                  {job.status === 'done' && job.compressedSize !== undefined && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: '11px' }}>
                      <span style={{ textDecoration: 'line-through', color: 'var(--color-text-tertiary)' }}>{formatBytes(job.file.size)}</span>
                      <span style={{ color: 'var(--color-text-tertiary)' }}>→</span>
                      <span style={{ fontWeight: '600', color: 'var(--color-success)' }}>{formatBytes(job.compressedSize)}</span>
                      <span style={{ background: 'var(--color-success)', color: '#fff', fontWeight: '700', fontSize: '10px', padding: '0 5px', borderRadius: 'var(--radius-full)' }}>-{job.savedPercent}%</span>
                    </div>
                  )}
                  {job.status === 'error' && <div style={{ fontSize: '11px', color: 'var(--color-danger)' }}>⚠ {job.error}</div>}
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                  {job.status === 'done' && (
                    <button onClick={() => { const a = document.createElement('a'); a.href = job.resultUrl!; a.download = 'compressed_' + job.file.name; a.click(); }}
                      style={{ padding: 'var(--space-1) var(--space-3)', background: 'var(--color-success)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>↓</button>
                  )}
                  <button onClick={() => setJobs(p => p.filter(j => j.id !== job.id))} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontSize: '12px' }}>✕</button>
                </div>
              </div>
            ))}
          </div>

          {/* Action bar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', paddingTop: 'var(--space-2)' }}>
            {done.length > 0 && <button onClick={downloadAll} style={{ padding: 'var(--space-3) var(--space-6)', background: 'var(--color-surface)', color: 'var(--color-success)', border: '2px solid var(--color-success)', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>↓ Download all ({done.length})</button>}
            {pending.length > 0 && !processing && (
              <button onClick={compressAll} style={{ padding: 'var(--space-3) var(--space-8)', background: 'var(--color-brand-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 4px 12px rgb(46 124 246 / 0.35)' }}>
                Compress {pending.length} image{pending.length !== 1 ? 's' : ''} →
              </button>
            )}
            {processing && <button disabled style={{ padding: 'var(--space-3) var(--space-8)', background: 'var(--color-border)', color: 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', fontFamily: 'var(--font-sans)', cursor: 'not-allowed' }}>Processing...</button>}
          </div>
        </div>
      )}
    </div>
  );
}
