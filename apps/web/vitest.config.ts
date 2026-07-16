import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@toolbox/design-system': resolve(__dirname, '../../packages/design-system/src'),
      '@toolbox/shared':        resolve(__dirname, '../../packages/shared/src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals:     true,
    setupFiles:  ['./src/test/setup.ts'],
    include:     ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
