import { useState } from 'react';
import { toSlug, DEFAULT_OPTS } from './engine';
import type { SlugOptions } from './engine';

export default function TextToSlugPage() {
  const [input,  setInput]  = useState('My Awesome Blog Post Title!');
  const [opts,   setOpts]   = useState<SlugOptions>(DEFAULT_OPTS);
  const [copied, setCopied] = useState(false);

  const output = toSlug(input, opts);

  function copy() { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  const inputStyle = { width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '15px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box' as const };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/text" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Text Tools</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Text to Slug</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Text to Slug</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Convert text to URL-friendly slugs. Removes special characters and diacritics.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Input text</label>
          <input type="text" value={input} onChange={e => setInput(e.target.value)} style={inputStyle} />
        </div>

        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-5)', display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Separator</div>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              {(['-', '_', '.'] as const).map(s => (
                <button key={s} onClick={() => setOpts(o => ({ ...o, separator: s }))} style={{ padding: 'var(--space-2) var(--space-4)', background: opts.separator === s ? 'var(--color-brand-500)' : 'var(--color-surface-2)', color: opts.separator === s ? '#fff' : 'var(--color-text-secondary)', border: '1px solid ' + (opts.separator === s ? 'var(--color-brand-500)' : 'var(--color-border)'), borderRadius: 'var(--radius-md)', fontSize: '16px', fontFamily: 'var(--font-mono)', cursor: 'pointer' }}>{s}</button>
              ))}
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '14px', fontWeight: '500', color: 'var(--color-text-primary)', cursor: 'pointer' }}>
            <input type="checkbox" checked={opts.lowercase} onChange={e => setOpts(o => ({ ...o, lowercase: e.target.checked }))} style={{ accentColor: 'var(--color-brand-500)', width: '16px', height: '16px' }} />
            Lowercase
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '14px', fontWeight: '500', color: 'var(--color-text-primary)', cursor: 'pointer' }}>
            <input type="checkbox" checked={opts.removeStop} onChange={e => setOpts(o => ({ ...o, removeStop: e.target.checked }))} style={{ accentColor: 'var(--color-brand-500)', width: '16px', height: '16px' }} />
            Remove stop words
          </label>
        </div>

        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
            Slug output
            <button onClick={copy} style={{ background: copied ? 'var(--color-success)' : 'none', color: copied ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>{copied ? 'Copied!' : 'Copy'}</button>
          </div>
          <div style={{ padding: 'var(--space-5)', fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: '600', color: 'var(--color-brand-500)', wordBreak: 'break-all' }}>
            {output || <span style={{ color: 'var(--color-text-tertiary)', fontWeight: '400' }}>slug-will-appear-here</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
