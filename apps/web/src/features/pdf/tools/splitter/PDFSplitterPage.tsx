import { useState, useRef } from 'react';
import { splitPDF, getPageCount, formatBytes } from './engine';
import type { SplitOptions, SplitResult, SplitMode } from './engine';

type AppState = 'idle' | 'loading' | 'processing' | 'done' | 'error';

export default function PDFSplitterPage() {
  const [file,      setFile]      = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [opts,      setOpts]      = useState<SplitOptions>({ mode: 'all' });
  const [state,     setState]     = useState<AppState>('idle');
  const [progress,  setProgress]  = useState(0);
  const [results,   setResults]   = useState<SplitResult[]>([]);
  const [error,     setError]     = useState('');
  const [dragging,  setDragging]  = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(f: File) {
    setFile(f);
    setResults([]);
    setState('loading');
    try {
      const count = await getPageCount(f);
      setPageCount(count);
      setState('idle');
    } catch {
      setError('Could not read PDF — is it a valid file?');
      setState('error');
    }
  }

  async function split() {
    if (!file) return;
    setState('processing');
    setProgress(0);
    setError('');
    try {
      const res = await splitPDF(file, opts, setProgress);
      setResults(res);
      setState('done');
    } catch (e) {
      setError((e as Error).message);
      setState('error');
    }
  }

  function download(r: SplitResult) {
    const a = document.createElement('a');
    a.href = r.url; a.download = r.filename; a.click();
  }

  function downloadAll() { results.forEach(download); }

  const modeLabels: Record<SplitMode, string> = {
    all:   'Extract all pages',
    range: 'Custom range',
    every: 'Split every N pages',
  };

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/pdf" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>PDF Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Splitter</span>
      </div>

      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>PDF Splitter</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>
          Split a PDF into individual pages, custom ranges, or chunks. Files never leave your device.
        </p>
      </div>

      {/* Drop zone */}
      {!file && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f?.type === 'application/pdf') handleFile(f); }}
          style={{ border: '2px dashed ' + (dragging ? 'var(--color-brand-500)' : 'var(--color-border-2)'), borderRadius: 'var(--radius-2xl)', padding: 'var(--space-16) var(--space-8)', textAlign: 'center', cursor: 'pointer', background: dragging ? 'var(--color-brand-50)' : 'var(--color-surface)', transition: 'all var(--duration-normal)' }}
        >
          <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-xl)', background: 'var(--color-brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)', fontSize: '24px' }}>✂️</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Drop a PDF or <span style={{ color: 'var(--color-brand-500)' }}>browse files</span></div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>PDF only · up to 100 MB</div>
          <input ref={inputRef} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      )}

      {file && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

          {/* File info */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '2px' }}>{file.name}</div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
                {state === 'loading' ? 'Reading PDF...' : `${pageCount} pages · ${formatBytes(file.size)}`}
              </div>
            </div>
            <button onClick={() => { setFile(null); setResults([]); setState('idle'); setPageCount(0); }}
              style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', fontSize: '13px', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
              Change file
            </button>
          </div>

          {/* Split options */}
          {state === 'idle' && pageCount > 0 && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)' }}>Split mode</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {(['all', 'range', 'every'] as SplitMode[]).map(m => (
                  <label key={m} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', padding: 'var(--space-4)', background: opts.mode === m ? 'var(--color-brand-50)' : 'var(--color-surface-2)', border: '1px solid ' + (opts.mode === m ? 'var(--color-brand-500)' : 'var(--color-border)'), borderRadius: 'var(--radius-lg)', cursor: 'pointer', transition: 'all var(--duration-fast)' }}>
                    <input type="radio" name="mode" value={m} checked={opts.mode === m}
                      onChange={() => setOpts(o => ({ ...o, mode: m }))}
                      style={{ accentColor: 'var(--color-brand-500)', marginTop: '2px', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '2px' }}>{modeLabels[m]}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                        {m === 'all'   && `Extract each page as a separate PDF (${pageCount} files)`}
                        {m === 'range' && 'Specify exact pages or ranges e.g. 1-3,5,7-9'}
                        {m === 'every' && 'Split into chunks of N pages each'}
                      </div>

                      {/* Sub-options */}
                      {opts.mode === m && m === 'range' && (
                        <input
                          type="text"
                          placeholder={`e.g. 1-3,5,7-${pageCount}`}
                          value={opts.range ?? ''}
                          onChange={e => setOpts(o => ({ ...o, range: e.target.value }))}
                          onClick={e => e.stopPropagation()}
                          style={{ marginTop: 'var(--space-3)', width: '100%', padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box' }}
                        />
                      )}
                      {opts.mode === m && m === 'every' && (
                        <div style={{ marginTop: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Every</span>
                          <input type="number" min={1} max={pageCount - 1} value={opts.everyN ?? 1}
                            onChange={e => setOpts(o => ({ ...o, everyN: Number(e.target.value) }))}
                            onClick={e => e.stopPropagation()}
                            style={{ width: '64px', padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '14px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none' }}
                          />
                          <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>pages</span>
                          {opts.everyN && <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>→ {Math.ceil(pageCount / opts.everyN)} files</span>}
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Progress */}
          {state === 'processing' && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)', textAlign: 'center' }}>
              <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>Splitting PDF... {progress}%</div>
              <div style={{ height: '6px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden', maxWidth: '400px', margin: '0 auto' }}>
                <div style={{ height: '100%', width: progress + '%', background: 'var(--color-brand-500)', borderRadius: 'var(--radius-full)', transition: 'width 0.2s linear' }} />
              </div>
            </div>
          )}

          {/* Error */}
          {state === 'error' && (
            <div style={{ background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4) var(--space-5)', fontSize: '14px', color: 'var(--color-danger)' }}>⚠ {error}</div>
          )}

          {/* Results */}
          {state === 'done' && results.length > 0 && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>
                  {results.length} file{results.length !== 1 ? 's' : ''} ready
                </span>
                <button onClick={downloadAll} style={{ padding: 'var(--space-2) var(--space-4)', background: 'var(--color-success)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                  ↓ Download all
                </button>
              </div>
              {results.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-6)', borderBottom: i < results.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: 'var(--color-brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: 'var(--color-brand-500)', flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '2px' }}>{r.filename}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{r.pages} page{r.pages !== 1 ? 's' : ''} · {formatBytes(r.sizeBytes)}</div>
                    </div>
                  </div>
                  <button onClick={() => download(r)} style={{ padding: 'var(--space-2) var(--space-4)', background: 'var(--color-success)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap' }}>↓ Download</button>
                </div>
              ))}
            </div>
          )}

          {/* Action */}
          {state === 'idle' && pageCount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 'var(--space-2)' }}>
              <button onClick={split} style={{ padding: 'var(--space-3) var(--space-8)', background: 'var(--color-brand-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: '0 4px 12px rgb(46 124 246 / 0.35)' }}>
                Split PDF →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
