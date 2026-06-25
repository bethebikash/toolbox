import { useState } from 'react';
import { CATEGORIES } from '../registry/categories';
import { getToolsByCategory, searchTools } from '../registry/registry';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const results = query.trim() ? searchTools(query) : [];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: 'var(--space-16) 0 var(--space-12)' }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '800',
          color: 'var(--color-text-primary)',
          margin: '0 0 var(--space-4)',
          letterSpacing: '-0.04em',
          lineHeight: 1.1,
        }}>
          Every tool you need.<br />
          <span style={{ color: 'var(--color-brand-500)' }}>Nothing leaves your browser.</span>
        </h1>
        <p style={{
          fontSize: '17px',
          color: 'var(--color-text-secondary)',
          maxWidth: '520px',
          margin: '0 auto var(--space-8)',
          lineHeight: 1.7,
        }}>
          Process images, PDFs, video, audio and more — entirely on your device.
          No uploads. No accounts. No limits.
        </p>

        {/* Search */}
        <div style={{
          display: 'inline-flex',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border-2)',
          borderRadius: 'var(--radius-full)',
          padding: '4px',
          gap: 'var(--space-1)',
          boxShadow: 'var(--shadow-md)',
        }}>
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search 100+ tools..."
            style={{
              border: 'none',
              background: 'transparent',
              padding: 'var(--space-2) var(--space-4)',
              fontSize: '15px',
              outline: 'none',
              width: '260px',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-sans)',
            }}
          />
          <button style={{
            background: 'var(--color-brand-500)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            padding: 'var(--space-2) var(--space-6)',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
          }}>
            Search
          </button>
        </div>
      </div>

      {/* Search results */}
      {results.length > 0 && (
        <div style={{ marginBottom: 'var(--space-12)' }}>
          <div style={{
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--color-text-tertiary)',
            marginBottom: 'var(--space-4)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
          </div>
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
                  padding: 'var(--space-4) var(--space-5)',
                  background: 'var(--color-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  textDecoration: 'none',
                  transition: 'border-color var(--duration-fast), box-shadow var(--duration-fast)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = 'var(--color-brand-500)';
                  el.style.boxShadow   = 'var(--shadow-md)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = 'var(--color-border)';
                  el.style.boxShadow   = 'none';
                }}
              >
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-1)',
                }}>
                  {tool.name}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', lineHeight: 1.5 }}>
                  {tool.description}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Category grid */}
      {!query.trim() && (
        <>
          <div style={{
            fontSize: '13px',
            fontWeight: '700',
            color: 'var(--color-text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 'var(--space-4)',
          }}>
            Browse by category
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 'var(--space-3)',
          }}>
            {CATEGORIES.map(cat => {
              const count = getToolsByCategory(cat.id).length;
              return (
                <a
                  key={cat.id}
                  href={'/tools/' + cat.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 'var(--space-5)',
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-xl)',
                    textDecoration: 'none',
                    border: '1px solid var(--color-border)',
                    transition: 'box-shadow var(--duration-normal), border-color var(--duration-normal), transform var(--duration-normal)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.boxShadow   = 'var(--shadow-md)';
                    el.style.borderColor = 'var(--color-brand-500)';
                    el.style.transform   = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.boxShadow   = 'none';
                    el.style.borderColor = 'var(--color-border)';
                    el.style.transform   = 'translateY(0)';
                  }}
                >
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-3)',
                  }}>
                    {cat.label}
                  </div>
                  <div style={{
                    marginTop: 'auto',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 'var(--space-1)',
                  }}>
                    <span style={{
                      fontSize: '28px',
                      fontWeight: '800',
                      color: 'var(--color-brand-500)',
                      lineHeight: 1,
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {count || '—'}
                    </span>
                    {count > 0 && (
                      <span style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
                        tool{count !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
