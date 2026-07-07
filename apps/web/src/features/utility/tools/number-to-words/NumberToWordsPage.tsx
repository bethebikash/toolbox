import { useState } from 'react';
import { numberToWords } from './engine';

export default function NumberToWordsPage() {
  const [input,  setInput]  = useState('1234567');
  const [copied, setCopied] = useState(false);

  const num    = parseFloat(input) || 0;
  const output = numberToWords(num);

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const EXAMPLES = ['0', '42', '100', '1000', '1000000', '1234567890', '-15', '3.14'];

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/utility" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Utility Tools</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Number to Words</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Number to Words</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Convert any number to its English word representation.</p>
      </div>

      <div style={{ marginBottom: 'var(--space-4)' }}>
        <input type="number" value={input} onChange={e => setInput(e.target.value)}
          style={{ width: '100%', padding: 'var(--space-4)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-xl)', fontSize: '24px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box', textAlign: 'center', fontWeight: '700' }}
        />
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
        {EXAMPLES.map(ex => (
          <button key={ex} onClick={() => setInput(ex)} style={{ padding: 'var(--space-1) var(--space-3)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-full)', fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>{ex}</button>
        ))}
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
          In words
          <button onClick={copy} style={{ background: copied ? 'var(--color-success)' : 'none', color: copied ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>{copied ? 'Copied!' : 'Copy'}</button>
        </div>
        <div style={{ padding: 'var(--space-6)', fontSize: '20px', fontWeight: '600', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>{output}</div>
      </div>
    </div>
  );
}
