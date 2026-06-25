import { useState } from 'react';
import { CATEGORIES } from '../registry/categories';
import { getToolsByCategory, searchTools } from '../registry/registry';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const results = query.trim() ? searchTools(query) : [];

  return (
    <div>
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: 'var(--space-16) 0 var(--space-12)' }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '700',
          color: 'var(--color-brand-900)',
          margin: '0 0 var(--space-4)',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
        }}>
          Every tool you need.<br />Nothing leaves your browser.
        </h1>
        <p style={{
          fontSize: '18px',
          color: 'var(--color-neutral-500)',
          maxWidth: '560px',
          margin: '0 auto var(--space-8)',
          lineHeight: 1.6,
        }}>
          Process images, PDFs, video, audio and more — entirely on your device.
          No uploads. No accounts. No limits.
        </p>

        {/* Search */}
        <div style={{
          display: 'inline-flex',
          background: 'var(--color-neutral-100)',
          borderRadius: 'var(--radius-full)',
          padding: 'var(--space-2)',
          gap: 'var(--space-1)',
        }}>
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tools..."
            style={{
              border: 'none',
              background: 'transparent',
              padding: 'var(--space-2) var(--space-4)',
              fontSize: '15px',
              outline: 'none',
              width: '280px',
              color: 'var(--color-neutral-800)',
              fontFamily: 'var(--font-sans)',
            }}
          />
        </div>
      </div>

      {/* Search results */}
      {results.length > 0 && (
        <div style={{ marginBottom: 'var(--space-12)' }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: 'var(--color-neutral-500)',
            marginBottom: 'var(--space-4)',
          }}>
            {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 'var(--space-3)',
          }}>
            {results.map(tool => (
              <a
                key={tool.id}
                href={tool.slug}
                style={{
                  display: 'block',
                  padding: 'var(--space-4)',
                  background: 'var(--color-neutral-0)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-neutral-200)',
                  textDecoration: 'none',
                }}
              >
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--color-brand-900)',
                  marginBottom: 'var(--space-1)',
                }}>
                  {tool.name}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-neutral-500)' }}>
                  {tool.description}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Category grid — only shown when not searching */}
      {!query.trim() && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 'var(--space-4)',
        }}>
          {CATEGORIES.map(cat => {
            const count = getToolsByCategory(cat.id).length;
            return (
              <a
                key={cat.id}
                href={'/tools/' + cat.id}
                style={{
                  display: 'block',
                  padding: 'var(--space-6)',
                  background: cat.color,
                  borderRadius: 'var(--radius-xl)',
                  textDecoration: 'none',
                  border: '1px solid transparent',
                  transition: 'box-shadow var(--duration-normal) var(--easing-out), transform var(--duration-normal) var(--easing-out)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.boxShadow = 'var(--shadow-md)';
                  el.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.boxShadow = 'none';
                  el.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: cat.textColor,
                  marginBottom: 'var(--space-1)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {cat.label}
                </div>
                <div style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: cat.textColor,
                  lineHeight: 1,
                }}>
                  {count || '—'}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: cat.textColor,
                  opacity: 0.7,
                  marginTop: 'var(--space-1)',
                }}>
                  {count === 1 ? 'tool' : 'tools'}
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
