/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      ignored: ['**/src-tauri/**']
    }
  },
  build: {
    minify: 'esbuild',
    target: 'es2022',
    cssMinify: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('@codemirror')) {
            return 'editor';
          }
          if (id.includes('katex')) {
            return 'katex';
          }
          if (id.includes('html-to-image')) {
            return 'html-to-image';
          }
        }
      }
    }
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
    legalComments: 'none'
  },
  test: {
    globals: true,
    environment: 'node'
  }
}));
