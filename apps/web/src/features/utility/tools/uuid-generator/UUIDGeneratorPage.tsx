import { useState } from 'react';
import { generateUUID, generateBatch } from './engine';

export default function UUIDGeneratorPage() {
  const [uuids, setUuids] = useState<string[]>([generateUUID()]);
  const [count, setCount] = useState(1);
  const [copied, setCopied] = useState<string | null>(null);

  function generate() {
    setUuids(generateBatch(count));
  }

  function copyOne(uuid: string) {
    navigator.clipboard.writeText(uuid);
    setCopied(uuid);
    setTimeout(() => setCopied(null), 1500);
  }

  function copyAll() {
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopied('all');
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: 'var(--color-brand-900)',
            margin: '0 0 var(--space-2)',
            letterSpacing: '-0.02em',
          }}>
          UUID Generator
        </h1>
        <p style={{ color: 'var(--color-neutral-500)', margin: 0, fontSize: '15px' }}>
          Generate random UUID v4 strings instantly. Runs entirely in your browser.
        </p>
      </div>

      {/* Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
          padding: 'var(--space-6)',
          background: 'var(--color-neutral-0)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-neutral-200)',
        }}>
        <div style={{ flex: 1 }}>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--color-neutral-600)',
              marginBottom: 'var(--space-2)',
            }}>
            How many?
          </label>
          <input
            type='number'
            min={1}
            max={100}
            value={count}
            onChange={e => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
            style={{
              width: '100px',
              padding: 'var(--space-2) var(--space-3)',
              border: '1px solid var(--color-neutral-300)',
              borderRadius: 'var(--radius-md)',
              fontSize: '15px',
              fontFamily: 'var(--font-sans)',
              color: 'var(--color-neutral-800)',
              outline: 'none',
            }}
          />
        </div>
        <button
          onClick={generate}
          style={{
            padding: 'var(--space-3) var(--space-8)',
            background: 'var(--color-brand-500)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            marginTop: 'var(--space-6)',
          }}>
          Generate
        </button>
      </div>

      {/* Results */}
      <div
        style={{
          background: 'var(--color-neutral-0)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-neutral-200)',
          overflow: 'hidden',
        }}>
        {/* Results header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-4) var(--space-6)',
            borderBottom: '1px solid var(--color-neutral-100)',
          }}>
          <span
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--color-neutral-500)',
            }}>
            {uuids.length} UUID{uuids.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={copyAll}
            style={{
              padding: 'var(--space-1) var(--space-3)',
              background: copied === 'all' ? 'var(--color-success)' : 'var(--color-neutral-100)',
              color: copied === 'all' ? '#fff' : 'var(--color-neutral-600)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              transition: 'background var(--duration-fast)',
            }}>
            {copied === 'all' ? 'Copied!' : 'Copy all'}
          </button>
        </div>

        {/* UUID list */}
        {uuids.map((uuid, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-3) var(--space-6)',
              borderBottom: i < uuids.length - 1 ? '1px solid var(--color-neutral-100)' : 'none',
              background: i % 2 === 0 ? 'transparent' : 'var(--color-neutral-50)',
            }}>
            <code
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                color: 'var(--color-neutral-700)',
                letterSpacing: '0.02em',
              }}>
              {uuid}
            </code>
            <button
              onClick={() => copyOne(uuid)}
              style={{
                padding: 'var(--space-1) var(--space-3)',
                background: copied === uuid ? 'var(--color-success)' : 'var(--color-neutral-100)',
                color: copied === uuid ? '#fff' : 'var(--color-neutral-500)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                flexShrink: 0,
                marginLeft: 'var(--space-4)',
                transition: 'background var(--duration-fast)',
              }}>
              {copied === uuid ? '✓' : 'Copy'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
