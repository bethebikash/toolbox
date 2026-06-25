import { useState, useRef, useCallback } from 'react';
import { compressImage, formatBytes } from './engine';
import type { CompressOptions } from './engine';
import { useToolJobs } from '../../../../hooks/useToolJobs';
import { useJobsStore } from '../../../../store';

const TOOL_ID = 'image-compressor';

const DEFAULT_OPTS: CompressOptions = {
  maxSizeMB:    1,
  quality:      0.8,
  preserveExif: false,
};

const resultUrls: Record<string, { url: string; compressedSize: number; savedPercent: number }> = {};
const previewUrls: Record<string, string> = {};

export default function ImageCompressorPage() {
  const {
    jobs, pendingJobs, doneJobs, isProcessing,
    enqueue, setProgress, setDone, setError, remove, clearTool,
  } = useToolJobs(TOOL_ID);

  const [opts,     setOpts]     = useState<CompressOptions>(DEFAULT_OPTS);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(files: FileList | File[]) {
    const arr = Array.from(files).filter(f => f.type.startsWith('image/'));
    arr.forEach(file => {
      const jobId = enqueue(file);
      previewUrls[jobId] = URL.createObjectURL(file);
    });
  }

  const processAll = useCallback(async () => {
    const pending = pendingJobs;
    if (!pending.length) return;

    for (const job of pending) {
      const previewUrl = previewUrls[job.jobId];
      if (!previewUrl) continue;

      setProgress(job.jobId, 0);

      try {
        const blob = await fetch(previewUrl).then(r => r.blob());
        const file = new File([blob], job.filename, { type: job.mimeType });
        const result = await compressImage(file, opts, pct => setProgress(job.jobId, pct));

        resultUrls[job.jobId] = {
          url:            result.url,
          compressedSize: result.compressedSize,
          savedPercent:   result.savedPercent,
        };

        setDone(job.jobId, result.url);
      } catch (e) {
        setError(job.jobId, { code: 'COMPRESS_FAILED', message: (e as Error).message });
      }
    }
  }, [pendingJobs, opts, setProgress, setDone, setError]);

  function downloadOne(jobId: string, filename: string) {
    const res = resultUrls[jobId];
    if (!res) return;
    const a = document.createElement('a');
    a.href = res.url;
    a.download = 'compressed_' + filename;
    a.click();
  }

  function downloadAll() {
    doneJobs.forEach(j => downloadOne(j.jobId, j.filename));
  }

  function handleRemove(jobId: string) {
    URL.revokeObjectURL(previewUrls[jobId] ?? '');
    delete previewUrls[jobId];
    delete resultUrls[jobId];
    remove(jobId);
  }

  function handleClear() {
    jobs.forEach(j => {
      URL.revokeObjectURL(previewUrls[j.jobId] ?? '');
      delete previewUrls[j.jobId];
      delete resultUrls[j.jobId];
    });
    clearTool();
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/image" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Image Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Compressor</span>
      </div>

      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>
          Image Compressor
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>
          Compress JPG, PNG and WebP images with no visible quality loss. Files never leave your device.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        style={{
          border: '2px dashed ' + (dragging ? 'var(--color-brand-500)' : 'var(--color-border-2)'),
          borderRadius: 'var(--radius-2xl)', padding: 'var(--space-16) var(--space-8)',
          textAlign: 'center', cursor: 'pointer',
          background: dragging ? 'var(--color-brand-50)' : 'var(--color-surface)',
          transition: 'border-color var(--duration-normal), background var(--duration-normal)',
          marginBottom: 'var(--space-6)',
        }}
      >
        <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-xl)', background: 'var(--color-brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)', fontSize: '24px' }}>🖼️</div>
        <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
          Drop images here or <span style={{ color: 'var(--color-brand-500)' }}>browse files</span>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>JPG, PNG, WebP, AVIF · up to 50 MB each</div>
        <input ref={inputRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files && addFiles(e.target.files)} />
      </div>

      {jobs.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

          {/* Options */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)' }}>
              Compression settings
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-8)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: '1 1 200px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-3)' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>Quality</span>
                  <span style={{ fontSize: '20px', fontWeight: '700', color: 'var(--color-brand-500)' }}>{Math.round(opts.quality * 100)}%</span>
                </div>
                <input type="range" min={0.1} max={1} step={0.05} value={opts.quality}
                  onChange={e => setOpts(o => ({ ...o, quality: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: 'var(--color-brand-500)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-1)' }}>
                  <span>Smaller file</span><span>Better quality</span>
                </div>
              </div>
              <div style={{ minWidth: '140px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>Max output size</div>
                <select value={opts.maxSizeMB} onChange={e => setOpts(o => ({ ...o, maxSizeMB: Number(e.target.value) }))}
                  style={{ width: '100%', padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '14px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none' }}>
                  <option value={0.5}>0.5 MB</option>
                  <option value={1}>1 MB</option>
                  <option value={2}>2 MB</option>
                  <option value={5}>5 MB</option>
                </select>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', cursor: 'pointer', userSelect: 'none', paddingBottom: 'var(--space-2)' }}>
                <input type="checkbox" checked={opts.preserveExif} onChange={e => setOpts(o => ({ ...o, preserveExif: e.target.checked }))} style={{ accentColor: 'var(--color-brand-500)', width: '16px', height: '16px' }} />
                Preserve EXIF
              </label>
            </div>
          </div>

          {/* File list */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>{jobs.length} file{jobs.length !== 1 ? 's' : ''} selected</span>
              <button onClick={handleClear} style={{ background: 'none', border: 'none', fontSize: '13px', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Clear all</button>
            </div>

            {jobs.map((job, i) => {
              const res     = resultUrls[job.jobId];
              const preview = previewUrls[job.jobId];
              return (
                <div key={job.jobId} style={{ display: 'grid', gridTemplateColumns: '48px 1fr auto', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-6)', borderBottom: i < jobs.length - 1 ? '1px solid var(--color-border)' : 'none', background: job.status === 'done' ? 'var(--color-success-bg)' : 'transparent', transition: 'background var(--duration-normal)' }}>
                  <img src={res?.url ?? preview} alt="" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '4px' }}>{job.filename}</div>
                    {job.status === 'queued'     && <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{formatBytes(job.sizeBytes)} · Ready</div>}
                    {job.status === 'processing' && (
                      <div>
                        <div style={{ height: '3px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '4px', width: '200px', maxWidth: '100%' }}>
                          <div style={{ height: '100%', width: job.progress + '%', background: 'var(--color-brand-500)', borderRadius: 'var(--radius-full)', transition: 'width 0.1s linear' }} />
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Compressing... {job.progress}%</div>
                      </div>
                    )}
                    {job.status === 'done' && res && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '12px', flexWrap: 'wrap' }}>
                        <span style={{ textDecoration: 'line-through', color: 'var(--color-text-tertiary)' }}>{formatBytes(job.sizeBytes)}</span>
                        <span>→</span>
                        <span style={{ fontWeight: '600', color: 'var(--color-success)' }}>{formatBytes(res.compressedSize)}</span>
                        <span style={{ background: 'var(--color-success)', color: '#fff', fontWeight: '700', fontSize: '11px', padding: '1px 7px', borderRadius: 'var(--radius-full)' }}>-{res.savedPercent}%</span>
                      </div>
                    )}
                    {job.status === 'error' && <div style={{ fontSize: '12px', color: 'var(--color-danger)' }}>⚠ {job.error?.message}</div>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    {job.status === 'done' && (
                      <button onClick={() => downloadOne(job.jobId, job.filename)} style={{ padding: 'var(--space-2) var(--space-4)', background: 'var(--color-success)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap' }}>↓ Download</button>
                    )}
                    <button onClick={() => handleRemove(job.jobId)} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', color: 'var(--color-text-tertiary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '14px', cursor: 'pointer' }}>✕</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action bar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', padding: 'var(--space-4) 0' }}>
            {doneJobs.length > 0 && (
              <button onClick={downloadAll} style={{ padding: 'var(--space-3) var(--space-6)', background: 'var(--color-surface)', color: 'var(--color-success)', border: '2px solid var(--color-success)', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                ↓ Download all ({doneJobs.length})
              </button>
            )}
            {pendingJobs.length > 0 && !isProcessing && (
              <button onClick={processAll} style={{ padding: 'var(--space-3) var(--space-8)', background: 'var(--color-brand-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 4px 12px rgb(46 124 246 / 0.35)' }}>
                Compress {pendingJobs.length} image{pendingJobs.length !== 1 ? 's' : ''} →
              </button>
            )}
            {isProcessing && (
              <button disabled style={{ padding: 'var(--space-3) var(--space-8)', background: 'var(--color-border)', color: 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', fontFamily: 'var(--font-sans)', cursor: 'not-allowed' }}>
                Processing...
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
