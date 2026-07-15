# Toolbox — AI Context

## Project
Browser-based file processing platform. 100 tools across 9 categories.
All processing runs client-side — files never leave the browser.

## Stack
- pnpm workspaces + Turborepo
- React 19, TypeScript 5 (strict + exactOptionalPropertyTypes)
- Vite 6, React Router v7, Zustand 5, Vitest
- FFmpeg.wasm (video/audio), pdf-lib, pdfjs-dist v6, qrcode, jsbarcode, marked

## Monorepo structure
apps/web/src/
├── app/          Shell.tsx, router.tsx
├── features/     image/ pdf/ developer/ text/ color/ utility/ video/ audio/ seo/
├── registry/     registry.ts (100 tools), categories.ts
├── store/        jobs.ts, settings.ts
├── hooks/        useToolJobs.ts
├── pages/        HomePage, CategoryPage, NotFoundPage
└── components/   ErrorBoundary.tsx
packages/
├── design-system/  CSS custom properties tokens
└── shared/         ToolManifest, Job types

## Adding a new tool — checklist
1. `mkdir -p apps/web/src/features/<category>/tools/<tool-id>/`
2. Create `engine.ts` (pure TS, no DOM), `engine.test.ts`, `<Name>Page.tsx`, `manifest.ts`
3. Add manifest import + entry to `registry.ts`
4. Add lazy import + route to `router.tsx`
5. Run `pnpm --filter @toolbox/web test && pnpm --filter @toolbox/web typecheck`

## exactOptionalPropertyTypes — rules
- Never assign `T | undefined` to optional `T?`
- Use `delete obj.key` instead of `obj.key = undefined`
- Use `T | undefined` in interface for props that accept undefined: `toolName?: string | undefined`

## CSS design tokens (semantic vars)
--color-bg, --color-surface, --color-surface-2
--color-border, --color-border-2
--color-text-primary/secondary/tertiary
--color-brand-500, --color-brand-50
--color-success/warning/danger + -bg variants
--space-1 through --space-20 (4px grid)
--radius-sm/md/lg/xl/2xl/full
--shadow-sm/md/lg/xl
--duration-fast/normal/slow
--font-sans, --font-mono

Dark mode: `[data-theme="dark"]` on `<html>` — always use semantic vars.

## pdfjs-dist v6 — RenderParameters requires `canvas` field
```ts
await page.render({ canvasContext: ctx, viewport, canvas }).promise;
```

## FFmpeg singleton
Shared via `getFFmpeg()` in `features/video/tools/compressor/engine.ts`.
COOP/COEP headers set in `vite.config.ts` for SharedArrayBuffer.

## Test counts (as of last commit)
- 422 tests passing, 79 test files, zero type errors
- Run: `pnpm --filter @toolbox/web test`
- Typecheck: `pnpm --filter @toolbox/web typecheck`
- Build: `pnpm --filter @toolbox/web build`

## Categories
image(10) pdf(4) developer(20) text(14) color(7) utility(22) video(2) audio(1) seo(5)
