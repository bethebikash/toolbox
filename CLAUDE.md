# TOOLBOX — Architecture Rules for AI Assistants

## Project Overview
Browser-based file processing platform. 100+ tools across image, PDF, video, audio,
developer, text, SEO, color, AI, and utility categories.

## Monorepo Structure
toolbox/

├── apps/web/                    # Vite + React 19 + TypeScript

├── packages/design-system/      # Tokens + component library

├── packages/shared/             # Types + constants (no UI, no engines)

├── packages/engines/            # WASM processing engines (no React)

├── packages/workers/            # Web Worker entry points

└── tooling/                     # Shared tsconfig, eslint-config

## Stack
- React 19, TypeScript 5 (strict + exactOptionalPropertyTypes)
- Vite 6, pnpm workspaces, Turborepo
- Zustand (state), React Router v7 (routing)
- pdf-lib, browser-image-compression (processing engines)
- CSS custom properties via design token system (no Tailwind)

## Critical Rules — Never Violate These

### 1. Files never leave the browser
All processing runs client-side. Never send user files to a server.
Only AI tools (category: 'ai') may call external APIs, and only for text/metadata — never raw file bytes.

### 2. Engines have zero UI imports
packages/engines/ must never import from React, design-system, or apps/web.
Engines are pure TypeScript — testable in Node.js without a browser.

### 3. All UI components use design tokens
Never use hardcoded hex colors, pixel values, or font names in component styles.
Always use CSS custom properties: var(--color-brand-500), var(--space-4), etc.
Never use Tailwind classes.

### 4. No cross-feature imports
features/image/ must never import from features/pdf/.
Shared logic goes in packages/shared/ or apps/web/src/lib/.

### 5. Every tool needs a manifest
Adding a tool = manifest.ts + engine.ts + Page.tsx + route entry.
The registry in apps/web/src/registry/registry.ts is the single source of truth.

### 6. State architecture
- Job queue state → useJobsStore (Zustand)
- Tool-local state → useState inside the Page component
- Server data → TanStack Query (not yet installed)
- URL state → useSearchParams for filters/search

### 7. TypeScript strictness
- exactOptionalPropertyTypes: true — never assign `T | undefined` to optional `T`
- noUncheckedIndexedAccess: true — always null-check array/object access with !
- No `any` — use `unknown` and narrow properly

## Adding a New Tool — Checklist
1. Create `apps/web/src/features/<category>/tools/<name>/engine.ts` (pure TS, no React)
2. Create `apps/web/src/features/<category>/tools/<name>/<Name>Page.tsx`
3. Create `apps/web/src/features/<category>/tools/<name>/manifest.ts`
4. Register manifest in `apps/web/src/registry/registry.ts`
5. Add lazy route in `apps/web/src/app/router.tsx`
6. Use `useToolJobs(TOOL_ID)` hook for job state — never local useState for jobs

## File Naming
- Components:  PascalCase.tsx      (ImageCompressorPage.tsx)
- Hooks:       camelCase.ts        (useToolJobs.ts)
- Engines:     engine.ts           (always named engine.ts inside tool folder)
- Workers:     camelCase.worker.ts (image.worker.ts)
- Types:       PascalCase          (ToolManifest, JobStatus)
- Constants:   SCREAMING_SNAKE     (MAX_FILE_SIZE_MB)

## CSS Token Reference
Colors:    --color-brand-500, --color-text-primary, --color-text-secondary,
           --color-text-tertiary, --color-surface, --color-surface-2,
           --color-bg, --color-border, --color-border-2,
           --color-success, --color-success-bg, --color-danger, --color-danger-bg
Space:     --space-1 (4px) through --space-20 (80px)
Radius:    --radius-sm, --radius-md, --radius-lg, --radius-xl, --radius-2xl, --radius-full
Shadow:    --shadow-sm, --shadow-md, --shadow-lg, --shadow-xl
Motion:    --duration-fast, --duration-normal, --duration-slow, --easing-out, --easing-spring
Font:      --font-sans, --font-mono

## Common Patterns

### Tool page skeleton
```tsx
import { useToolJobs } from '../../../../hooks/useToolJobs';

const TOOL_ID = 'my-tool-id';

export default function MyToolPage() {
  const { jobs, pendingJobs, doneJobs, isProcessing,
          enqueue, setProgress, setDone, setError,
          remove, clearTool } = useToolJobs(TOOL_ID);
  // ...
}
```

### Engine function signature
```ts
export async function processFile(
  file: File,
  opts: MyOptions,
  onProgress?: (pct: number) => void,
): Promise<MyResult> { ... }
```

### Manifest
```ts
export const myToolManifest: ToolManifest = {
  id:             'my-tool',
  slug:           '/tools/<category>/my-tool',
  category:       '<category>',
  name:           'My Tool',
  description:    'One sentence description.',
  icon:           'lucide-icon-name',
  keywords:       ['keyword1', 'keyword2'],
  accepts:        ['image/jpeg'],
  maxFileSizeMB:  50,
  maxFiles:       20,
  requiresServer: false,
  engine:         () => import('./engine'),
  meta: {
    title:       'SEO title',
    description: 'SEO description',
  },
};
```
