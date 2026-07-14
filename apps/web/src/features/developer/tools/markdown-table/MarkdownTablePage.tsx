import { useState } from 'react';
import { parseCSVToTable, tableToMarkdown, markdownToHTML } from './engine';

const SAMPLE_CSV = `Name,Role,Department,Location
Alice Johnson,Engineer,Engineering,San Francisco
Bob Smith,Designer,Product,New York
Carol White,Manager,Operations,Chicago`;

type Mode = 'csv-to-md' | 'md-to-html';
type Align = 'left' | 'center' | 'right';

export default function MarkdownTablePage() {
  const [input,  setInput]  = useState(SAMPLE_CSV);
  const [mode,   setMode]   = useState<Mode>('csv-to-md');
  const [align,  setAlign]  = useState<Align>('left');
  const [copied, setCopied] = useState(false);

  const tableData = mode === 'csv-to-md' ? parseCSVToTable(input) : { headers: [], rows: [] };
  const output    = mode === 'csv-to-md' ? tableToMarkdown(tableData, align) : markdownToHTML(input);

  function copy() { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/developer" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Developer</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Markdown Table</span>
      </div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Markdown Table Generator</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Convert CSV to Markdown tables or Markdown tables to HTML.</p>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)', padding: '3px', gap: '2px' }}>
          {([['csv-to-md', 'CSV → Markdown'], ['md-to-html', 'Markdown → HTML']] as const).map(([m, l]) => (
            <button key={m} onClick={() => setMode(m)} style={{ padding: 'var(--space-2) var(--space-4)', background: mode === m ? 'var(--color-surface)' : 'transparent', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: mode === m ? '600' : '400', color: mode === m ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>{l}</button>
          ))}
        </div>
        {mode === 'csv-to-md' && (
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {(['left', 'center', 'right'] as Align[]).map(a => (
              <button key={a} onClick={() => setAlign(a)} style={{ padding: 'var(--space-1) var(--space-3)', background: align === a ? 'var(--color-brand-500)' : 'var(--color-surface)', color: align === a ? '#fff' : 'var(--color-text-secondary)', border: '1px solid ' + (align === a ? 'var(--color-brand-500)' : 'var(--color-border)'), borderRadius: 'var(--radius-md)', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', textTransform: 'capitalize' }}>{a}</button>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
            {mode === 'csv-to-md' ? 'CSV Input' : 'Markdown Input'}
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)} spellCheck={false}
            style={{ flex: 1, minHeight: '320px', padding: 'var(--space-4)', border: 'none', outline: 'none', resize: 'none', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.6, color: 'var(--color-text-primary)', background: 'transparent' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
            Output
            <button onClick={copy} style={{ background: copied ? 'var(--color-success)' : 'none', color: copied ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>{copied ? 'Copied!' : 'Copy'}</button>
          </div>
          <pre style={{ flex: 1, minHeight: '320px', margin: 0, padding: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.6, color: 'var(--color-text-primary)', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
}
