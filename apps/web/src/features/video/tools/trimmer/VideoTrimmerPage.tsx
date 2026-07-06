import { useState, useRef } from 'react';
import { trimVideo, formatTime, formatBytes } from './engine';
import type { TrimOptions, TrimResult } from './engine';

type AppState = 'idle' | 'loading' | 'processing' | 'done' | 'error';

const DEFAULT_OPTS: TrimOptions = { startTime: 0, endTime: 30, format: 'mp4' };

export default function VideoTrimmerPage() {
  const [file,       setFile]       = useState<File | null>(null);
  const [preview,    setPreview]    = useState<string | null>(null);
  const [duration,   setDuration]   = useState(0);
  const [opts,       setOpts]       = useState<TrimOptions>(DEFAULT_OPTS);
  const [state,      setState]      = useState<AppState>('idle');
  const [progress,   setProgress]   = useState(0);
  const [result,     setResult]     = useState<TrimResult | null>(null);
  const [error,      setError]      = useState('');
  const [dragging,   setDragging]   = useState(false);
  const inputRef  = useRef<HTMLInputElement>(null);
  const videoRef  = useRef<HTMLVideoElement>(null);

  function handleFile(f: File) {
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    setResult(null);
    setError('');
    setState('idle');
  }

  function onVideoLoaded() {
    const dur = videoRef.current?.duration ?? 0;
    setDuration(Math.floor(dur));
    setOpts(o => ({ ...o, startTime: 0, endTime: Math.min(30, Math.floor(dur)) }));
  }

  async function trim() {
    if (!file) return;
    setState('loading');
    setProgress(0);
    setError('');
    try {
      const res = await trimVideo(file, opts, pct => {
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
    if (!result || !file) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = 'trimmed_' + file.name.replace(/\.[^.]+$/, '') + '.' + opts.format;
    a.click();
  }

  const trimDuration = opts.endTime - opts.startTime;

  const inputStyle = {
    width: '90px', padding: 'var(--space-2) var(--space-3)',
    border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)',
    fontSize: '15px', fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none',
    textAlign: 'center' as const, fontWeight: '600' as const,
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/video" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Video Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Trimmer</span>
      </div>

      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Video Trimmer</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>
          Trim video to a specific start and end time. Powered by FFmpeg — runs in your browser.
        </p>
      </div>

      <div style={{ padding: 'var(--space-3) var(--space-5)', background: 'var(--color-warning-bg)', border: '1px solid var(--color-warning)', borderRadius: 'var(--radius-lg)', fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-2)' }}>
        <span>⚡</span>
        <span>First use downloads FFmpeg (~30 MB). Subsequent trims are instant.</span>
      </div>

      {!file && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('video/')) handleFile(f); }}
          style={{ border: '2px dashed ' + (dragging ? 'var(--color-brand-500)' : 'var(--color-border-2)'), borderRadius: 'var(--radius-2xl)', padding: 'var(--space-16) var(--space-8)', textAlign: 'center', cursor: 'pointer', background: dragging ? 'var(--color-brand-50)' : 'var(--color-surface)', transition: 'all var(--duration-normal)' }}
        >
          <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-xl)', background: 'var(--color-brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)', fontSize: '24px' }}>✂️</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Drop a video or <span style={{ color: 'var(--color-brand-500)' }}>browse files</span></div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>MP4, MOV, AVI, WebM</div>
          <input ref={inputRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      )}

      {file && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

          {/* Video preview */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <video
              ref={videoRef}
              src={result?.url ?? preview ?? ''}
              controls
              onLoadedMetadata={onVideoLoaded}
              style={{ width: '100%', maxHeight: '360px', background: '#000', display: 'block' }}
            />
            <div style={{ padding: 'var(--space-4) var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                {file.name} · {formatBytes(file.size)} · {formatTime(duration)}
              </div>
              {state === 'idle' && (
                <button onClick={() => { setFile(null); setPreview(null); setResult(null); setState('idle'); }}
                  style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', fontSize: '13px', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                  Change file
                </button>
              )}
            </div>
          </div>

          {/* Trim controls */}
          {state === 'idle' && duration > 0 && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)' }}>Trim range</div>

              {/* Timeline slider */}
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-tertiary)', marginBottom: '4px', fontWeight: '600' }}>Start</label>
                    <input
                      type="number"
                      min={0}
                      max={opts.endTime - 1}
                      value={opts.startTime}
                      onChange={e => setOpts(o => ({ ...o, startTime: Math.min(Number(e.target.value), o.endTime - 1) }))}
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-brand-500)' }}>{formatTime(trimDuration)}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>duration</div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-tertiary)', marginBottom: '4px', fontWeight: '600' }}>End</label>
                    <input
                      type="number"
                      min={opts.startTime + 1}
                      max={duration}
                      value={opts.endTime}
                      onChange={e => setOpts(o => ({ ...o, endTime: Math.max(Number(e.target.value), o.startTime + 1) }))}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Range visualization */}
                <div style={{ position: 'relative', height: '8px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute',
                    left:  `${(opts.startTime / duration) * 100}%`,
                    width: `${((opts.endTime - opts.startTime) / duration) * 100}%`,
                    height: '100%',
                    background: 'var(--color-brand-500)',
                    borderRadius: 'var(--radius-full)',
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-tertiary)', marginTop: '4px' }}>
                  <span>0:00</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Output format */}
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Output format</div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  {(['mp4', 'webm', 'mov'] as const).map(f => (
                    <button key={f} onClick={() => setOpts(o => ({ ...o, format: f }))} style={{
                      padding: 'var(--space-2) var(--space-4)',
                      background: opts.format === f ? 'var(--color-brand-500)' : 'var(--color-surface-2)',
                      color: opts.format === f ? '#fff' : 'var(--color-text-secondary)',
                      border: '1px solid ' + (opts.format === f ? 'var(--color-brand-500)' : 'var(--color-border)'),
                      borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '600',
                      cursor: 'pointer', fontFamily: 'var(--font-sans)',
                    }}>{f.toUpperCase()}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Progress */}
          {(state === 'loading' || state === 'processing') && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-8)', textAlign: 'center' }}>
              {state === 'loading' ? (
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Loading FFmpeg...</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>Downloading ~30 MB on first use</div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>Trimming... {progress}%</div>
                  <div style={{ height: '6px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden', maxWidth: '400px', margin: '0 auto' }}>
                    <div style={{ height: '100%', width: progress + '%', background: 'var(--color-brand-500)', borderRadius: 'var(--radius-full)', transition: 'width 0.3s linear' }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Result */}
          {state === 'done' && result && (
            <div style={{ background: 'var(--color-success-bg)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5) var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-success)', marginBottom: 'var(--space-1)' }}>✓ Trimmed successfully</div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  {formatTime(result.duration)} · {formatBytes(result.outputSize)}
                  <span style={{ color: 'var(--color-text-tertiary)', marginLeft: 'var(--space-2)' }}>(was {formatBytes(result.originalSize)})</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button onClick={download} style={{ padding: 'var(--space-3) var(--space-6)', background: 'var(--color-success)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>↓ Download</button>
                <button onClick={() => { setState('idle'); setResult(null); }} style={{ padding: 'var(--space-3) var(--space-4)', background: 'none', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-lg)', fontSize: '15px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Trim again</button>
              </div>
            </div>
          )}

          {/* Error */}
          {state === 'error' && (
            <div style={{ background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4) var(--space-5)', fontSize: '14px', color: 'var(--color-danger)' }}>
              ⚠ {error}
              <button onClick={() => setState('idle')} style={{ marginLeft: 'var(--space-4)', background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '13px', textDecoration: 'underline' }}>Try again</button>
            </div>
          )}

          {/* Action */}
          {state === 'idle' && duration > 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 'var(--space-2)' }}>
              <button onClick={trim} style={{ padding: 'var(--space-3) var(--space-8)', background: 'var(--color-brand-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 4px 12px rgb(46 124 246 / 0.35)' }}>
                Trim video →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
