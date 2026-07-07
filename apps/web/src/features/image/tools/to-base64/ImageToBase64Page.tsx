import { useState, useRef } from 'react';
import { imageToBase64, generateImgTag, generateCSSBackground, formatBytes } from './engine';
import type { ImageBase64Result } from './engine';

export default function ImageToBase64Page() {
  const [file,    setFile]    = useState<File | null>(null);
  const [result,  setResult]  = useState<ImageBase64Result | null>(null);
  const [busy,    setBusy]    = useState(false);
  const [copied,  setCopied]  = useState<string | null>(null);
  const [dragging,setDragging]= useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(f: File) {
    setFile(f);
    setBusy(true);
    try {
      const res = await imageToBase64(f);
      setResult(res);
    } finally {
      setBusy(false);
    }
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/image" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Image Tools</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Image to Base64</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Image to Base64</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Convert images to Base64 encoded strings for use in HTML, CSS or JavaScript.</p>
      </div>

      {!file && (
        <div onClick={() => inputRef.current?.click()} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) handleFile(f); }}
          style={{ border: '2px dashed ' + (dragging ? 'var(--color-brand-500)' : 'var(--color-border-2)'), borderRadius: 'var(--radius-2xl)', padding: 'var(--space-16) var(--space-8)', textAlign: 'center', cursor: 'pointer', background: dragging ? 'var(--color-brand-50)' : 'var(--color-surface)', transition: 'all var(--duration-normal)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-xl)', background: 'var(--color-brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)', fontSize: '24px' }}>🔤</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Drop an image or <span style={{ color: 'var(--color-brand-500)' }}>browse files</span></div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>JPG, PNG, WebP, SVG, GIF</div>
          <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      )}

      {busy && <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-tertiary)' }}>Encoding...</div>}

      {result && file && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Preview */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <img src={result.dataUrl} alt="" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', display: 'block', background: 'var(--color-surface-2)' }} />
            <div style={{ padding: 'var(--space-4) var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                {file.name} · {formatBytes(result.sizeBytes)} → {result.base64Length.toLocaleString()} chars
              </div>
              <button onClick={() => { setFile(null); setResult(null); }} style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-1) var(--space-3)', fontSize: '12px', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Change</button>
            </div>
          </div>

          {/* Output formats */}
          {[
            { key: 'base64',  label: 'Base64 string',       value: result.base64 },
            { key: 'dataurl', label: 'Data URL',             value: result.dataUrl },
            { key: 'img',     label: 'HTML <img> tag',       value: generateImgTag(result) },
            { key: 'css',     label: 'CSS background-image', value: generateCSSBackground(result) },
          ].map(item => (
            <div key={item.key} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
                {item.label}
                <button onClick={() => copy(item.value, item.key)} style={{ background: copied === item.key ? 'var(--color-success)' : 'none', color: copied === item.key ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied === item.key ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>
                  {copied === item.key ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div style={{ padding: 'var(--space-3) var(--space-5)', fontFamily: 'var(--font-mono)', fontSize: '12px', color:'var(--color-text-secondary)', wordBreak: 'break-all', maxHeight: '80px', overflow: 'hidden', lineHeight: 1.5 }}>
                {item.value.slice(0, 200)}{item.value.length > 200 ? '...' : ''}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
