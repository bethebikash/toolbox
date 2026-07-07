import { useState } from 'react';
import { generateSitemap, parseBulkURLs, DEFAULT_OPTS } from './engine';
import type { SitemapOptions, SitemapURL, ChangeFreq, Priority } from './engine';

const FREQS: ChangeFreq[]  = ['always','hourly','daily','weekly','monthly','yearly','never'];
const PRIORITIES: Priority[]= ['1.0','0.9','0.8','0.7','0.6','0.5','0.4','0.3','0.2','0.1'];
const today = new Date().toISOString().split('T')[0]!;

export default function SitemapGeneratorPage() {
  const [opts,     setOpts]     = useState<SitemapOptions>(DEFAULT_OPTS);
  const [bulk,     setBulk]     = useState('');
  const [tab,      setTab]      = useState<'manual' | 'bulk'>('manual');
  const [copied,   setCopied]   = useState(false);

  const output = generateSitemap(opts);

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function download() {
    const blob = new Blob([output], { type: 'application/xml' });
    const a    = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'sitemap.xml';
    a.click();
  }

  function updateURL(id: string, patch: Partial<SitemapURL>) {
    setOpts(o => ({ ...o, urls: o.urls.map(u => u.id === id ? { ...u, ...patch } : u) }));
  }

  function addURL() {
    setOpts(o => ({ ...o, urls: [...o.urls, { id: crypto.randomUUID(), loc: 'https://example.com/new-page', lastmod: today, changefreq: 'monthly', priority: '0.5' }] }));
  }

  function removeURL(id: string) {
    setOpts(o => ({ ...o, urls: o.urls.filter(u => u.id !== id) }));
  }

  function importBulk() {
    const parsed = parseBulkURLs(bulk, { lastmod: today, changefreq: 'weekly', priority: '0.5' });
    setOpts(o => ({ ...o, urls: [...o.urls, ...parsed] }));
    setBulk('');
  }

  const inputStyle = { padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none' };
  const selectStyle = { ...inputStyle, cursor: 'pointer' };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/seo" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>SEO Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Sitemap Generator</span>
      </div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Sitemap Generator</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Generate an XML sitemap for your website. Add URLs manually or in bulk.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 'var(--space-6)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)', padding: '3px', gap: '2px', width: 'fit-content' }}>
            {(['manual', 'bulk'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: 'var(--space-2) var(--space-5)', background: tab === t ? 'var(--color-surface)' : 'transparent', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: tab === t ? '600' : '400', color: tab === t ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: tab === t ? 'var(--shadow-sm)' : 'none', textTransform: 'capitalize' }}>{t}</button>
            ))}
          </div>

          {tab === 'bulk' ? (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-5)' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>Paste URLs (one per line)</label>
              <textarea value={bulk} onChange={e => setBulk(e.target.value)} placeholder={'https://example.com/\nhttps://example.com/about\nhttps://example.com/contact'}
                style={{ width: '100%', minHeight: '200px', padding: 'var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', resize: 'vertical' as const, boxSizing: 'border-box' as const }}
              />
              <button onClick={importBulk} disabled={!bulk.trim()} style={{ marginTop: 'var(--space-3)', padding: 'var(--space-2) var(--space-6)', background: bulk.trim() ? 'var(--color-brand-500)' : 'var(--color-border)', color: bulk.trim() ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: '600', cursor: bulk.trim() ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-sans)' }}>
                Import {bulk.trim().split('\n').filter(Boolean).length} URLs →
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {opts.urls.map((url, i) => (
                <div key={url.id} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-tertiary)', minWidth: '20px' }}>#{i+1}</span>
                    <input type="text" value={url.loc} onChange={e => updateURL(url.id, { loc: e.target.value })}
                      style={{ ...inputStyle, flex: 1 }} placeholder="https://example.com/page" />
                    <button onClick={() => removeURL(url.id)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontSize: '14px', padding: 'var(--space-1)' }}>✕</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-2)' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-tertiary)', marginBottom: '3px', fontWeight: '600' }}>Last modified</label>
                      <input type="date" value={url.lastmod} onChange={e => updateURL(url.id, { lastmod: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-tertiary)', marginBottom: '3px', fontWeight: '600' }}>Change freq</label>
                      <select value={url.changefreq} onChange={e => updateURL(url.id, { changefreq: e.target.value as ChangeFreq })} style={selectStyle}>
                        {FREQS.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-tertiary)', marginBottom: '3px', fontWeight: '600' }}>Priority</label>
                      <select value={url.priority} onChange={e => updateURL(url.id, { priority: e.target.value as Priority })} style={selectStyle}>
                        {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addURL} style={{ padding: 'var(--space-3)', background: 'var(--color-surface)', color: 'var(--color-brand-500)', border: '1px dashed var(--color-brand-500)', borderRadius: 'var(--radius-lg)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                + Add URL
              </button>
            </div>
          )}
        </div>

        {/* Output */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden', position: 'sticky' as const, top: '80px', alignSelf: 'flex-start' }}>
          <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>sitemap.xml · {opts.urls.filter(u => u.loc).length} URLs</span>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button onClick={copy} style={{ background: copied ? 'var(--color-success)' : 'none', color: copied ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>{copied ? 'Copied!' : 'Copy'}</button>
              <button onClick={download} style={{ padding: '2px 10px', background: 'var(--color-brand-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>↓ XML</button>
            </div>
          </div>
          <pre style={{ margin: 0, padding: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontSize: '11px', lineHeight: 1.6, color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: '500px', overflowY: 'auto' }}>
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
}
