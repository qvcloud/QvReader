import { describe, it, expect } from 'vitest';
import { getInitialFile } from '../../src/lib/ipc';

describe('File Association & Drag Drop Support', () => {
  const supportedRegex = /\.(md|markdown|mdown|mkd|mkdn|mdx|txt)$/i;

  it('matches all standard markdown file extensions', () => {
    expect(supportedRegex.test('README.md')).toBe(true);
    expect(supportedRegex.test('document.markdown')).toBe(true);
    expect(supportedRegex.test('notes.mdown')).toBe(true);
    expect(supportedRegex.test('draft.mkd')).toBe(true);
    expect(supportedRegex.test('spec.mkdn')).toBe(true);
    expect(supportedRegex.test('page.mdx')).toBe(true);
    expect(supportedRegex.test('plain.txt')).toBe(true);
  });

  it('rejects unsupported extensions', () => {
    expect(supportedRegex.test('image.png')).toBe(false);
    expect(supportedRegex.test('script.js')).toBe(false);
    expect(supportedRegex.test('archive.zip')).toBe(false);
    expect(supportedRegex.test('binary.exe')).toBe(false);
  });

  it('provides safe fallback for getInitialFile in non-tauri test environment', async () => {
    const file = await getInitialFile();
    expect(file).toBeNull();
  });
});
