import { useState, useRef, useCallback } from 'react';
import { compressImage, formatBytes } from './engine';
import type { CompressOptions, CompressResult } from './engine';

const DEFAULT_OPTS: CompressOptions = {
  maxSizeMB:    1,
  quality:      0.8,
  preserveExif: false,
};

interface FileJob {
  id:       string;
  file:     File;
  preview:  string;
  status:   'pending' | 'processing' | 'done' | 'error';
  progress: number;
  result?:  CompressResult;
  error?:   string;
}

export default function ImageCompressorPage() {
  const [jobs,     setJobs]     = useState<FileJob[]>([]);
  const [opts,     setOpts]     = useState<CompressOptions>(DEFAULT_OPTS);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function updateJob(id: string, patch: Partial<FileJob>) {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...patch } : j));
  }

  function addFiles(files: FileList | File[]) {
    const arr = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (!arr.length) return;
    const newJobs: FileJob[] = arr.map(file => ({
      id:       crypto.randomUUID(),
      file,
      preview:  URL.createObjectURL(file),
      status:   'pending',
      progress: 0,
    }));
    setJobs(prev => [...prev, ...newJobs]);
  }

  const processAll = useCallback(async () => {
    const pending = jobs.filter(j => j.status === 'pending');
    if (!pending.length) return;
    for (const job of pending) {
      updateJob(job.id, { status: 'processing', progress: 0 });
      try {
        const result = await compressImage(job.file, opts, pct => {
          updateJob(job.id, { progress: pct });
        });
        updateJob(job.id, { status: 'done', result, progress: 100 });
      } catch (e) {
        updateJob(job.id, { status: 'error', error: (e as Error).message });
      }
    }
  }, [jobs, opts]);

  function downloadOne(job: FileJob) {
    if (!job.result) return;
    const a = document.createElement('a');
    a.href = job.result.url;
    a.download = 'compressed_' + job.file.name;
    a.click();
  }

  function downloadAll() {
    jobs.filter(j => j.status === 'done').forEach(downloadOne);
  }

  function removeJob(id: string) {
    setJobs(prev => prev.filter(j => j.id !== id));
  }

  const doneCount    = jobs.filter(j => j.status === 'done').length;
  const pendingCount = jobs.filter(j => j.status === 'pending').length;
  const processing   = jobs.some(j => j.status === 'processing');

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>

      {/* Breadcrumb */}
      <div style={{
        fontSize: '13px',
        color: 'var(--color-text-tertiary)',
        marginBottom: 'var(--space-5)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/image" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Image Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Compressor</span>
      </div>

      {/* Page header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: 'var(--color-text-primary)',
          margin: '0 0 var(--space-2)',
          letterSpacing: '-0.02em',
        }}>
          Image Compressor
        </h1>
        <p style={{
          color: 'var(--color-text-secondary)',
          margin: 0,
          fontSize: '15px',
          lineHeight: 1.6,
        }}>
          Compress JPG, PNG and WebP images with no visible quality loss.
          Files never leave your device.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e  => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        style={{
          border: `2px dashed ${dragging ? 'var(--color-brand-500)' : 'var(--color-border-2)'}`,
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-16) var(--space-8)',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragging ? 'var(--color-brand-50)' : 'var(--color-surface)',
          transition: 'border-color var(--duration-normal) var(--easing-out), background var(--duration-normal) var(--easing-out)',
          marginBottom: 'var(--space-6)',
        }}
      >
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--color-brand-50)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--space-4)',
          fontSize: '24px',
        }}>
          🖼️
        </div>
        <div style={{
          fontSize: '16px',
          fontWeight: '600',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-2)',
        }}>
          Drop images here or{' '}
          <span style={{ color: 'var(--color-brand-500)' }}>browse files</span>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
          JPG, PNG, WebP, AVIF · up to 50 MB each · multiple files supported
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => e.target.files && addFiles(e.target.files)}
        />
      </div>

      {jobs.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

          {/* Options card */}
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)',
            padding: 'var(--space-6)',
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--color-text-tertiary)',
              marginBottom: 'var(--space-5)',
            }}>
              Compression settings
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-8)', flexWrap: 'wrap', alignItems: 'flex-end' }}>

              {/* Quality slider */}
              <div style={{ flex: '1 1 200px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: 'var(--space-3)',
                }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                    Quality
                  </span>
                  <span style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: 'var(--color-brand-500)',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {Math.round(opts.quality * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0.1} max={1} step={0.05}
                  value={opts.quality}
                  onChange={e => setOpts(o => ({ ...o, quality: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: 'var(--color-brand-500)', height: '4px' }}
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '11px',
                  color: 'var(--color-text-tertiary)',
                  marginTop: 'var(--space-1)',
                }}>
                  <span>Smaller file</span>
                  <span>Better quality</span>
                </div>
              </div>

              {/* Max size */}
              <div style={{ minWidth: '140px' }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-3)',
                }}>
                  Max output size
                </div>
                <select
                  value={opts.maxSizeMB}
                  onChange={e => setOpts(o => ({ ...o, maxSizeMB: Number(e.target.value) }))}
                  style={{
                    width: '100%',
                    padding: 'var(--space-2) var(--space-3)',
                    border: '1px solid var(--color-border-2)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    fontFamily: 'var(--font-sans)',
                    color: 'var(--color-text-primary)',
                    background: 'var(--color-surface)',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value={0.5}>0.5 MB</option>
                  <option value={1}>1 MB</option>
                  <option value={2}>2 MB</option>
                  <option value={5}>5 MB</option>
                  <option value={10}>10 MB</option>
                </select>
              </div>

              {/* Preserve EXIF */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                  userSelect: 'none',
                  paddingBottom: 'var(--space-2)',
                }}>
                  <input
                    type="checkbox"
                    checked={opts.preserveExif}
                    onChange={e => setOpts(o => ({ ...o, preserveExif: e.target.checked }))}
                    style={{ accentColor: 'var(--color-brand-500)', width: '16px', height: '16px' }}
                  />
                  Preserve EXIF data
                </label>
                <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginLeft: '24px' }}>
                  Keep GPS, camera info
                </div>
              </div>
            </div>
          </div>

          {/* File list card */}
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)',
            overflow: 'hidden',
          }}>
            {/* List header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 'var(--space-4) var(--space-6)',
              borderBottom: '1px solid var(--color-border)',
              background: 'var(--color-surface-2)',
            }}>
              <span style={{
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--color-text-secondary)',
              }}>
                {jobs.length} file{jobs.length !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => setJobs([])}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '13px',
                  color: 'var(--color-text-tertiary)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  padding: 'var(--space-1) var(--space-2)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                Clear all
              </button>
            </div>

            {/* Rows */}
            {jobs.map((job, i) => (
              <div
                key={job.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '48px 1fr auto',
                  alignItems: 'center',
                  gap: 'var(--space-4)',
                  padding: 'var(--space-4) var(--space-6)',
                  borderBottom: i < jobs.length - 1 ? '1px solid var(--color-border)' : 'none',
                  background: job.status === 'done' ? 'var(--color-success-bg)' : 'transparent',
                  transition: 'background var(--duration-normal)',
                }}
              >
                {/* Thumb */}
                <img
                  src={job.result?.url ?? job.preview}
                  alt=""
                  style={{
                    width: '48px',
                    height: '48px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                  }}
                />

                {/* Info */}
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'var(--color-text-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginBottom: '4px',
                  }}>
                    {job.file.name}
                  </div>

                  {job.status === 'pending' && (
                    <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                      {formatBytes(job.file.size)} · Ready to compress
                    </div>
                  )}

                  {job.status === 'processing' && (
                    <div>
                      <div style={{
                        height: '3px',
                        background: 'var(--color-border)',
                        borderRadius: 'var(--radius-full)',
                        overflow: 'hidden',
                        marginBottom: '4px',
                        width: '200px',
                        maxWidth: '100%',
                      }}>
                        <div style={{
                          height: '100%',
                          width: job.progress + '%',
                          background: 'var(--color-brand-500)',
                          borderRadius: 'var(--radius-full)',
                          transition: 'width 0.1s linear',
                        }} />
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                        Compressing... {job.progress}%
                      </div>
                    </div>
                  )}

                  {job.status === 'done' && job.result && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      fontSize: '12px',
                      color: 'var(--color-text-secondary)',
                      flexWrap: 'wrap',
                    }}>
                      <span style={{ textDecoration: 'line-through', color: 'var(--color-text-tertiary)' }}>
                        {formatBytes(job.result.originalSize)}
                      </span>
                      <span>→</span>
                      <span style={{ fontWeight: '600', color: 'var(--color-success)' }}>
                        {formatBytes(job.result.compressedSize)}
                      </span>
                      <span style={{
                        background: 'var(--color-success)',
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: '11px',
                        padding: '1px 7px',
                        borderRadius: 'var(--radius-full)',
                      }}>
                        -{job.result.savedPercent}%
                      </span>
                    </div>
                  )}

                  {job.status === 'error' && (
                    <div style={{ fontSize: '12px', color: 'var(--color-danger)' }}>
                      ⚠ {job.error}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  {job.status === 'done' && (
                    <button
                      onClick={() => downloadOne(job)}
                      style={{
                        padding: 'var(--space-2) var(--space-4)',
                        background: 'var(--color-success)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-sans)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      ↓ Download
                    </button>
                  )}
                  <button
                    onClick={() => removeJob(job.id)}
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'none',
                      color: 'var(--color-text-tertiary)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom action bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 'var(--space-3)',
            padding: 'var(--space-4) 0',
          }}>
            {doneCount > 0 && (
              <button
                onClick={downloadAll}
                style={{
                  padding: 'var(--space-3) var(--space-6)',
                  background: 'var(--color-surface)',
                  color: 'var(--color-success)',
                  border: '2px solid var(--color-success)',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                ↓ Download all ({doneCount})
              </button>
            )}
            {pendingCount > 0 && !processing && (
              <button
                onClick={processAll}
                style={{
                  padding: 'var(--space-3) var(--space-8)',
                  background: 'var(--color-brand-500)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  boxShadow: '0 4px 12px rgb(46 124 246 / 0.35)',
                }}
              >
                Compress {pendingCount} image{pendingCount !== 1 ? 's' : ''} →
              </button>
            )}
            {processing && (
              <button
                disabled
                style={{
                  padding: 'var(--space-3) var(--space-8)',
                  background: 'var(--color-border)',
                  color: 'var(--color-text-tertiary)',
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '15px',
                  fontWeight: '600',
                  fontFamily: 'var(--font-sans)',
                  cursor: 'not-allowed',
                }}
              >
                Processing...
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
