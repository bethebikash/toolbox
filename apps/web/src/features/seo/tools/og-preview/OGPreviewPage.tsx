import { useState } from 'react';
import { generateOGTags, DEFAULT_OG } from './engine';
import type { OGData } from './engine';

export default function OGPreviewPage() {
  const [og,     setOg]     = useState<OGData>(DEFAULT_OG);
  const [copied, setCopied] = useState(false);

  const output = generateOGTags(og);

  function set(key: keyof OGData, val: string) { setOg(o => ({ ...o, [key]: val })); }

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const inputStyle = { width: '100%', padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '14px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box' as const };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/seo" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>SEO Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Open Graph Preview</span>
      </div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Open Graph Preview</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Preview how your page looks when shared on Facebook, LinkedIn and Slack.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        {/* Inputs */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {([
              ['Title',       'title'],
              ['Description', 'description'],
              ['Image URL',   'image'],
              ['Page URL',    'url'],
              ['Site name',   'siteName'],
            ] as [string, keyof OGData][]).map(([label, key]) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>{label}</label>
                {key === 'description' ? (
                  <textarea value={og[key]} onChange={e => set(key, e.target.value)}
                    style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' as const }} />
                ) : (
                  <input type="text" value={og[key]} onChange={e => set(key, e.target.value)} style={inputStyle} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Preview + code */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Facebook-style card */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
              Facebook / LinkedIn preview
            </div>
            {og.image && (
              <img src={og.image} alt="" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', display: 'block', background: 'var(--color-surface-2)' }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <div style={{ padding: 'var(--space-3) var(--space-4)', background: '#f0f2f5' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#606770', marginBottom: '4px' }}>
                {og.url ? new URL(og.url.startsWith('http') ? og.url : 'https://' + og.url).hostname : 'example.com'}
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#1d2129', marginBottom: '4px', lineHeight: 1.3 }}>{og.title || 'Title'}</div>
              <div style={{ fontSize: '14px', color: '#606770', lineHeight: 1.4 }}>{og.description || 'Description'}</div>
            </div>
          </div>

          {/* Code */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
              HTML tags
              <button onClick={copy} style={{ background: copied ? 'var(--color-success)' : 'none', color: copied ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre style={{ margin: 0, padding: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontSize: '11px', lineHeight: 1.6, color: 'var(--color-text-primary)', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {output}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
