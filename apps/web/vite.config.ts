import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@toolbox/design-system': resolve(__dirname, '../../packages/design-system/src'),
      '@toolbox/shared':        resolve(__dirname, '../../packages/shared/src'),
    },
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals:     true,
    setupFiles:  ['./src/test/setup.ts'],
    include:     ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
