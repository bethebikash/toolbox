import { useParams } from 'react-router';
import { getToolsByCategory } from '../registry/registry';
import { CATEGORY_MAP } from '../registry/categories';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const cat   = CATEGORY_MAP.get(category as any);
  const tools = getToolsByCategory(category ?? '');

  if (!cat) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-16) 0' }}>
        <h1 style={{ color: 'var(--color-text-primary)' }}>Category not found</h1>
        <a href="/" style={{ color: 'var(--color-brand-500)' }}>← Back to home</a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

      {/* Breadcrumb */}
      <div style={{
        fontSize: '13px',
        color: 'var(--color-text-tertiary)',
        marginBottom: 'var(--space-6)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)', fontWeight: '500' }}>{cat.label}</span>
      </div>

      {/* Header — uses semantic tokens only */}
      <div style={{
        padding: 'var(--space-8)',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-border)',
        marginBottom: 'var(--space-8)',
        borderLeft: '4px solid var(--color-brand-500)',
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: 'var(--color-text-primary)',
          margin: '0 0 var(--space-2)',
          letterSpacing: '-0.02em',
        }}>
          {cat.label}
        </h1>
        <p style={{
          color: 'var(--color-text-secondary)',
          margin: 0,
          fontSize: '15px',
          lineHeight: 1.6,
        }}>
          {cat.description}
        </p>
      </div>

      {/* Tools grid */}
      {tools.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-16)',
          color: 'var(--color-text-tertiary)',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-4)' }}>🚧</div>
          <div style={{ fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
            Coming soon
          </div>
          <div style={{ fontSize: '14px' }}>Tools for this category are being built.</div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--space-4)',
        }}>
          {tools.map(tool => (
            <a
              key={tool.id}
              href={tool.slug}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: 'var(--space-6)',
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-border)',
                textDecoration: 'none',
                transition: 'box-shadow var(--duration-normal) var(--easing-out), border-color var(--duration-normal), transform var(--duration-normal) var(--easing-out)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.boxShadow    = 'var(--shadow-lg)';
                el.style.borderColor  = 'var(--color-brand-500)';
                el.style.transform    = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.boxShadow    = 'none';
                el.style.borderColor  = 'var(--color-border)';
                el.style.transform    = 'translateY(0)';
              }}
            >
              {/* Tool name */}
              <div style={{
                fontSize: '15px',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-2)',
              }}>
                {tool.name}
              </div>

              {/* Description */}
              <div style={{
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                flex: 1,
                marginBottom: 'var(--space-4)',
              }}>
                {tool.description}
              </div>

              {/* Footer row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: 'var(--color-text-tertiary)',
                  background: 'var(--color-surface-2)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                }}>
                  {tool.requiresServer ? '☁ Online' : '⚡ Local'}
                </span>
                <span style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--color-brand-500)',
                }}>
                  Open →
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
