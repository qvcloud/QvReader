/// <reference types="vitest" />
import { execFileSync } from 'node:child_process';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Resolve the client version from git (single source of truth).
 * HEAD on a clean vX.Y.Z tag -> pure version; otherwise git-describe dev form.
 * Reuse scripts/derive-version.mjs so build, tests and release stay consistent.
 */
function resolveClientVersion(): string {
  try {
    return execFileSync(
      process.execPath,
      [new URL('./scripts/derive-version.mjs', import.meta.url).pathname],
      { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }
    ).trim();
  } catch {
    return '0.0.0-dev';
  }
}

const clientVersion = resolveClientVersion();

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  define: {
    __CLIENT_VERSION__: JSON.stringify(clientVersion)
  },
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
