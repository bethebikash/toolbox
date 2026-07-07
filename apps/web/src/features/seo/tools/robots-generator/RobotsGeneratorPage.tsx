import { useState } from 'react';
import { generateRobotsTxt, DEFAULT_OPTS } from './engine';
import type { RobotsOptions, RobotsRule } from './engine';

export default function RobotsGeneratorPage() {
  const [opts,   setOpts]   = useState<RobotsOptions>(DEFAULT_OPTS);
  const [copied, setCopied] = useState(false);

  const output = generateRobotsTxt(opts);

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function updateRule(id: string, patch: Partial<RobotsRule>) {
    setOpts(o => ({ ...o, rules: o.rules.map(r => r.id === id ? { ...r, ...patch } : r) }));
  }

  function addRule() {
    setOpts(o => ({ ...o, rules: [...o.rules, { id: crypto.randomUUID(), userAgent: '*', allow: [], disallow: ['/'], crawlDelay: null }] }));
  }

  function removeRule(id: string) {
    setOpts(o => ({ ...o, rules: o.rules.filter(r => r.id !== id) }));
  }

  const inputStyle = { width: '100%', padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box' as const };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/seo" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>SEO Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Robots.txt Generator</span>
      </div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Robots.txt Generator</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Generate a robots.txt file to control search engine crawling.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {opts.rules.map((rule, i) => (
            <div key={rule.id} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-secondary)' }}>Rule {i + 1}</span>
                {opts.rules.length > 1 && (
                  <button onClick={() => removeRule(rule.id)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontSize: '12px', fontFamily: 'var(--font-sans)' }}>Remove</button>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>User-agent</label>
                  <input type="text" value={rule.userAgent} onChange={e => updateRule(rule.id, { userAgent: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>Disallow (one per line)</label>
                  <textarea value={rule.disallow.join('\n')} onChange={e => updateRule(rule.id, { disallow: e.target.value.split('\n') })}
                    style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' as const }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>Allow (one per line)</label>
                  <textarea value={rule.allow.join('\n')} onChange={e => updateRule(rule.id, { allow: e.target.value.split('\n') })}
                    style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' as const }} />
                </div>
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button onClick={addRule} style={{ flex: 1, padding: 'var(--space-3)', background: 'var(--color-surface)', color: 'var(--color-brand-500)', border: '1px dashed var(--color-brand-500)', borderRadius: 'var(--radius-lg)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
              + Add rule
            </button>
          </div>

          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-4)' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Sitemap URL</label>
            <input type="text" value={opts.sitemap} onChange={e => setOpts(o => ({ ...o, sitemap: e.target.value }))} style={inputStyle} />
          </div>
        </div>

        {/* Output */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden', position: 'sticky' as const, top: '80px', alignSelf: 'flex-start' }}>
          <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
            robots.txt
            <button onClick={copy} style={{ background: copied ? 'var(--color-success)' : 'none', color: copied ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre style={{ margin: 0, padding: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.7, color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap', minHeight: '300px' }}>
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
}
