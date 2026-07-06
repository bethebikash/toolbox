import { useState, useRef } from 'react';
import { extractAudio, formatBytes, FORMAT_LABELS } from './engine';
import type { ExtractOptions, ExtractResult, AudioFormat } from './engine';

type AppState = 'idle' | 'loading' | 'processing' | 'done' | 'error';

const DEFAULT_OPTS: ExtractOptions = { format: 'mp3', bitrate: 192, quality: 5 };

const FORMATS: AudioFormat[] = ['mp3', 'aac', 'wav', 'flac', 'ogg'];

const BITRATES = [64, 96, 128, 192, 256, 320];

export default function ExtractAudioPage() {
  const [file,     setFile]     = useState<File | null>(null);
  const [preview,  setPreview]  = useState<string | null>(null);
  const [opts,     setOpts]     = useState<ExtractOptions>(DEFAULT_OPTS);
  const [state,    setState]    = useState<AppState>('idle');
  const [progress, setProgress] = useState(0);
  const [result,   setResult]   = useState<ExtractResult | null>(null);
  const [error,    setError]    = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError('');
    setState('idle');
  }

  async function extract() {
    if (!file) return;
    setState('loading');
    setProgress(0);
    setError('');
    try {
      const res = await extractAudio(file, opts, pct => {
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
    a.download = file.name.replace(/\.[^.]+$/, '') + '.' + opts.format;
    a.click();
  }

  const needsBitrate = opts.format === 'mp3' || opts.format === 'aac';

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/audio" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Audio Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Extract Audio</span>
      </div>

      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Extract Audio from Video</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>
          Extract audio from any video file. Download as MP3, AAC, WAV, FLAC or OGG.
        </p>
      </div>

      <div style={{ padding: 'var(--space-3) var(--space-5)', background: 'var(--color-warning-bg)', border: '1px solid var(--color-warning)', borderRadius: 'var(--radius-lg)', fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-2)' }}>
        <span>⚡</span>
        <span>First use downloads FFmpeg (~30 MB). Subsequent extractions are instant.</span>
      </div>

      {!file && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('video/') || f?.type.startsWith('audio/')) handleFile(f); }}
          style={{ border: '2px dashed ' + (dragging ? 'var(--color-brand-500)' : 'var(--color-border-2)'), borderRadius: 'var(--radius-2xl)', padding: 'var(--space-16) var(--space-8)', textAlign: 'center', cursor: 'pointer', background: dragging ? 'var(--color-brand-50)' : 'var(--color-surface)', transition: 'all var(--duration-normal)' }}
        >
          <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-xl)', background: 'var(--color-brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)', fontSize: '24px' }}>🎵</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Drop a video or <span style={{ color: 'var(--color-brand-500)' }}>browse files</span></div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>MP4, MOV, AVI, WebM · up to 500 MB</div>
          <input ref={inputRef} type="file" accept="video/*,audio/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
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
            {state === 'idle' && (
              <button onClick={() => { setFile(null); setPreview(null); setResult(null); }}
                style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', fontSize: '13px', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                Change file
              </button>
            )}
          </div>

          {/* Options */}
          {state === 'idle' && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)' }}>Output settings</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                {/* Format */}
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>Audio format</div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                    {FORMATS.map(f => (
                      <button key={f} onClick={() => setOpts(o => ({ ...o, format: f }))} style={{
                        padding: 'var(--space-2) var(--space-5)',
                        background: opts.format === f ? 'var(--color-brand-500)' : 'var(--color-surface-2)',
                        color: opts.format === f ? '#fff' : 'var(--color-text-secondary)',
                        border: '1px solid ' + (opts.format === f ? 'var(--color-brand-500)' : 'var(--color-border)'),
                        borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: '600',
                        cursor: 'pointer', fontFamily: 'var(--font-sans)',
                      }}>{FORMAT_LABELS[f]}</button>
                    ))}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-2)' }}>
                    {opts.format === 'mp3'  && 'Best compatibility. Good quality at 192kbps.'}
                    {opts.format === 'aac'  && 'Better quality than MP3 at same bitrate.'}
                    {opts.format === 'wav'  && 'Lossless, uncompressed. Large file size.'}
                    {opts.format === 'flac' && 'Lossless compression. Smaller than WAV.'}
                    {opts.format === 'ogg'  && 'Open format. Good quality at lower bitrates.'}
                  </div>
                </div>

                {/* Bitrate — for MP3/AAC only */}
                {needsBitrate && (
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>Bitrate</div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                      {BITRATES.map(b => (
                        <button key={b} onClick={() => setOpts(o => ({ ...o, bitrate: b }))} style={{
                          padding: 'var(--space-2) var(--space-3)',
                          background: opts.bitrate === b ? 'var(--color-brand-500)' : 'var(--color-surface-2)',
                          color: opts.bitrate === b ? '#fff' : 'var(--color-text-secondary)',
                          border: '1px solid ' + (opts.bitrate === b ? 'var(--color-brand-500)' : 'var(--color-border)'),
                          borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '600',
                          cursor: 'pointer', fontFamily: 'var(--font-sans)',
                        }}>{b}k</button>
                      ))}
                    </div>
                  </div>
                )}
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
                  <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>Extracting audio... {progress}%</div>
                  <div style={{ height: '6px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden', maxWidth: '400px', margin: '0 auto' }}>
                    <div style={{ height: '100%', width: progress + '%', background: 'var(--color-brand-500)', borderRadius: 'var(--radius-full)', transition: 'width 0.3s linear' }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Result */}
          {state === 'done' && result && (
            <div style={{ background: 'var(--color-success-bg)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5) var(--space-6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-success)', marginBottom: 'var(--space-1)' }}>✓ Audio extracted successfully</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                    {FORMAT_LABELS[result.format]} · {formatBytes(result.outputSize)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button onClick={download} style={{ padding: 'var(--space-3) var(--space-6)', background: 'var(--color-success)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>↓ Download {FORMAT_LABELS[result.format]}</button>
                  <button onClick={() => { setState('idle'); setResult(null); }} style={{ padding: 'var(--space-3) var(--space-4)', background: 'none', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-lg)', fontSize: '15px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Extract again</button>
                </div>
              </div>
              {/* Audio player */}
              <audio controls src={result.url} style={{ width: '100%', marginTop: 'var(--space-4)' }} />
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
          {state === 'idle' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 'var(--space-2)' }}>
              <button onClick={extract} style={{ padding: 'var(--space-3) var(--space-8)', background: 'var(--color-brand-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 4px 12px rgb(46 124 246 / 0.35)' }}>
                Extract audio →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
