import { useState } from 'react';
import { generateMetaTags, DEFAULT_OPTS } from './engine';
import type { MetaTagOptions } from './engine';

export default function MetaTagGeneratorPage() {
  const [opts,   setOpts]   = useState<MetaTagOptions>(DEFAULT_OPTS);
  const [copied, setCopied] = useState(false);

  const output = generateMetaTags(opts);

  function set(key: keyof MetaTagOptions, val: string) {
    setOpts(o => ({ ...o, [key]: val }));
  }

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const inputStyle = {
    width: '100%', padding: 'var(--space-2) var(--space-3)',
    border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)',
    fontSize: '14px', fontFamily: 'var(--font-sans)',
    color: 'var(--color-text-primary)', background: 'var(--color-surface)',
    outline: 'none', boxSizing: 'border-box' as const,
  };

  const labelStyle = {
    display: 'block' as const, fontSize: '13px', fontWeight: '600' as const,
    color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)',
  };

  const field = (label: string, key: keyof MetaTagOptions, placeholder?: string) => (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type="text" value={opts[key] as string} onChange={e => set(key, e.target.value)}
        placeholder={placeholder} style={inputStyle} />
    </div>
  );

  const sections = [
    { title: 'Basic', fields: [
      ['Page title',   'title'],
      ['Description',  'description'],
      ['Keywords',     'keywords'],
      ['Author',       'author'],
      ['Canonical URL','canonical'],
      ['Robots',       'robots'],
    ]},
    { title: 'Open Graph', fields: [
      ['OG Title',       'ogTitle'],
      ['OG Description', 'ogDescription'],
      ['OG Image URL',   'ogImage'],
      ['OG URL',         'ogUrl'],
      ['OG Type',        'ogType'],
    ]},
    { title: 'Twitter', fields: [
      ['Twitter Site',    'twitterSite'],
      ['Twitter Creator', 'twitterCreator'],
    ]},
  ] as const;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/seo" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>SEO Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Meta Tag Generator</span>
      </div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Meta Tag Generator</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Generate complete HTML meta tags including Open Graph and Twitter Card.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>

        {/* Left — inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {sections.map(section => (
            <div key={section.title} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-5)' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-4)' }}>
                {section.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {section.fields.map(([label, key]) => field(label, key as keyof MetaTagOptions))}
              </div>
            </div>
          ))}
        </div>

        {/* Right — output */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden', position: 'sticky' as const, top: '80px', alignSelf: 'flex-start' }}>
          <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
            Generated HTML
            <button onClick={copy} style={{ background: copied ? 'var(--color-success)' : 'none', color: copied ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>
              {copied ? 'Copied!' : 'Copy all'}
            </button>
          </div>
          <pre style={{ margin: 0, padding: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: 1.6, color: 'var(--color-text-primary)', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: '600px', overflowY: 'auto' }}>
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
}
