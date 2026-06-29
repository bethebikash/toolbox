import { useState, useCallback } from 'react';
import { generatePassword, generateBatch, getStrengthColor } from './engine';
import type { PasswordOptions, PasswordResult } from './engine';

const DEFAULT_OPTS: PasswordOptions = {
  length:    16,
  uppercase: true,
  lowercase: true,
  numbers:   true,
  symbols:   false,
  exclude:   '',
};

export default function PasswordGeneratorPage() {
  const [opts,     setOpts]     = useState<PasswordOptions>(DEFAULT_OPTS);
  const [result,   setResult]   = useState<PasswordResult>(() => generatePassword(DEFAULT_OPTS));
  const [batch,    setBatch]    = useState<PasswordResult[]>([]);
  const [batchCount, setBatchCount] = useState(5);
  const [copied,   setCopied]   = useState<string | null>(null);
  const [showBatch, setShowBatch] = useState(false);

  const generate = useCallback(() => {
    setResult(generatePassword(opts));
    if (showBatch) setBatch(generateBatch(opts, batchCount));
  }, [opts, showBatch, batchCount]);

  function copy(pw: string) {
    navigator.clipboard.writeText(pw);
    setCopied(pw);
    setTimeout(() => setCopied(null), 1500);
  }

  function toggle(key: keyof Pick<PasswordOptions, 'uppercase' | 'lowercase' | 'numbers' | 'symbols'>) {
    setOpts(o => {
      const next = { ...o, [key]: !o[key] };
      setResult(generatePassword(next));
      return next;
    });
  }

  const strengthLabel = {
    'weak':        'Weak',
    'fair':        'Fair',
    'strong':      'Strong',
    'very-strong': 'Very Strong',
  }[result.strength];

  const strengthPct = {
    'weak': 25, 'fair': 50, 'strong': 75, 'very-strong': 100,
  }[result.strength];

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/developer" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Developer Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Password Generator</span>
      </div>

      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>
          Password Generator
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>
          Generate cryptographically secure passwords using Web Crypto API.
        </p>
      </div>

      {/* Generated password display */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <code style={{
            flex: 1, fontSize: '18px', fontFamily: 'var(--font-mono)',
            color: 'var(--color-text-primary)', wordBreak: 'break-all',
            letterSpacing: '0.05em', lineHeight: 1.5,
          }}>
            {result.password || <span style={{ color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>Select at least one character type</span>}
          </code>
          <button
            onClick={() => result.password && copy(result.password)}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              background: copied === result.password ? 'var(--color-success)' : 'var(--color-brand-500)',
              color: '#fff', border: 'none', borderRadius: 'var(--radius-md)',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              fontFamily: 'var(--font-sans)', flexShrink: 0,
              transition: 'background var(--duration-fast)',
            }}
          >
            {copied === result.password ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        {/* Strength bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ flex: 1, height: '6px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: strengthPct + '%',
              background: getStrengthColor(result.strength),
              borderRadius: 'var(--radius-full)',
              transition: 'width var(--duration-normal), background var(--duration-normal)',
            }} />
          </div>
          <span style={{ fontSize: '12px', fontWeight: '600', color: getStrengthColor(result.strength), minWidth: '72px' }}>
            {strengthLabel}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
            {result.entropy} bits
          </span>
        </div>
      </div>

      {/* Options */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
        <div style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)' }}>
          Options
        </div>

        {/* Length */}
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-3)' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>Length</span>
            <span style={{ fontSize: '20px', fontWeight: '700', color: 'var(--color-brand-500)', fontVariantNumeric: 'tabular-nums' }}>{opts.length}</span>
          </div>
          <input type="range" min={4} max={128} step={1} value={opts.length}
            onChange={e => {
              const next = { ...opts, length: Number(e.target.value) };
              setOpts(next);
              setResult(generatePassword(next));
            }}
            style={{ width: '100%', accentColor: 'var(--color-brand-500)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-1)' }}>
            <span>4</span><span>128</span>
          </div>
        </div>

        {/* Character sets */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          {([
            ['uppercase', 'A-Z Uppercase'],
            ['lowercase', 'a-z Lowercase'],
            ['numbers',   '0-9 Numbers'],
            ['symbols',   '!@# Symbols'],
          ] as const).map(([key, label]) => (
            <label key={key} style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
              padding: 'var(--space-3)',
              background: opts[key] ? 'var(--color-brand-50)' : 'var(--color-surface-2)',
              border: '1px solid ' + (opts[key] ? 'var(--color-brand-500)' : 'var(--color-border)'),
              borderRadius: 'var(--radius-md)', cursor: 'pointer', userSelect: 'none',
              transition: 'all var(--duration-fast)',
            }}>
              <input type="checkbox" checked={opts[key]} onChange={() => toggle(key)}
                style={{ accentColor: 'var(--color-brand-500)', width: '16px', height: '16px' }}
              />
              <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text-primary)' }}>{label}</span>
            </label>
          ))}
        </div>

        {/* Exclude chars */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
            Exclude characters
          </label>
          <input
            type="text"
            value={opts.exclude}
            onChange={e => {
              const next = { ...opts, exclude: e.target.value };
              setOpts(next);
              setResult(generatePassword(next));
            }}
            placeholder="e.g. 0Oo1Il (to avoid confusion)"
            style={{
              width: '100%', padding: 'var(--space-2) var(--space-3)',
              border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)',
              fontSize: '14px', fontFamily: 'var(--font-mono)',
              color: 'var(--color-text-primary)', background: 'var(--color-surface)',
              outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <button onClick={generate} style={{
          flex: 1, padding: 'var(--space-3)',
          background: 'var(--color-brand-500)', color: '#fff',
          border: 'none', borderRadius: 'var(--radius-lg)',
          fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)',
          boxShadow: '0 4px 12px rgb(46 124 246 / 0.35)',
        }}>
          ↻ Generate new
        </button>
        <button
          onClick={() => { setShowBatch(b => !b); if (!showBatch) setBatch(generateBatch(opts, batchCount)); }}
          style={{
            padding: 'var(--space-3) var(--space-5)',
            background: showBatch ? 'var(--color-surface-2)' : 'var(--color-surface)',
            color: 'var(--color-text-secondary)',
            border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-lg)',
            fontSize: '15px', cursor: 'pointer', fontFamily: 'var(--font-sans)',
          }}
        >
          Batch
        </button>
      </div>

      {/* Batch */}
      {showBatch && (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Batch passwords</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <select value={batchCount} onChange={e => { setBatchCount(Number(e.target.value)); setBatch(generateBatch(opts, Number(e.target.value))); }}
                style={{ padding: '2px 8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontFamily: 'var(--font-sans)', background: 'var(--color-surface)', color: 'var(--color-text-primary)', outline: 'none' }}>
                {[5, 10, 20].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <button onClick={() => setBatch(generateBatch(opts, batchCount))} style={{ background: 'none', border: 'none', fontSize: '13px', color: 'var(--color-brand-500)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '600' }}>Regenerate</button>
            </div>
          </div>
          {batch.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-5)', borderBottom: i < batch.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-text-primary)', flex: 1, wordBreak: 'break-all' }}>{b.password}</code>
              <button onClick={() => copy(b.password)} style={{ padding: '2px 10px', background: copied === b.password ? 'var(--color-success)' : 'var(--color-surface-2)', color: copied === b.password ? '#fff' : 'var(--color-text-secondary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                {copied === b.password ? '✓' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
