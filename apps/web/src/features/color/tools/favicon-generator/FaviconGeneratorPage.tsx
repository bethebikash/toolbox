import { useState, useEffect, useRef } from 'react';
import { renderFaviconToCanvas, generateFavicons, FAVICON_SIZES, DEFAULT_OPTS } from './engine';
import type { FaviconOptions, FaviconResult, FaviconSize } from './engine';

export default function FaviconGeneratorPage() {
  const [opts,     setOpts]    = useState<FaviconOptions>(DEFAULT_OPTS);
  const [results,  setResults] = useState<FaviconResult[]>([]);
  const [generating, setGenerating] = useState(false);
  const previewRef = useRef<HTMLCanvasElement>(null);

  // Live preview at 128px
  useEffect(() => {
    if (previewRef.current) {
      renderFaviconToCanvas(previewRef.current, opts, 128);
    }
  }, [opts]);

  async function generate() {
    setGenerating(true);
    const res = await generateFavicons(opts, FAVICON_SIZES);
    setResults(res);
    setGenerating(false);
  }

  function download(r: FaviconResult) {
    const a = document.createElement('a');
    a.href = r.url;
    a.download = `favicon-${r.size}x${r.size}.png`;
    a.click();
  }

  function downloadAll() { results.forEach(download); }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/color" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Color & Design</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Favicon Generator</span>
      </div>

      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Favicon Generator</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>
          Create favicons in all standard sizes (16×16 to 256×256). Download as PNG.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 'var(--space-6)' }}>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)' }}>Design</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {/* Text */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Text (1–2 chars)</label>
                <input type="text" value={opts.text} maxLength={2}
                  onChange={e => setOpts(o => ({ ...o, text: e.target.value }))}
                  style={{ width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '24px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box', textAlign: 'center', fontWeight: '700', letterSpacing: '0.05em' }}
                />
              </div>

              {/* Shape */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Shape</label>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  {(['square', 'rounded', 'circle'] as const).map(s => (
                    <button key={s} onClick={() => setOpts(o => ({ ...o, shape: s }))} style={{
                      flex: 1, padding: 'var(--space-2)',
                      background: opts.shape === s ? 'var(--color-brand-500)' : 'var(--color-surface-2)',
                      color: opts.shape === s ? '#fff' : 'var(--color-text-secondary)',
                      border: '1px solid ' + (opts.shape === s ? 'var(--color-brand-500)' : 'var(--color-border)'),
                      borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '500',
                      cursor: 'pointer', fontFamily: 'var(--font-sans)', textTransform: 'capitalize',
                    }}>{s}</button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', cursor: 'pointer' }}>
                  <input type="color" value={opts.bgColor} onChange={e => setOpts(o => ({ ...o, bgColor: e.target.value }))}
                    style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', cursor: 'pointer', padding: '2px' }}
                  />
                  Background
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', cursor: 'pointer' }}>
                  <input type="color" value={opts.textColor} onChange={e => setOpts(o => ({ ...o, textColor: e.target.value }))}
                    style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', cursor: 'pointer', padding: '2px' }}
                  />
                  Text
                </label>
              </div>

              {/* Font size */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>Text size</label>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-brand-500)' }}>{Math.round(opts.fontSize * 100)}%</span>
                </div>
                <input type="range" min={0.3} max={0.9} step={0.05} value={opts.fontSize}
                  onChange={e => setOpts(o => ({ ...o, fontSize: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: 'var(--color-brand-500)' }}
                />
              </div>

              {/* Bold */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', cursor: 'pointer' }}>
                <input type="checkbox" checked={opts.bold} onChange={e => setOpts(o => ({ ...o, bold: e.target.checked }))}
                  style={{ accentColor: 'var(--color-brand-500)', width: '16px', height: '16px' }}
                />
                Bold text
              </label>
            </div>
          </div>

          <button onClick={generate} disabled={generating || !opts.text.trim()} style={{
            padding: 'var(--space-3) var(--space-8)',
            background: (generating || !opts.text.trim()) ? 'var(--color-border)' : 'var(--color-brand-500)',
            color: (generating || !opts.text.trim()) ? 'var(--color-text-tertiary)' : '#fff',
            border: 'none', borderRadius: 'var(--radius-lg)',
            fontSize: '15px', fontWeight: '600',
            cursor: (generating || !opts.text.trim()) ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-sans)',
            boxShadow: (generating || !opts.text.trim()) ? 'none' : '0 4px 12px rgb(46 124 246 / 0.35)',
          }}>
            {generating ? 'Generating...' : 'Generate all sizes →'}
          </button>
        </div>

        {/* Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', alignItems: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>Live preview</div>
          <canvas ref={previewRef} style={{ borderRadius: opts.shape === 'circle' ? '50%' : opts.shape === 'rounded' ? '16px' : '0', boxShadow: 'var(--shadow-lg)' }} />
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            {[16, 32, 48].map(s => {
              const c = document.createElement('canvas');
              renderFaviconToCanvas(c, opts, s);
              return (
                <div key={s} style={{ textAlign: 'center' }}>
                  <canvas width={s} height={s} style={{ borderRadius: opts.shape === 'circle' ? '50%' : '2px', display: 'block' }}
                    ref={el => { if (el) renderFaviconToCanvas(el, opts, s); }}
                  />
                  <div style={{ fontSize: '10px', color: 'var(--color-text-tertiary)', marginTop: '4px' }}>{s}px</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div style={{ marginTop: 'var(--space-6)', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>{results.length} sizes ready</span>
            <button onClick={downloadAll} style={{ padding: 'var(--space-2) var(--space-4)', background: 'var(--color-success)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
              ↓ Download all
            </button>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-5) var(--space-6)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            {results.map(r => (
              <div key={r.size} style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => download(r)}>
                <img src={r.url} alt={`${r.size}px`} style={{ width: Math.min(r.size, 64), height: Math.min(r.size, 64), display: 'block', borderRadius: opts.shape === 'circle' ? '50%' : '4px', border: '1px solid var(--color-border)', marginBottom: 'var(--space-1)' }} />
                <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>{r.size}px</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
