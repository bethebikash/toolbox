import { useState } from 'react';
import { parseCron, PRESETS } from './engine';

export default function CronParserPage() {
  const [expr,   setExpr]   = useState('0 9 * * 1-5');
  const [copied, setCopied] = useState(false);

  const result = parseCron(expr);

  function copy() { navigator.clipboard.writeText(expr); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  const FIELD_NAMES = ['Minute', 'Hour', 'Day', 'Month', 'Weekday'];
  const FIELD_RANGES = ['0-59', '0-23', '1-31', '1-12', '0-6 (Sun=0)'];

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/developer" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Developer</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Cron Parser</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Cron Expression Parser</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Parse and explain cron expressions with next run times.</p>
      </div>

      {/* Input */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid ' + (result.valid ? 'var(--color-border)' : 'var(--color-danger)'), overflow: 'hidden', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4) var(--space-5)' }}>
          <input type="text" value={expr} onChange={e => setExpr(e.target.value)}
            placeholder="* * * * *"
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: '22px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', background: 'transparent', fontWeight: '700', letterSpacing: '0.05em' }}
          />
          <button onClick={copy} style={{ background: copied ? 'var(--color-success)' : 'var(--color-surface-2)', color: copied ? '#fff' : 'var(--color-text-tertiary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-4)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>
            {copied ? '✓' : 'Copy'}
          </button>
        </div>
        {/* Field labels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-5) var(--space-4)', borderTop: '1px solid var(--color-border)' }}>
          {FIELD_NAMES.map((name, i) => (
            <div key={name} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{name}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>{FIELD_RANGES[i]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Error */}
      {!result.valid && result.error && (
        <div style={{ background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-3) var(--space-5)', fontSize: '14px', color: 'var(--color-danger)', marginBottom: 'var(--space-4)' }}>⚠ {result.error}</div>
      )}

      {result.valid && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Description */}
          <div style={{ background: 'var(--color-success-bg)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4) var(--space-5)', fontSize: '15px', color: 'var(--color-success)', fontWeight: '500' }}>
            ✓ {result.description}
          </div>

          {/* Fields */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>Fields</div>
            {result.fields.map((f, i) => (
              <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-3) var(--space-5)', borderBottom: i < result.fields.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-tertiary)', width: '64px', textTransform: 'capitalize' }}>{f.name}</span>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: '800', color: 'var(--color-brand-500)', minWidth: '48px' }}>{f.value}</code>
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{f.desc}</span>
              </div>
            ))}
          </div>

          {/* Next runs */}
          {result.nextRuns.length > 0 && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>Next runs</div>
              {result.nextRuns.map((run, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-5)', borderBottom: i < result.nextRuns.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', minWidth: '24px' }}>#{i+1}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--color-text-primary)' }}>{run}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Presets */}
      <div style={{ marginTop: 'var(--space-6)', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>Common expressions</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
          {PRESETS.map((p, i) => (
            <button key={p.expr} onClick={() => setExpr(p.expr)}
              style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)', cursor: 'pointer', background: expr === p.expr ? 'var(--color-brand-50)' : 'transparent', fontFamily: 'var(--font-sans)', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)', transition: 'background var(--duration-fast)' }}>
              <span style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>{p.label}</span>
              <code style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)', flexShrink: 0 }}>{p.expr}</code>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
