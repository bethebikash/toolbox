import { useState } from 'react';
import { getTitleStatus, getDescStatus, DEFAULT_SERP } from './engine';
import type { SERPData } from './engine';

export default function SERPPreviewPage() {
  const [data, setData] = useState<SERPData>(DEFAULT_SERP);

  function set(key: keyof SERPData, val: string) { setData(d => ({ ...d, [key]: val })); }

  const titleStatus = getTitleStatus(data.title);
  const descStatus  = getDescStatus(data.description);

  const inputStyle = { width: '100%', padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '14px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box' as const };

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/seo" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>SEO Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>SERP Preview</span>
      </div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>SERP Preview</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Preview how your page appears in Google search results.</p>
      </div>

      {/* Google SERP preview */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)', marginBottom: 'var(--space-6)', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ fontSize: '12px', color: '#202124', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: '#1a73e8' }}>G</div>
          <span style={{ color: '#202124' }}>{data.url || 'https://example.com'}</span>
        </div>
        <div style={{ fontSize: '20px', color: '#1a0dab', cursor: 'pointer', marginBottom: '4px', lineHeight: 1.3, maxWidth: '600px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {data.title || 'Page Title'}
        </div>
        <div style={{ fontSize: '14px', color: '#4d5156', lineHeight: 1.58, maxWidth: '600px' }}>
          {data.description ? (data.description.length > 160 ? data.description.slice(0, 159) + '…' : data.description) : 'Meta description...'}
        </div>
      </div>

      {/* Inputs */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>Page title</label>
              <span style={{ fontSize: '12px', fontWeight: '600', color: titleStatus.ok ? 'var(--color-success)' : 'var(--color-warning)' }}>{titleStatus.msg}</span>
            </div>
            <input type="text" value={data.title} onChange={e => set('title', e.target.value)} style={inputStyle} />
            <div style={{ height: '4px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', marginTop: 'var(--space-2)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: Math.min((data.title.length / 60) * 100, 100) + '%', background: titleStatus.ok ? 'var(--color-success)' : data.title.length > 60 ? 'var(--color-danger)' : 'var(--color-warning)', borderRadius: 'var(--radius-full)', transition: 'width 0.1s' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>URL</label>
            <input type="text" value={data.url} onChange={e => set('url', e.target.value)} style={inputStyle} />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>Meta description</label>
              <span style={{ fontSize: '12px', fontWeight: '600', color: descStatus.ok ? 'var(--color-success)' : 'var(--color-warning)' }}>{descStatus.msg}</span>
            </div>
            <textarea value={data.description} onChange={e => set('description', e.target.value)}
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' as const }} />
            <div style={{ height: '4px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', marginTop: 'var(--space-2)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: Math.min((data.description.length / 160) * 100, 100) + '%', background: descStatus.ok ? 'var(--color-success)' : data.description.length > 160 ? 'var(--color-danger)' : 'var(--color-warning)', borderRadius: 'var(--radius-full)', transition: 'width 0.1s' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
