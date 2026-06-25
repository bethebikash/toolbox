import { useParams } from 'react-router';
import { CATEGORY_MAP } from '../registry/categories';
import { getToolsByCategory } from '../registry/registry';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const cat = CATEGORY_MAP.get(category as any);
  const tools = getToolsByCategory(category ?? '');

  if (!cat) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-16) 0' }}>
        <h1 style={{ color: 'var(--color-brand-900)' }}>Category not found</h1>
        <a href='/' style={{ color: 'var(--color-brand-500)' }}>
          ← Back to home
        </a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div
        style={{
          fontSize: '13px',
          color: 'var(--color-neutral-400)',
          marginBottom: 'var(--space-6)',
        }}>
        <a href='/' style={{ color: 'var(--color-neutral-400)', textDecoration: 'none' }}>
          Home
        </a>
        {' / '}
        <span style={{ color: 'var(--color-neutral-600)', fontWeight: '500' }}>{cat.label}</span>
      </div>

      {/* Header */}
      <div
        style={{
          padding: 'var(--space-8)',
          background: cat.color,
          borderRadius: 'var(--radius-xl)',
          marginBottom: 'var(--space-8)',
        }}>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: cat.textColor,
            margin: '0 0 var(--space-2)',
            letterSpacing: '-0.02em',
          }}>
          {cat.label}
        </h1>
        <p style={{ color: cat.textColor, opacity: 0.7, margin: 0, fontSize: '15px' }}>{cat.description}</p>
      </div>

      {/* Tools grid */}
      {tools.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--space-16)',
            color: 'var(--color-neutral-400)',
            background: 'var(--color-neutral-0)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-neutral-200)',
          }}>
          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-4)' }}>🚧</div>
          <div style={{ fontWeight: '600', marginBottom: 'var(--space-2)' }}>Coming soon</div>
          <div style={{ fontSize: '14px' }}>Tools for this category are being built.</div>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--space-4)',
          }}>
          {tools.map(tool => (
            <a
              key={tool.id}
              href={tool.slug}
              style={{
                display: 'block',
                padding: 'var(--space-6)',
                background: 'var(--color-neutral-0)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-neutral-200)',
                textDecoration: 'none',
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
              }}>
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: 'var(--color-brand-900)',
                  marginBottom: 'var(--space-2)',
                }}>
                {tool.name}
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--color-neutral-500)',
                  lineHeight: 1.5,
                  marginBottom: 'var(--space-4)',
                }}>
                {tool.description}
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-1)',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--color-brand-500)',
                }}>
                Open tool →
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
