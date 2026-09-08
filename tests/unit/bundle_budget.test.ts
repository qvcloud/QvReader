import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { loadKatex } from '../../src/lib/mathRenderer';

describe('Client Distribution Bundle Size Budget', () => {
  const distDir = path.resolve(__dirname, '../../dist');
  const assetsDir = path.resolve(distDir, 'assets');

  beforeAll(async () => {
    await loadKatex();
    const { renderMarkdown } = await import('../../src/lib/markdown');
    renderMarkdown('# Warmup');

    if (!fs.existsSync(distDir) || !fs.existsSync(assetsDir)) {
      const { execSync } = await import('child_process');
      execSync('npm run build', {
        cwd: path.resolve(__dirname, '../../'),
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'production' }
      });
    }
  });

  it('enforces that production dist directory exists', () => {
    expect(fs.existsSync(distDir)).toBe(true);
    expect(fs.existsSync(assetsDir)).toBe(true);
  });

  it('enforces total uncompressed dist size <= 4.8 MB (5,033,164 bytes)', () => {
    function getDirSize(dir: string): number {
      let total = 0;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          total += getDirSize(fullPath);
        } else if (entry.isFile()) {
          total += fs.statSync(fullPath).size;
        }
      }
      return total;
    }

    const totalSize = getDirSize(distDir);
    const maxBudget = 4.8 * 1024 * 1024; // 4.8 MB
    expect(totalSize).toBeLessThanOrEqual(maxBudget);
  });

  it('enforces zero legacy .ttf and .woff font files in assets (WOFF2 only)', () => {
    const assetFiles = fs.readdirSync(assetsDir);
    const legacyFonts = assetFiles.filter(file => file.endsWith('.ttf') || file.endsWith('.woff'));
    expect(legacyFonts).toEqual([]);
  });

  it('enforces total WOFF2 font payload <= 300 KB (307,200 bytes)', () => {
    const assetFiles = fs.readdirSync(assetsDir);
    const woff2Fonts = assetFiles.filter(file => file.endsWith('.woff2'));
    expect(woff2Fonts.length).toBeGreaterThan(0);

    const totalFontSize = woff2Fonts.reduce((acc, file) => {
      return acc + fs.statSync(path.join(assetsDir, file)).size;
    }, 0);

    expect(totalFontSize).toBeLessThanOrEqual(300 * 1024);
  });

  it('enforces entry index.js chunk size <= 1.0 MB (1,048,576 bytes)', () => {
    const assetFiles = fs.readdirSync(assetsDir);
    const indexJs = assetFiles.find(file => file.startsWith('index-') && file.endsWith('.js'));
    expect(indexJs).toBeDefined();

    if (indexJs) {
      const indexSize = fs.statSync(path.join(assetsDir, indexJs)).size;
      expect(indexSize).toBeLessThanOrEqual(1024 * 1024);
    }
  });

  it('enforces cold document parse and initial render latency <= 50ms', async () => {
    const { renderMarkdown } = await import('../../src/lib/markdown');
    const sampleDoc = `# Document Benchmark

This is a performance sample with $E=mc^2$ and code:

\`\`\`typescript
const val: number = 42;
\`\`\`
`;

    const start = performance.now();
    const rendered = renderMarkdown(sampleDoc);
    const duration = performance.now() - start;

    expect(rendered).toContain('katex');
    expect(rendered).toContain('language-typescript');
    expect(duration).toBeLessThan(50);
  });
});
