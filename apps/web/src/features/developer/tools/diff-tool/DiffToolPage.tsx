import { useState, useMemo } from 'react';
import { diffText } from './engine';

const SAMPLE_A = `function greet(name) {
  console.log("Hello, " + name);
  return name;
}

const result = greet("World");
console.log(result);`;

const SAMPLE_B = `function greet(name, greeting = "Hello") {
  console.log(\`\${greeting}, \${name}!\`);
  return \`\${greeting}, \${name}!\`;
}

const result = greet("Toolbox", "Hi");
console.log(result);
console.log("Done");`;

export default function DiffToolPage() {
  const [textA, setTextA] = useState(SAMPLE_A);
  const [textB, setTextB] = useState(SAMPLE_B);

  const result = useMemo(() => diffText(textA, textB), [textA, textB]);

  const lineStyle = (type: 'equal' | 'added' | 'removed') => ({
    display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start',
    padding: '2px var(--space-4)',
    background: type === 'added' ? 'rgba(16,185,129,0.1)' : type === 'removed' ? 'rgba(239,68,68,0.1)' : 'transparent',
    borderLeft: '3px solid ' + (type === 'added' ? 'var(--color-success)' : type === 'removed' ? 'var(--color-danger)' : 'transparent'),
  });

  const taStyle = { width: '100%', minHeight: '240px', padding: 'var(--space-4)', border: 'none', outline: 'none', resize: 'vertical' as const, fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.6, color: 'var(--color-text-primary)', background: 'transparent' };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/developer" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Developer</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Text Diff</span>
      </div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Text Diff Tool</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Compare two texts and see the differences highlighted line by line.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
        {[
          { label: 'Lines added',   value: result.added,   color: 'var(--color-success)' },
          { label: 'Lines removed', value: result.removed, color: 'var(--color-danger)' },
          { label: 'Lines changed', value: result.changed, color: 'var(--color-warning)' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-3) var(--space-5)', display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: '22px', fontWeight: '800', color: s.color }}>{s.value}</span>
            <span style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Input panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
        {[
          { label: 'Original (A)', value: textA, onChange: setTextA, id: 'a' },
          { label: 'Modified (B)', value: textB, onChange: setTextB, id: 'b' },
        ].map(panel => (
          <div key={panel.id} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
              {panel.label}
              <button onClick={() => panel.onChange('')} style={{ background: 'none', border: 'none', fontSize: '12px', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Clear</button>
            </div>
            <textarea value={panel.value} onChange={e => panel.onChange(e.target.value)} spellCheck={false} style={taStyle} />
          </div>
        ))}
      </div>

      {/* Diff output */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', display: 'flex', gap: 'var(--space-4)' }}>
          <span>Diff output</span>
          <span style={{ color: 'var(--color-success)' }}>+ Added</span>
          <span style={{ color: 'var(--color-danger)' }}>− Removed</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.6, overflowX: 'auto' }}>
          {result.lines.map((line, i) => (
            <div key={i} style={lineStyle(line.type)}>
              <span style={{ color: 'var(--color-text-tertiary)', minWidth: '40px', textAlign: 'right', flexShrink: 0, fontSize: '11px', paddingTop: '1px', userSelect: 'none' }}>
                {line.type === 'removed' ? line.lineA : line.type === 'added' ? line.lineB : line.lineA}
              </span>
              <span style={{ color: line.type === 'added' ? 'var(--color-success)' : line.type === 'removed' ? 'var(--color-danger)' : 'var(--color-text-primary)', flexShrink: 0, fontSize: '14px', userSelect: 'none' }}>
                {line.type === 'added' ? '+' : line.type === 'removed' ? '−' : ' '}
              </span>
              <span style={{ color: line.type === 'added' ? 'var(--color-success)' : line.type === 'removed' ? 'var(--color-danger)' : 'var(--color-text-primary)', whiteSpace: 'pre', flex: 1 }}>
                {line.content || ' '}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
