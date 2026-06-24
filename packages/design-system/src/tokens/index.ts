export * from './color';
export * from './typography';
export * from './space';
export * from './radius';
export * from './shadow';
export * from './motion';
export * from './breakpoint';

// CSS custom properties string — injected at :root in the app
export function generateCSSVariables(): string {
  return `
    :root {
      /* Brand */
      --color-brand-50:  #EFF6FF;
      --color-brand-500: #2E7CF6;
      --color-brand-900: #1E3A5F;

      /* Neutral */
      --color-neutral-0:   #FFFFFF;
      --color-neutral-50:  #F8FAFC;
      --color-neutral-100: #F1F5F9;
      --color-neutral-200: #E2E8F0;
      --color-neutral-300: #CBD5E1;
      --color-neutral-400: #94A3B8;
      --color-neutral-500: #64748B;
      --color-neutral-700: #334155;
      --color-neutral-800: #1E293B;
      --color-neutral-950: #020617;

      /* Semantic */
      --color-success: #10B981;
      --color-warning: #D97706;
      --color-danger:  #EF4444;

      /* Space */
      --space-1:  4px;
      --space-2:  8px;
      --space-3:  12px;
      --space-4:  16px;
      --space-6:  24px;
      --space-8:  32px;
      --space-12: 48px;
      --space-16: 64px;

      /* Typography */
      --font-sans: Inter, system-ui, sans-serif;
      --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

      /* Radius */
      --radius-sm:   4px;
      --radius-md:   8px;
      --radius-lg:   12px;
      --radius-xl:   16px;
      --radius-full: 9999px;

      /* Shadow */
      --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

      /* Motion */
      --duration-fast:   100ms;
      --duration-normal: 200ms;
      --duration-slow:   300ms;
      --easing-out: cubic-bezier(0, 0, 0.2, 1);
      --easing-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --color-neutral-0:   #0F172A;
        --color-neutral-50:  #1E293B;
        --color-neutral-100: #334155;
        --color-neutral-200: #475569;
        --color-neutral-700: #CBD5E1;
        --color-neutral-800: #E2E8F0;
        --color-neutral-950: #F8FAFC;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      :root {
        --duration-fast:   0ms;
        --duration-normal: 0ms;
        --duration-slow:   0ms;
      }
    }
  `;
}
