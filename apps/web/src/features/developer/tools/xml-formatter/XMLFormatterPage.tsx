import { useState } from 'react';
import { formatXML, minifyXML } from './engine';

const SAMPLE = '<catalog><book id="1"><title>XML Developer Guide</title><author>Gambardella</author><price>44.95</price></book><book id="2"><title>Midnight Rain</title><author>Ralls</author><price>5.95</price></book></catalog>';

type Mode = 'format' | 'minify';

export default function XMLFormatterPage() {
  const [input,  setInput]  = useState(SAMPLE);
  const [mode,   setMode]   = useState<Mode>('format');
  const [copied, setCopied] = useState(false);

  const result = mode === 'format' ? formatXML(input) : minifyXML(input);

  function copy() {
    if (result.ok) { navigator.clipboard.writeText(result.output); setCopied(true); setTimeout(() => setCopied(false), 1500); }
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/developer" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Developer Tools</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>XML Formatter</span>
      </div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>XML Formatter</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Format and validate XML documents. Minify or beautify instantly.</p>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)', alignItems: 'center' }}>
        <div style={{ display: 'flex', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)', padding: '3px', gap: '2px' }}>
          {(['format', 'minify'] as Mode[]).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ padding: 'var(--space-2) var(--space-5)', background: mode === m ? 'var(--color-surface)' : 'transparent', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: mode === m ? '600' : '400', color: mode === m ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: mode === m ? 'var(--shadow-sm)' : 'none', textTransform: 'capitalize' }}>{m}</button>
          ))}
        </div>
        {!result.ok && <span style={{ fontSize: '14px', color: 'var(--color-danger)', fontWeight: '500' }}>⚠ {result.error}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
            XML Input
            <button onClick={() => setInput('')} style={{ background: 'none', border: 'none', fontSize: '12px', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Clear</button>
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)} spellCheck={false} style={{ flex: 1, minHeight: '400px', padding: 'var(--space-4)', border: 'none', outline: 'none', resize: 'none', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.6, color: 'var(--color-text-primary)', background: 'transparent' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: result.ok ? '1px solid var(--color-border)' : '1px solid var(--color-danger)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
            Output
            {result.ok && <button onClick={copy} style={{ background: copied ? 'var(--color-success)' : 'none', color: copied ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>{copied ? 'Copied!' : 'Copy'}</button>}
          </div>
          {result.ok ? (
            <pre style={{ flex: 1, minHeight: '400px', margin: 0, padding: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.6, color: 'var(--color-text-primary)', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
              {result.output}
            </pre>
          ) : (
            <div style={{ padding: 'var(--space-4)', color: 'var(--color-danger)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{result.error}</div>
          )}
        </div>
      </div>
    </div>
  );
}
