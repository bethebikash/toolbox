import { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { FORMAT_LABELS, FORMAT_EXAMPLES, DEFAULT_OPTS } from './engine';
import type { BarcodeOptions, BarcodeFormat } from './engine';

const FORMATS = Object.keys(FORMAT_LABELS) as BarcodeFormat[];

export default function BarcodeGeneratorPage() {
  const [value,  setValue]  = useState('Hello World');
  const [opts,   setOpts]   = useState<BarcodeOptions>(DEFAULT_OPTS);
  const [error,  setError]  = useState('');
  const [copied, setCopied] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !value.trim()) return;
    try {
      JsBarcode(svgRef.current, value, {
        format:       opts.format,
        lineColor:    opts.lineColor,
        background:   opts.background,
        width:        opts.width,
        height:       opts.height,
        displayValue: opts.displayValue,
        fontSize:     opts.fontSize,
        margin:       10,
      });
      setError('');
    } catch (e) {
      setError((e as Error).message.replace('JsBarcode:', '').trim());
    }
  }, [value, opts]);

  function downloadPNG() {
    if (!svgRef.current) return;
    const svg    = svgRef.current;
    const data   = new XMLSerializer().serializeToString(svg);
    const blob   = new Blob([data], { type: 'image/svg+xml' });
    const url    = URL.createObjectURL(blob);
    const img    = new Image();
    img.onload   = () => {
      const canvas = document.createElement('canvas');
      canvas.width  = svg.width.baseVal.value;
      canvas.height = svg.height.baseVal.value;
      canvas.getContext('2d')!.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = 'barcode.png';
      a.click();
    };
    img.src = url;
  }

  function downloadSVG() {
    if (!svgRef.current) return;
    const data = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([data], { type: 'image/svg+xml' });
    const a    = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'barcode.svg';
    a.click();
  }

  function copyValue() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function selectFormat(fmt: BarcodeFormat) {
    setOpts(o => ({ ...o, format: fmt }));
    setValue(FORMAT_EXAMPLES[fmt]);
  }

  const inputStyle = {
    width: '100%', padding: 'var(--space-2) var(--space-3)',
    border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)',
    fontSize: '14px', fontFamily: 'var(--font-sans)',
    color: 'var(--color-text-primary)', background: 'var(--color-surface)',
    outline: 'none', boxSizing: 'border-box' as const,
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/color" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Color & Design</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Barcode Generator</span>
      </div>

      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Barcode Generator</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>
          Generate Code 128, EAN, UPC and more barcodes. Download as PNG or SVG.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 'var(--space-6)' }}>

        {/* Left — preview + input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

          {/* Barcode preview */}
          <div style={{ background: opts.background, borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '180px' }}>
            {error ? (
              <div style={{ textAlign: 'center', color: 'var(--color-danger)', fontSize: '14px', maxWidth: '280px' }}>
                <div style={{ fontSize: '24px', marginBottom: 'var(--space-2)' }}>⚠</div>
                {error}
              </div>
            ) : (
              <svg ref={svgRef} style={{ maxWidth: '100%' }} />
            )}
          </div>

          {/* Value input */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
              Value
            </label>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <input type="text" value={value} onChange={e => setValue(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
              <button onClick={copyValue} style={{ padding: 'var(--space-2) var(--space-4)', background: copied ? 'var(--color-success)' : 'var(--color-surface-2)', color: copied ? '#fff' : 'var(--color-text-secondary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500', whiteSpace: 'nowrap' }}>
                {copied ? '✓' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Format selector */}
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>Format</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {FORMATS.map(fmt => (
                <button key={fmt} onClick={() => selectFormat(fmt)} style={{
                  padding: 'var(--space-3) var(--space-4)',
                  background: opts.format === fmt ? 'var(--color-brand-50)' : 'var(--color-surface-2)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid ' + (opts.format === fmt ? 'var(--color-brand-500)' : 'var(--color-border)'),
                  borderRadius: 'var(--radius-md)', fontSize: '13px',
                  cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  textAlign: 'left',
                }}>
                  <span style={{ fontWeight: '500' }}>{FORMAT_LABELS[fmt]}</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>{FORMAT_EXAMPLES[fmt]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-5)' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-4)' }}>Appearance</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {/* Colors */}
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', cursor: 'pointer', flex: 1 }}>
                  <input type="color" value={opts.lineColor} onChange={e => setOpts(o => ({ ...o, lineColor: e.target.value }))}
                    style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', cursor: 'pointer', padding: '2px' }}
                  />
                  Bars
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', cursor: 'pointer', flex: 1 }}>
                  <input type="color" value={opts.background} onChange={e => setOpts(o => ({ ...o, background: e.target.value }))}
                    style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', cursor: 'pointer', padding: '2px' }}
                  />
                  BG
                </label>
              </div>

              {/* Height */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Height</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-brand-500)' }}>{opts.height}px</span>
                </div>
                <input type="range" min={40} max={200} step={10} value={opts.height}
                  onChange={e => setOpts(o => ({ ...o, height: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: 'var(--color-brand-500)' }}
                />
              </div>

              {/* Bar width */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Bar width</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-brand-500)' }}>{opts.width}x</span>
                </div>
                <input type="range" min={1} max={4} step={0.5} value={opts.width}
                  onChange={e => setOpts(o => ({ ...o, width: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: 'var(--color-brand-500)' }}
                />
              </div>

              {/* Show value */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                <input type="checkbox" checked={opts.displayValue} onChange={e => setOpts(o => ({ ...o, displayValue: e.target.checked }))}
                  style={{ accentColor: 'var(--color-brand-500)', width: '16px', height: '16px' }}
                />
                Show value text
              </label>
            </div>
          </div>

          {/* Download buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <button onClick={downloadPNG} disabled={!!error} style={{ padding: 'var(--space-3)', background: error ? 'var(--color-border)' : 'var(--color-brand-500)', color: error ? 'var(--color-text-tertiary)' : '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '14px', fontWeight: '600', cursor: error ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)' }}>
              ↓ Download PNG
            </button>
            <button onClick={downloadSVG} disabled={!!error} style={{ padding: 'var(--space-3)', background: error ? 'var(--color-border)' : 'var(--color-surface)', color: error ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)', border: '1px solid ' + (error ? 'transparent' : 'var(--color-border-2)'), borderRadius: 'var(--radius-lg)', fontSize: '14px', fontWeight: '600', cursor: error ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)' }}>
              ↓ Download SVG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
