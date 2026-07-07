import { useState } from 'react';
import { toUnicode, fromUnicode } from './engine';
import type { UnicodeResult } from './engine';

type Mode = 'encode' | 'decode';

export default function UnicodeConverterPage() {
  const [mode,   setMode]   = useState<Mode>('encode');
  const [input,  setInput]  = useState('Hello 世界 🌍');
  const [copied, setCopied] = useState<string | null>(null);

  const result: UnicodeResult | null = mode === 'encode' && input ? toUnicode(input) : null;
  const decoded: string = mode === 'decode' && input ? fromUnicode(input) : '';

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  const outputRows = result ? [
    { label: 'Code points',    value: result.codePoints,  key: 'cp' },
    { label: 'Escaped (JS)',   value: result.escaped,     key: 'es' },
    { label: 'HTML entities',  value: result.html,        key: 'html' },
    { label: 'UTF-8 bytes',    value: result.bytes,       key: 'bytes' },
  ] : [];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/text" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Text Tools</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Unicode Converter</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Unicode Converter</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Convert text to Unicode code points, escape sequences, HTML entities and UTF-8 bytes.</p>
      </div>

      {/* Mode toggle */}
      <div style={{ display: 'flex', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)', padding: '3px', gap: '2px', width: 'fit-content', marginBottom: 'var(--space-6)' }}>
        {(['encode', 'decode'] as Mode[]).map(m => (
          <button key={m} onClick={() => { setMode(m); setInput(''); }} style={{ padding: 'var(--space-2) var(--space-6)', background: mode === m ? 'var(--color-surface)' : 'transparent', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: mode === m ? '600' : '400', color: mode === m ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)', boxShadow: mode === m ? 'var(--shadow-sm)' : 'none', textTransform: 'capitalize' }}>{m}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden', marginBottom: 'var(--space-4)' }}>
        <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
          {mode === 'encode' ? 'Text input' : 'Unicode / escaped input'}
        </div>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter text to convert...' : 'Enter \\u0041 or &#65; to decode...'}
          style={{ width: '100%', minHeight: '100px', padding: 'var(--space-4)', border: 'none', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: '14px', lineHeight: 1.6, color: 'var(--color-text-primary)', background: 'transparent', boxSizing: 'border-box' }}
        />
      </div>

      {/* Encode results */}
      {mode === 'encode' && result && (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          {outputRows.map((row, i) => (
            <div key={row.key} style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: i < outputRows.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{row.label}</span>
                <button onClick={() => copy(row.value, row.key)} style={{ background: copied === row.key ? 'var(--color-success)' : 'none', color: copied === row.key ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied === row.key ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>
                  {copied === row.key ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <code style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', wordBreak: 'break-all', lineHeight: 1.6 }}>{row.value}</code>
            </div>
          ))}
        </div>
      )}

      {/* Decode result */}
      {mode === 'decode' && input && (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
            Decoded text
            <button onClick={() => copy(decoded, 'decoded')} style={{ background: copied === 'decoded' ? 'var(--color-success)' : 'none', color: copied === 'decoded' ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied === 'decoded' ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>
              {copied === 'decoded' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div style={{ padding: 'var(--space-5)', fontSize: '18px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)' }}>{decoded}</div>
        </div>
      )}
    </div>
  );
}
