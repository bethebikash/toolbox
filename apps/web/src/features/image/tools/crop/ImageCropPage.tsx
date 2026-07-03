import { useState, useRef, useCallback } from 'react';
import { cropImage, getImageSize, formatBytes } from './engine';
import type { CropArea, CropResult } from './engine';

type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp';

const FORMATS = [
  { id: 'image/jpeg' as OutputFormat, label: 'JPG' },
  { id: 'image/png'  as OutputFormat, label: 'PNG' },
  { id: 'image/webp' as OutputFormat, label: 'WebP' },
];

const PRESETS = [
  { label: '1:1 Square',   ratio: 1 / 1 },
  { label: '16:9',         ratio: 16 / 9 },
  { label: '4:3',          ratio: 4 / 3 },
  { label: '3:2',          ratio: 3 / 2 },
  { label: 'Free',         ratio: 0 },
];

export default function ImageCropPage() {
  const [file,      setFile]      = useState<File | null>(null);
  const [preview,   setPreview]   = useState<string | null>(null);
  const [imgSize,   setImgSize]   = useState<{ width: number; height: number } | null>(null);
  const [crop,      setCrop]      = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });
  const [format,    setFormat]    = useState<OutputFormat>('image/jpeg');
  const [quality,   setQuality]   = useState(0.92);
  const [result,    setResult]    = useState<CropResult | null>(null);
  const [busy,      setBusy]      = useState(false);
  const [error,     setError]     = useState('');
  const [dragging,  setDragging]  = useState(false);
  const [ratio,     setRatio]     = useState(0);
  const [isDragging,setIsDragging]= useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  async function handleFile(f: File) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError('');
    const size = await getImageSize(f);
    setImgSize(size);
    // Default crop: center 80%
    const cw = Math.round(size.width  * 0.8);
    const ch = Math.round(size.height * 0.8);
    setCrop({ x: Math.round(size.width  * 0.1), y: Math.round(size.height * 0.1), width: cw, height: ch });
  }

  function applyPreset(r: number) {
    setRatio(r);
    if (!imgSize || r === 0) return;
    const maxW = imgSize.width;
    const maxH = imgSize.height;
    let w = maxW, h = Math.round(w / r);
    if (h > maxH) { h = maxH; w = Math.round(h * r); }
    const x = Math.round((maxW - w) / 2);
    const y = Math.round((maxH - h) / 2);
    setCrop({ x, y, width: w, height: h });
  }

  const getScaledCoords = useCallback((e: React.MouseEvent) => {
    const div = previewRef.current;
    if (!div || !imgSize) return null;
    const rect    = div.getBoundingClientRect();
    const scaleX  = imgSize.width  / rect.width;
    const scaleY  = imgSize.height / rect.height;
    return {
      x: Math.round((e.clientX - rect.left) * scaleX),
      y: Math.round((e.clientY - rect.top)  * scaleY),
    };
  }, [imgSize]);

  function onMouseDown(e: React.MouseEvent) {
    const c = getScaledCoords(e);
    if (!c) return;
    setIsDragging(true);
    setDragStart(c);
    setCrop({ x: c.x, y: c.y, width: 0, height: 0 });
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging || !dragStart || !imgSize) return;
    const c = getScaledCoords(e);
    if (!c) return;
    let w = c.x - dragStart.x;
    let h = c.y - dragStart.y;
    if (ratio > 0) h = Math.round(Math.abs(w) / ratio) * Math.sign(h);
    const x = w >= 0 ? dragStart.x : dragStart.x + w;
    const y = h >= 0 ? dragStart.y : dragStart.y + h;
    setCrop({
      x:      Math.max(0, Math.min(x, imgSize.width)),
      y:      Math.max(0, Math.min(y, imgSize.height)),
      width:  Math.min(Math.abs(w), imgSize.width),
      height: Math.min(Math.abs(h), imgSize.height),
    });
  }

  function onMouseUp() { setIsDragging(false); setDragStart(null); }

  async function applyCrop() {
    if (!file || !crop.width || !crop.height) return;
    setBusy(true);
    setError('');
    try {
      const res = await cropImage(file, { area: crop, quality, format });
      setResult(res);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function download() {
    if (!result || !file) return;
    const ext = format.split('/')[1];
    const a   = document.createElement('a');
    a.href     = result.url;
    a.download = 'cropped_' + file.name.replace(/\.[^.]+$/, '') + '.' + ext;
    a.click();
  }

  // Overlay dimensions for the crop rectangle
  const overlayStyle = (): React.CSSProperties => {
    if (!imgSize || !previewRef.current) return {};
    const rect   = previewRef.current.getBoundingClientRect();
    const scaleX = rect.width  / imgSize.width;
    const scaleY = rect.height / imgSize.height;
    return {
      position:  'absolute',
      left:      crop.x * scaleX,
      top:       crop.y * scaleY,
      width:     crop.width  * scaleX,
      height:    crop.height * scaleY,
      border:    '2px solid var(--color-brand-500)',
      boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)',
      pointerEvents: 'none',
    };
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/image" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Image Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Crop</span>
      </div>

      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Image Crop</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>
          Drag to select a crop area. Choose a preset ratio or draw freely.
        </p>
      </div>

      {!file && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) handleFile(f); }}
          style={{ border: '2px dashed ' + (dragging ? 'var(--color-brand-500)' : 'var(--color-border-2)'), borderRadius: 'var(--radius-2xl)', padding: 'var(--space-16) var(--space-8)', textAlign: 'center', cursor: 'pointer', background: dragging ? 'var(--color-brand-50)' : 'var(--color-surface)', transition: 'all var(--duration-normal)' }}
        >
          <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-xl)', background: 'var(--color-brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)', fontSize: '24px' }}>✂️</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Drop an image or <span style={{ color: 'var(--color-brand-500)' }}>browse files</span></div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>JPG, PNG, WebP, AVIF</div>
          <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      )}

      {file && imgSize && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

          {/* Ratio presets */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', fontWeight: '600' }}>Ratio:</span>
            {PRESETS.map(p => (
              <button key={p.label} onClick={() => applyPreset(p.ratio)} style={{
                padding: 'var(--space-1) var(--space-3)',
                background: ratio === p.ratio ? 'var(--color-brand-500)' : 'var(--color-surface)',
                color: ratio === p.ratio ? '#fff' : 'var(--color-text-secondary)',
                border: '1px solid ' + (ratio === p.ratio ? 'var(--color-brand-500)' : 'var(--color-border)'),
                borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: '500',
                cursor: 'pointer', fontFamily: 'var(--font-sans)',
              }}>{p.label}</button>
            ))}
          </div>

          {/* Crop canvas */}
          <div
            ref={previewRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            style={{ position: 'relative', cursor: 'crosshair', userSelect: 'none', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-border)' }}
          >
            <img src={preview ?? ''} alt="" style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', display: 'block', background: 'var(--color-surface-2)' }} />
            {crop.width > 0 && crop.height > 0 && <div style={overlayStyle()} />}
          </div>

          {/* Crop info */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', gap: 'var(--space-3)', fontSize: '13px', color: 'var(--color-text-secondary)', alignItems: 'center', flex: 1, flexWrap: 'wrap' }}>
              {crop.width > 0 && crop.height > 0 ? (
                <>
                  <span>Crop: <strong style={{ color: 'var(--color-text-primary)' }}>{crop.width}×{crop.height}px</strong></span>
                  <span>at <strong style={{ color: 'var(--color-text-primary)' }}>({crop.x}, {crop.y})</strong></span>
                  <span style={{ color: 'var(--color-text-tertiary)' }}>Original: {imgSize.width}×{imgSize.height}px</span>
                </>
              ) : (
                <span style={{ color: 'var(--color-text-tertiary)' }}>Draw a crop area on the image above</span>
              )}
            </div>

            {/* Format */}
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              {FORMATS.map(f => (
                <button key={f.id} onClick={() => setFormat(f.id)} style={{
                  padding: 'var(--space-2) var(--space-3)',
                  background: format === f.id ? 'var(--color-brand-500)' : 'var(--color-surface)',
                  color: format === f.id ? '#fff' : 'var(--color-text-secondary)',
                  border: '1px solid ' + (format === f.id ? 'var(--color-brand-500)' : 'var(--color-border)'),
                  borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '600',
                  cursor: 'pointer', fontFamily: 'var(--font-sans)',
                }}>{f.label}</button>
              ))}
            </div>
          </div>

          {/* Result */}
          {result && (
            <div style={{ background: 'var(--color-success-bg)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4) var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-success)', marginBottom: '2px' }}>✓ Cropped successfully</div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{result.width}×{result.height}px · {formatBytes(result.outputSize)}</div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button onClick={download} style={{ padding: 'var(--space-2) var(--space-5)', background: 'var(--color-success)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>↓ Download</button>
              </div>
            </div>
          )}

          {error && (
            <div style={{ background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4) var(--space-5)', fontSize: '14px', color: 'var(--color-danger)' }}>⚠ {error}</div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--space-2)' }}>
            <button onClick={() => { setFile(null); setPreview(null); setImgSize(null); setResult(null); }}
              style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-4)', fontSize: '14px', color: 'var(--color-text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
              Change image
            </button>
            <button
              onClick={applyCrop}
              disabled={busy || !crop.width || !crop.height}
              style={{
                padding: 'var(--space-3) var(--space-8)',
                background: (busy || !crop.width || !crop.height) ? 'var(--color-border)' : 'var(--color-brand-500)',
                color: (busy || !crop.width || !crop.height) ? 'var(--color-text-tertiary)' : '#fff',
                border: 'none', borderRadius: 'var(--radius-lg)',
                fontSize: '15px', fontWeight: '600',
                cursor: (busy || !crop.width || !crop.height) ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-sans)',
                boxShadow: (busy || !crop.width) ? 'none' : '0 4px 12px rgb(46 124 246 / 0.35)',
              }}
            >
              {busy ? 'Cropping...' : 'Crop image →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
