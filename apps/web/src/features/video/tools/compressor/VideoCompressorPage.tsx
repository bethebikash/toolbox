import { useState, useRef } from 'react';
import { compressVideo, formatBytes } from './engine';
import type { VideoCompressOptions, VideoResult } from './engine';

const DEFAULT_OPTS: VideoCompressOptions = {
  crf:    28,
  preset: 'fast',
};

type AppState = 'idle' | 'loading' | 'processing' | 'done' | 'error';

export default function VideoCompressorPage() {
  const [file,     setFile]     = useState<File | null>(null);
  const [preview,  setPreview]  = useState<string | null>(null);
  const [opts,     setOpts]     = useState<VideoCompressOptions>(DEFAULT_OPTS);
  const [state,    setState]    = useState<AppState>('idle');
  const [progress, setProgress] = useState(0);
  const [result,   setResult]   = useState<VideoResult | null>(null);
  const [error,    setError]    = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setState('idle');
    setError('');
  }

  async function compress() {
    if (!file) return;
    setState('loading');
    setProgress(0);
    setError('');

    try {
      // FFmpeg loads on first use — show loading state
      const res = await compressVideo(file, opts, pct => {
        setState('processing');
        setProgress(pct);
      });
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
    a.href     = result.url;
    a.download = 'compressed_' + (file?.name ?? 'video.mp4');
    a.click();
  }

  const quality = Math.round(((51 - opts.crf) / (51 - 18)) * 100);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>

      {/* Breadcrumb */}
      <div style={{
        fontSize: '13px', color: 'var(--color-text-tertiary)',
        marginBottom: 'var(--space-5)',
        display: 'flex', alignItems: 'center', gap: '6px',
      }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/video" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Video Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Compressor</span>
      </div>

      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{
          fontSize: '2rem', fontWeight: '700',
          color: 'var(--color-text-primary)',
          margin: '0 0 var(--space-2)', letterSpacing: '-0.02em',
        }}>
          Video Compressor
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>
          Compress MP4, MOV, AVI and WebM videos using H.264.
          Powered by FFmpeg — runs entirely in your browser.
        </p>
      </div>

      {/* FFmpeg notice */}
      <div style={{
        padding:      'var(--space-3) var(--space-5)',
        background:   'var(--color-warning-bg)',
        border:       '1px solid var(--color-warning)',
        borderRadius: 'var(--radius-lg)',
        fontSize:     '13px',
        color:        'var(--color-text-secondary)',
        marginBottom: 'var(--space-6)',
        display:      'flex',
        gap:          'var(--space-2)',
      }}>
        <span>⚡</span>
        <span>
          First use downloads FFmpeg (~30 MB) and caches it in your browser.
          Subsequent compressions are instant.
        </span>
      </div>

      {/* Drop zone */}
      {!file && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e  => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => {
            e.preventDefault(); setDragging(false);
            const f = e.dataTransfer.files[0];
            if (f && f.type.startsWith('video/')) handleFile(f);
          }}
          style={{
            border:       '2px dashed ' + (dragging ? 'var(--color-brand-500)' : 'var(--color-border-2)'),
            borderRadius: 'var(--radius-2xl)',
            padding:      'var(--space-16) var(--space-8)',
            textAlign:    'center', cursor: 'pointer',
            background:   dragging ? 'var(--color-brand-50)' : 'var(--color-surface)',
            transition:   'border-color var(--duration-normal), background var(--duration-normal)',
          }}
        >
          <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-xl)', background: 'var(--color-brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)', fontSize: '24px' }}>🎬</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
            Drop a video here or <span style={{ color: 'var(--color-brand-500)' }}>browse files</span>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
            MP4, MOV, AVI, WebM · up to 500 MB
          </div>
          <input ref={inputRef} type="file" accept="video/*" style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </div>
      )}

      {/* File selected */}
      {file && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

          {/* Preview + file info */}
          <div style={{
            background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)', overflow: 'hidden',
          }}>
            {preview && (
              <video
                src={result?.url ?? preview}
                controls
                style={{ width: '100%', maxHeight: '360px', background: '#000', display: 'block' }}
              />
            )}
            <div style={{
              padding: 'var(--space-4) var(--space-5)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '2px' }}>{file.name}</div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>{formatBytes(file.size)}</div>
              </div>
              {state === 'idle' && (
                <button onClick={() => { setFile(null); setPreview(null); setResult(null); }}
                  style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', fontSize: '13px', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                  Change file
                </button>
              )}
            </div>
          </div>

          {/* Options */}
          {state === 'idle' && (
            <div style={{
              background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border)', padding: 'var(--space-6)',
            }}>
              <div style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)' }}>
                Compression settings
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-8)', flexWrap: 'wrap', alignItems: 'flex-end' }}>

                {/* Quality (inverted CRF) */}
                <div style={{ flex: '1 1 200px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-3)' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>Quality</span>
                    <span style={{ fontSize: '20px', fontWeight: '700', color: 'var(--color-brand-500)' }}>{quality}%</span>
                  </div>
                  <input type="range" min={18} max={51} step={1}
                    value={opts.crf}
                    onChange={e => setOpts(o => ({ ...o, crf: Number(e.target.value) }))}
                    style={{ width: '100%', accentColor: 'var(--color-brand-500)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-1)' }}>
                    <span>Smaller file</span><span>Better quality</span>
                  </div>
                </div>

                {/* Speed preset */}
                <div style={{ minWidth: '160px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>Encode speed</div>
                  <select value={opts.preset}
                    onChange={e => setOpts(o => ({ ...o, preset: e.target.value as VideoCompressOptions['preset'] }))}
                    style={{
                      width: '100%', padding: 'var(--space-2) var(--space-3)',
                      border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)',
                      fontSize: '14px', fontFamily: 'var(--font-sans)',
                      color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none',
                    }}>
                    <option value="ultrafast">Ultrafast (lower quality)</option>
                    <option value="fast">Fast (recommended)</option>
                    <option value="medium">Medium</option>
                    <option value="slow">Slow (best quality)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Progress */}
          {(state === 'loading' || state === 'processing') && (
            <div style={{
              background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border)', padding: 'var(--space-8)',
              textAlign: 'center',
            }}>
              {state === 'loading' ? (
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                    Loading FFmpeg...
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
                    Downloading ~30 MB on first use. This is cached for future compressions.
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
                    Compressing video... {progress}%
                  </div>
                  <div style={{
                    height: '6px', background: 'var(--color-border)',
                    borderRadius: 'var(--radius-full)', overflow: 'hidden',
                    maxWidth: '400px', margin: '0 auto',
                  }}>
                    <div style={{
                      height: '100%', width: progress + '%',
                      background: 'var(--color-brand-500)',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.3s linear',
                    }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Result */}
          {state === 'done' && result && (
            <div style={{
              background: 'var(--color-success-bg)', border: '1px solid var(--color-success)',
              borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)',
              flexWrap: 'wrap',
            }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-success)', marginBottom: 'var(--space-2)' }}>
                  ✓ Compressed successfully
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: '13px', color: 'var(--color-text-secondary)', flexWrap: 'wrap' }}>
                  <span>
                    <span style={{ textDecoration: 'line-through', color: 'var(--color-text-tertiary)' }}>
                      {formatBytes(result.originalSize)}
                    </span>
                    {' → '}
                    <strong style={{ color: 'var(--color-success)' }}>{formatBytes(result.outputSize)}</strong>
                  </span>
                  <span style={{
                    background: 'var(--color-success)', color: '#fff',
                    fontWeight: '700', fontSize: '12px',
                    padding: '1px 8px', borderRadius: 'var(--radius-full)',
                  }}>
                    -{result.savedPercent}%
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button onClick={download} style={{
                  padding: 'var(--space-3) var(--space-6)',
                  background: 'var(--color-success)', color: '#fff',
                  border: 'none', borderRadius: 'var(--radius-lg)',
                  fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                }}>↓ Download</button>
                <button onClick={() => { setState('idle'); setResult(null); }} style={{
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'none', color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-lg)',
                  fontSize: '15px', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                }}>Try again</button>
              </div>
            </div>
          )}

          {/* Error */}
          {state === 'error' && (
            <div style={{
              background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger)',
              borderRadius: 'var(--radius-xl)', padding: 'var(--space-4) var(--space-6)',
              fontSize: '14px', color: 'var(--color-danger)',
            }}>
              ⚠ {error}
              <button onClick={() => setState('idle')} style={{
                marginLeft: 'var(--space-4)', background: 'none', border: 'none',
                color: 'var(--color-danger)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                fontSize: '13px', textDecoration: 'underline',
              }}>Try again</button>
            </div>
          )}

          {/* Compress button */}
          {state === 'idle' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 'var(--space-2)' }}>
              <button onClick={compress} style={{
                padding: 'var(--space-3) var(--space-8)',
                background: 'var(--color-brand-500)', color: '#fff',
                border: 'none', borderRadius: 'var(--radius-lg)',
                fontSize: '15px', fontWeight: '600', cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                boxShadow: '0 4px 12px rgb(46 124 246 / 0.35)',
              }}>
                Compress video →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
