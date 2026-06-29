import { useState, useCallback } from 'react';
import { hashAll } from './engine';
import type { HashResult } from './engine';

export default function HashGeneratorPage() {
  const [input,   setInput]   = useState('');
  const [results, setResults] = useState<HashResult[]>([]);
  const [copied,  setCopied]  = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const run = useCallback(async () => {
    if (!input.trim()) return;
    setLoading(true);
    const res = await hashAll(input);
    setResults(res);
    setLoading(false);
  }, [input]);

  function copy(hash: string) {
    navigator.clipboard.writeText(hash);
    setCopied(hash);
    setTimeout(() => setCopied(null), 1500);
  }

  const LENGTHS: Record<string, number> = {
    'MD5': 32, 'SHA-1': 40, 'SHA-256': 64, 'SHA-384': 96, 'SHA-512': 128,
  };

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/developer" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Developer Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Hash Generator</span>
      </div>

      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>
          Hash Generator
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>
          Generate MD5, SHA-1, SHA-256, SHA-384 and SHA-512 hashes. Runs entirely in your browser.
        </p>
      </div>

      {/* Input */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden', marginBottom: 'var(--space-4)' }}>
        <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
          Input text
          <button onClick={() => { setInput(''); setResults([]); }} style={{ background: 'none', border: 'none', fontSize: '12px', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Clear</button>
        </div>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter text to hash..."
          spellCheck={false}
          style={{ width: '100%', minHeight: '140px', padding: 'var(--space-4)', border: 'none', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: '14px', lineHeight: 1.6, color: 'var(--color-text-primary)', background: 'transparent', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-6)' }}>
        <button
          onClick={run}
          disabled={!input.trim() || loading}
          style={{
            padding: 'var(--space-3) var(--space-8)',
            background: input.trim() ? 'var(--color-brand-500)' : 'var(--color-border)',
            color: input.trim() ? '#fff' : 'var(--color-text-tertiary)',
            border: 'none', borderRadius: 'var(--radius-lg)',
            fontSize: '15px', fontWeight: '600',
            cursor: input.trim() ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--font-sans)',
            boxShadow: input.trim() ? '0 4px 12px rgb(46 124 246 / 0.35)' : 'none',
          }}
        >
          {loading ? 'Hashing...' : 'Generate hashes →'}
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          {results.map((r, i) => (
            <div key={r.algorithm} style={{
              display: 'grid', gridTemplateColumns: '100px 1fr auto',
              alignItems: 'center', gap: 'var(--space-4)',
              padding: 'var(--space-4) var(--space-5)',
              borderBottom: i < results.length - 1 ? '1px solid var(--color-border)' : 'none',
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-primary)' }}>{r.algorithm}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>{LENGTHS[r.algorithm]} chars</div>
              </div>
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-secondary)', wordBreak: 'break-all', lineHeight: 1.5 }}>
                {r.hash}
              </code>
              <button
                onClick={() => copy(r.hash)}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  background: copied === r.hash ? 'var(--color-success)' : 'var(--color-surface-2)',
                  color: copied === r.hash ? '#fff' : 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                  fontSize: '12px', fontWeight: '500', cursor: 'pointer',
                  fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap',
                  transition: 'all var(--duration-fast)',
                }}
              >
                {copied === r.hash ? '✓' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
