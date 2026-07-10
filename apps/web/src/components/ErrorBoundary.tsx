import { Component } from 'react';
import type { ReactNode } from 'react';

interface Props  { children: ReactNode; toolName?: string | undefined; }
interface State  { hasError: boolean; error: string; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ maxWidth: '560px', margin: '0 auto', padding: 'var(--space-12)', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: 'var(--space-4)' }}>⚠️</div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
            {this.props.toolName ? `${this.props.toolName} encountered an error` : 'Something went wrong'}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', lineHeight: 1.6 }}>
            {this.state.error || 'An unexpected error occurred. Try refreshing the page.'}
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
            <button onClick={() => this.setState({ hasError: false, error: '' })}
              style={{ padding: 'var(--space-3) var(--space-6)', background: 'var(--color-brand-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
              Try again
            </button>
            <button onClick={() => window.location.href = '/'}
              style={{ padding: 'var(--space-3) var(--space-6)', background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-lg)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
              Go home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
