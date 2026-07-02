import { useState, useMemo } from 'react';
import { markdownToHTML } from './engine';

const SAMPLE = `# Welcome to Toolbox

**Toolbox** is a privacy-first browser utility platform.

## Features
- 100+ tools across image, PDF, video and more
- All processing runs _in your browser_
- No uploads, no accounts, no limits

## Code example
\`\`\`js
const result = await compressImage(file, { quality: 0.8 });
\`\`\`

[Learn more](https://example.com)`;

export default function MarkdownConverterPage() {
  const [input,  setInput]  = useState(SAMPLE);
  const [mode,   setMode]   = useState<'preview' | 'html'>('preview');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => markdownToHTML(input), [input]);

  function copy() {
    navigator.clipboard.writeText(result.html);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/text" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Text Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Markdown Converter</span>
      </div>

      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Markdown Converter</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>
          Convert Markdown to HTML with live preview. Updates as you type.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
        {[
          { label: 'Words', value: result.wordCount },
          { label: 'Lines', value: result.lineCount },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-3) var(--space-5)', display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-brand-500)' }}>{s.value}</span>
            <span style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>

        {/* Input */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
            Markdown
            <button onClick={() => setInput('')} style={{ background: 'none', border: 'none', fontSize: '12px', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Clear</button>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            spellCheck={false}
            style={{ flex: 1, minHeight: '520px', padding: 'var(--space-4)', border: 'none', outline: 'none', resize: 'none', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.7, color: 'var(--color-text-primary)', background: 'transparent' }}
          />
        </div>

        {/* Output */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: '2px', gap: '2px' }}>
              {(['preview', 'html'] as const).map(m => (
                <button key={m} onClick={() => setMode(m)} style={{
                  padding: 'var(--space-1) var(--space-3)',
                  background: mode === m ? 'var(--color-brand-500)' : 'transparent',
                  color: mode === m ? '#fff' : 'var(--color-text-secondary)',
                  border: 'none', borderRadius: 'var(--radius-sm)',
                  fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                  fontFamily: 'var(--font-sans)', textTransform: 'capitalize',
                }}>{m}</button>
              ))}
            </div>
            <button onClick={copy} style={{ background: copied ? 'var(--color-success)' : 'none', color: copied ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>
              {copied ? 'Copied!' : 'Copy HTML'}
            </button>
          </div>

          {mode === 'preview' ? (
            <div
              style={{ flex: 1, padding: 'var(--space-6)', overflow: 'auto', fontSize: '15px', lineHeight: 1.7, color: 'var(--color-text-primary)' }}
              dangerouslySetInnerHTML={{ __html: result.html }}
            />
          ) : (
            <pre style={{ flex: 1, margin: 0, padding: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: 1.6, color: 'var(--color-text-primary)', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {result.html}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
