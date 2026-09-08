import { describe, it, expect } from 'vitest';
import { formatWindowTitle, APP_DISPLAY_NAME, APP_BASE_NAME, CLIENT_VERSION } from '../../src/config/version';

// Derive expected display values from the single source of truth
// (src/config/version.ts) instead of hardcoding a literal version, so a
// version bump never silently breaks these assertions again.
const SEMVER_RE = /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/;

describe('formatWindowTitle', () => {
  it('has a valid CLIENT_VERSION and consistent APP_DISPLAY_NAME', () => {
    expect(CLIENT_VERSION).toMatch(SEMVER_RE);
    expect(APP_BASE_NAME).toBe('QvReader');
    // Display name must carry the client version, regardless of edition suffix.
    expect(APP_DISPLAY_NAME).toContain(`v${CLIENT_VERSION}`);
    expect(APP_DISPLAY_NAME.startsWith(APP_BASE_NAME)).toBe(true);
  });

  it('formats untitled document title correctly', () => {
    const title = formatWindowTitle({
      fileName: 'Untitled.md',
      isDirty: false
    });
    expect(title).toBe(`Untitled.md - ${APP_DISPLAY_NAME}`);
  });

  it('formats null fileName as Untitled.md', () => {
    const title = formatWindowTitle({
      fileName: null,
      isDirty: false
    });
    expect(title).toBe(`Untitled.md - ${APP_DISPLAY_NAME}`);
  });

  it('formats named clean document correctly', () => {
    const title = formatWindowTitle({
      fileName: 'README.md',
      isDirty: false
    });
    expect(title).toBe(`README.md - ${APP_DISPLAY_NAME}`);
  });

  it('formats dirty document with bullet prefix', () => {
    const title = formatWindowTitle({
      fileName: 'README.md',
      isDirty: true
    });
    expect(title).toBe(`• README.md - ${APP_DISPLAY_NAME}`);
  });

  it('formats workspace active document with project name', () => {
    const title = formatWindowTitle({
      projectName: 'markdown-viewer',
      fileName: 'guide.md',
      hasFilePath: true,
      isDirty: false
    });
    expect(title).toBe(`guide.md — markdown-viewer - ${APP_DISPLAY_NAME}`);
  });

  it('formats workspace dirty document with bullet prefix and project name', () => {
    const title = formatWindowTitle({
      projectName: 'markdown-viewer',
      fileName: 'guide.md',
      hasFilePath: true,
      isDirty: true
    });
    expect(title).toBe(`• guide.md — markdown-viewer - ${APP_DISPLAY_NAME}`);
  });

  it('formats workspace with no active document to project name only', () => {
    const title = formatWindowTitle({
      projectName: 'markdown-viewer',
      fileName: null,
      hasFilePath: false,
      isDirty: false
    });
    expect(title).toBe(`markdown-viewer - ${APP_DISPLAY_NAME}`);
  });
});
