import { describe, it, expect } from 'vitest';
import { formatWindowTitle, APP_DISPLAY_NAME, CLIENT_VERSION } from '../../src/config/version';

describe('formatWindowTitle', () => {
  it('has valid CLIENT_VERSION and APP_DISPLAY_NAME', () => {
    expect(CLIENT_VERSION).toBe('0.1.5');
    expect(APP_DISPLAY_NAME).toBe('QvReader v0.1.5');
  });

  it('formats untitled document title correctly', () => {
    const title = formatWindowTitle({
      fileName: 'Untitled.md',
      isDirty: false
    });
    expect(title).toBe('Untitled.md - QvReader v0.1.5');
  });

  it('formats null fileName as Untitled.md', () => {
    const title = formatWindowTitle({
      fileName: null,
      isDirty: false
    });
    expect(title).toBe('Untitled.md - QvReader v0.1.5');
  });

  it('formats named clean document correctly', () => {
    const title = formatWindowTitle({
      fileName: 'README.md',
      isDirty: false
    });
    expect(title).toBe('README.md - QvReader v0.1.5');
  });

  it('formats dirty document with bullet prefix', () => {
    const title = formatWindowTitle({
      fileName: 'README.md',
      isDirty: true
    });
    expect(title).toBe('• README.md - QvReader v0.1.5');
  });

  it('formats workspace active document with project name', () => {
    const title = formatWindowTitle({
      projectName: 'markdown-viewer',
      fileName: 'guide.md',
      hasFilePath: true,
      isDirty: false
    });
    expect(title).toBe('guide.md — markdown-viewer - QvReader v0.1.5');
  });

  it('formats workspace dirty document with bullet prefix and project name', () => {
    const title = formatWindowTitle({
      projectName: 'markdown-viewer',
      fileName: 'guide.md',
      hasFilePath: true,
      isDirty: true
    });
    expect(title).toBe('• guide.md — markdown-viewer - QvReader v0.1.5');
  });

  it('formats workspace with no active document to project name only', () => {
    const title = formatWindowTitle({
      projectName: 'markdown-viewer',
      fileName: null,
      hasFilePath: false,
      isDirty: false
    });
    expect(title).toBe('markdown-viewer - QvReader v0.1.5');
  });
});
