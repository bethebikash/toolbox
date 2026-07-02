import { useState, useEffect, useRef } from 'react';
import { generateQR, generateQRSVG, DEFAULT_OPTS } from './engine';
import type { QROptions, QRErrorLevel } from './engine';

const ERROR_LEVELS: { id: QRErrorLevel; label: string; desc: string }[] = [
  { id: 'L', label: 'L — 7%',  desc: 'Low correction' },
  { id: 'M', label: 'M — 15%', desc: 'Medium (default)' },
  { id: 'Q', label: 'Q — 25%', desc: 'High correction' },
  { id: 'H', label: 'H — 30%', desc: 'Max correction' },
];

export default function QRGeneratorPage() {
  const [text,    setText]   = useState('https://example.com');
  const [opts,    setOpts]   = useState<QROptions>(DEFAULT_OPTS);
  const [dataUrl, setDataUrl]= useState('');
  const [error,   setError]  = useState('');
  const [copied,  setCopied] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      if (!text.trim()) { setDataUrl(''); return; }
      try {
        const url = await generateQR(text, opts);
        setDataUrl(url);
        setError('');
      } catch {
        setError('Text too long or invalid for QR code');
      }
    }, 300);
  }, [text, opts]);

  async function downloadPNG() {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl; a.download = 'qrcode.png'; a.click();
  }

  async function downloadSVG() {
    if (!text.trim()) return;
    const svg  = await generateQRSVG(text, opts);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'qrcode.svg'; a.click();
    URL.revokeObjectURL(url);
  }

  function copyImage() {
    if (!dataUrl) return;
    fetch(dataUrl).then(r => r.blob()).then(blob => {
      navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/color" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Color & Design</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>QR Code Generator</span>
      </div>

      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>QR Code Generator</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>
          Generate QR codes for URLs, text, emails, or phone numbers. Download as PNG or SVG.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 'var(--space-6)' }}>

        {/* Left — input + options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

          {/* Text input */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
              Content
            </div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="URL, text, email, phone number..."
              style={{ width: '100%', minHeight: '120px', padding: 'var(--space-4)', border: 'none', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-sans)', fontSize: '15px', lineHeight: 1.6, color: 'var(--color-text-primary)', background: 'transparent', boxSizing: 'border-box' }}
            />
          </div>

          {/* Options */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-5)' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-4)' }}>Options</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

              {/* Size */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>Size</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-brand-500)' }}>{opts.size}px</span>
                </div>
                <input type="range" min={100} max={600} step={10} value={opts.size}
                  onChange={e => setOpts(o => ({ ...o, size: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: 'var(--color-brand-500)' }}
                />
              </div>

              {/* Error correction */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Error correction</div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  {ERROR_LEVELS.map(l => (
                    <button key={l.id} onClick={() => setOpts(o => ({ ...o, errorLevel: l.id }))} style={{
                      padding: 'var(--space-1) var(--space-3)',
                      background: opts.errorLevel === l.id ? 'var(--color-brand-500)' : 'var(--color-surface-2)',
                      color: opts.errorLevel === l.id ? '#fff' : 'var(--color-text-secondary)',
                      border: '1px solid ' + (opts.errorLevel === l.id ? 'var(--color-brand-500)' : 'var(--color-border)'),
                      borderRadius: 'var(--radius-md)', fontSize: '12px', fontWeight: '600',
                      cursor: 'pointer', fontFamily: 'var(--font-sans)',
                    }}>{l.label}</button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', cursor: 'pointer' }}>
                  <input type="color" value={opts.darkColor} onChange={e => setOpts(o => ({ ...o, darkColor: e.target.value }))}
                    style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', cursor: 'pointer', padding: '2px' }}
                  />
                  Dark
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', cursor: 'pointer' }}>
                  <input type="color" value={opts.lightColor} onChange={e => setOpts(o => ({ ...o, lightColor: e.target.value }))}
                    style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', cursor: 'pointer', padding: '2px' }}
                  />
                  Light
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right — preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '280px' }}>
            {dataUrl ? (
              <img src={dataUrl} alt="QR Code" style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)' }} />
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: '14px' }}>
                {error || 'Enter content to generate QR code'}
              </div>
            )}
          </div>

          {dataUrl && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <button onClick={downloadPNG} style={{ padding: 'var(--space-3)', background: 'var(--color-brand-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                ↓ Download PNG
              </button>
              <button onClick={downloadSVG} style={{ padding: 'var(--space-3)', background: 'var(--color-surface)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-lg)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                ↓ Download SVG
              </button>
              <button onClick={copyImage} style={{ padding: 'var(--space-3)', background: copied ? 'var(--color-success)' : 'var(--color-surface)', color: copied ? '#fff' : 'var(--color-text-secondary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all var(--duration-fast)' }}>
                {copied ? '✓ Copied to clipboard' : 'Copy image'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
