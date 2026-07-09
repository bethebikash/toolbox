import { useState } from 'react';
import { convertBase, formatWithSpaces, BASE_LABELS } from './engine';
import type { Base } from './engine';

const BASES: Base[] = [2, 8, 10, 16];

export default function BaseConverterPage() {
  const [input,    setInput]    = useState('255');
  const [fromBase, setFromBase] = useState<Base>(10);
  const [copied,   setCopied]   = useState<string | null>(null);

  const result = convertBase(input, fromBase);

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  const outputs = result ? [
    { label: 'Binary',      base: 'BIN', value: result.binary,      grouped: formatWithSpaces(result.binary, 4), key: 'bin' },
    { label: 'Octal',       base: 'OCT', value: result.octal,       grouped: result.octal, key: 'oct' },
    { label: 'Decimal',     base: 'DEC', value: result.decimal,     grouped: parseInt(result.decimal).toLocaleString(), key: 'dec' },
    { label: 'Hexadecimal', base: 'HEX', value: result.hexadecimal, grouped: formatWithSpaces(result.hexadecimal, 2), key: 'hex' },
  ] : [];

  const QUICK = ['0', '1', '7', '8', '9', '10', '15', '16', '255', '256', '65535', '1048576'];

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/utility" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Utility</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Base Converter</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Number Base Converter</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Convert numbers between binary, octal, decimal and hexadecimal.</p>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
        {/* Base selector */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
          {BASES.map(b => (
            <button key={b} onClick={() => setFromBase(b)} style={{
              padding: 'var(--space-2) var(--space-4)',
              background: fromBase === b ? 'var(--color-brand-500)' : 'var(--color-surface-2)',
              color: fromBase === b ? '#fff' : 'var(--color-text-secondary)',
              border: '1px solid ' + (fromBase === b ? 'var(--color-brand-500)' : 'var(--color-border)'),
              borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '600',
              cursor: 'pointer', fontFamily: 'var(--font-sans)',
            }}>Base {b}</button>
          ))}
        </div>

        <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-2)' }}>{BASE_LABELS[fromBase]}</div>
        <input type="text" value={input} onChange={e => setInput(e.target.value)}
          placeholder={fromBase === 16 ? 'e.g. FF or ff' : fromBase === 2 ? 'e.g. 11111111' : 'e.g. 255'}
          style={{ width: '100%', padding: 'var(--space-4)', border: '1px solid ' + (result || !input.trim() ? 'var(--color-border-2)' : 'var(--color-danger)'), borderRadius: 'var(--radius-md)', fontSize: '24px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box', fontWeight: '700', letterSpacing: '0.05em' }}
        />

        {/* Quick values */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)', flexWrap: 'wrap' }}>
          {QUICK.map(q => (
            <button key={q} onClick={() => { setInput(q); setFromBase(10); }} style={{ padding: 'var(--space-1) var(--space-2)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)', cursor: 'pointer' }}>{q}</button>
          ))}
        </div>
      </div>

      {result && (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          {outputs.map((o, i) => (
            <div key={o.key} style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: i < outputs.length - 1 ? '1px solid var(--color-border)' : 'none', background: o.base === { 2:'BIN', 8:'OCT', 10:'DEC', 16:'HEX' }[fromBase] ? 'var(--color-brand-50)' : 'transparent' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{o.label} ({o.base})</div>
                  <div style={{ fontSize: '18px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--color-text-primary)', wordBreak: 'break-all' }}>{o.value}</div>
                  {o.grouped !== o.value && (
                    <div style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>{o.grouped}</div>
                  )}
                </div>
                <button onClick={() => copy(o.value, o.key)} style={{ background: copied === o.key ? 'var(--color-success)' : 'none', color: copied === o.key ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied === o.key ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500', flexShrink: 0 }}>
                  {copied === o.key ? '✓' : 'Copy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!result && input.trim() && (
        <div style={{ background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4) var(--space-5)', fontSize: '14px', color: 'var(--color-danger)' }}>
          ⚠ Invalid {BASE_LABELS[fromBase]} number: "{input}"
        </div>
      )}
    </div>
  );
}
