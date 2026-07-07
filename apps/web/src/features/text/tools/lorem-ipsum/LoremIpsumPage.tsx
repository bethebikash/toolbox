import { useState } from 'react';
import { generateLorem } from './engine';
import type { LoremType, LoremOptions } from './engine';

export default function LoremIpsumPage() {
  const [opts,   setOpts]   = useState<LoremOptions>({ type: 'paragraphs', count: 3, startWithLorem: true });
  const [output, setOutput] = useState(() => generateLorem({ type: 'paragraphs', count: 3, startWithLorem: true }));
  const [copied, setCopied] = useState(false);

  function generate() { setOutput(generateLorem(opts)); }
  function copy() { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/text" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Text Tools</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Lorem Ipsum</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Lorem Ipsum Generator</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Generate placeholder text for your designs and mockups.</p>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-5)', marginBottom: 'var(--space-4)', display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Type</div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {(['words', 'sentences', 'paragraphs'] as LoremType[]).map(t => (
              <button key={t} onClick={() => setOpts(o => ({ ...o, type: t }))} style={{ padding: 'var(--space-2) var(--space-4)', background: opts.type === t ? 'var(--color-brand-500)' : 'var(--color-surface-2)', color: opts.type === t ? '#fff' : 'var(--color-text-secondary)', border: '1px solid ' + (opts.type === t ? 'var(--color-brand-500)' : 'var(--color-border)'), borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-sans)', textTransform: 'capitalize' }}>{t}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Count</div>
          <input type="number" min={1} max={50} value={opts.count} onChange={e => setOpts(o => ({ ...o, count: Math.max(1, Number(e.target.value)) }))}
            style={{ width: '80px', padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '15px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', textAlign: 'center', fontWeight: '600' }}
          />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '14px', fontWeight: '500', color: 'var(--color-text-primary)', cursor: 'pointer', paddingBottom: 'var(--space-1)' }}>
          <input type="checkbox" checked={opts.startWithLorem} onChange={e => setOpts(o => ({ ...o, startWithLorem: e.target.checked }))} style={{ accentColor: 'var(--color-brand-500)', width: '16px', height: '16px' }} />
          Start with "Lorem ipsum"
        </label>
        <button onClick={generate} style={{ padding: 'var(--space-2) var(--space-6)', background: 'var(--color-brand-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)', marginLeft: 'auto' }}>
          Generate →
        </button>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
          Lorem ipsum text
          <button onClick={copy} style={{ background: copied ? 'var(--color-success)' : 'none', color: copied ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>{copied ? 'Copied!' : 'Copy'}</button>
        </div>
        <div style={{ padding: 'var(--space-5)', fontSize: '15px', lineHeight: 1.7, color: 'var(--color-text-secondary)', whiteSpace: 'pre-wrap' }}>{output}</div>
      </div>
    </div>
  );
}
