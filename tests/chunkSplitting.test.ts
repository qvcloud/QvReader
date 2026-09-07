import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Code Splitting & Bundle Boundaries', () => {
  it('App.tsx should not statically import heavy CodeMirror or editor components', () => {
    const appTsxPath = path.resolve(__dirname, '../src/App.tsx');
    const content = fs.readFileSync(appTsxPath, 'utf-8');

    // CodeMirror direct imports must NOT be at top level in App.tsx
    expect(content).not.toMatch(/^import\s+.*@codemirror/m);

    // InlineEditor and SplitContainer must be lazy-loaded
    expect(content).not.toMatch(/^import\s*\{\s*InlineEditor\s*\}\s*from/m);
    expect(content).not.toMatch(/^import\s*\{\s*SplitContainer\s*\}\s*from/m);
    expect(content).toMatch(/React\.lazy\(/);
  });

  it('App.tsx should lazy-load non-essential modal dialogs', () => {
    const appTsxPath = path.resolve(__dirname, '../src/App.tsx');
    const content = fs.readFileSync(appTsxPath, 'utf-8');

    expect(content).not.toMatch(/^import\s*\{\s*SettingsModal\s*\}\s*from/m);
    expect(content).not.toMatch(/^import\s*\{\s*LicenseModal\s*\}\s*from/m);
    expect(content).not.toMatch(/^import\s*\{\s*ShortcutsModal\s*\}\s*from/m);
    expect(content).not.toMatch(/^import\s*\{\s*ProUpsellModal\s*\}\s*from/m);
    expect(content).not.toMatch(/^import\s*\{\s*SafeExitDialog\s*\}\s*from/m);
  });
});
