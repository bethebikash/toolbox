import { useState, useRef } from 'react';
import { readEXIF, formatBytes } from './engine';
import type { EXIFResult } from './engine';

export default function EXIFViewerPage() {
  const [file,     setFile]     = useState<File | null>(null);
  const [preview,  setPreview]  = useState<string | null>(null);
  const [result,   setResult]   = useState<EXIFResult | null>(null);
  const [busy,     setBusy]     = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(f: File) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setBusy(true);
    try {
      const res = await readEXIF(f);
      setResult(res);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/image" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Image Tools</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>EXIF Viewer</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>EXIF Data Viewer</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>View metadata and EXIF information embedded in image files.</p>
      </div>

      {!file && (
        <div onClick={() => inputRef.current?.click()} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) handleFile(f); }}
          style={{ border: '2px dashed ' + (dragging ? 'var(--color-brand-500)' : 'var(--color-border-2)'), borderRadius: 'var(--radius-2xl)', padding: 'var(--space-16) var(--space-8)', textAlign: 'center', cursor: 'pointer', background: dragging ? 'var(--color-brand-50)' : 'var(--color-surface)', transition: 'all var(--duration-normal)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-xl)', background: 'var(--color-brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)', fontSize: '24px' }}>🔍</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Drop an image or <span style={{ color: 'var(--color-brand-500)' }}>browse files</span></div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>JPG, PNG, WebP, TIFF</div>
          <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      )}

      {file && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <img src={preview ?? ''} alt="" style={{ width: '100%', maxHeight: '280px', objectFit: 'contain', display: 'block', background: 'var(--color-surface-2)' }} />
            <div style={{ padding: 'var(--space-3) var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>{file.name} · {formatBytes(file.size)}</span>
              <button onClick={() => { setFile(null); setPreview(null); setResult(null); }} style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-1) var(--space-3)', fontSize: '12px', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Change</button>
            </div>
          </div>

          {busy && <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-text-tertiary)' }}>Reading metadata...</div>}

          {result && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
                Metadata — {result.tags.length} fields
              </div>
              {result.tags.map((tag, i) => (
                <div key={tag.tag} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4) var(--space-5)', borderBottom: i < result.tags.length - 1 ? '1px solid var(--color-border)' : 'none', gap: 'var(--space-4)' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', minWidth: '140px' }}>{tag.label}</span>
                  <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', wordBreak: 'break-all', textAlign: 'right' }}>{tag.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
