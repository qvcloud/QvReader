import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getInitialLaunchData } from '../src/lib/ipc';
import { InitialLaunchData } from '../src/types/startup';

describe('Unified Startup Launch IPC', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns valid fallback InitialLaunchData in non-Tauri environment', async () => {
    const data = await getInitialLaunchData();
    expect(data).toBeDefined();
    expect(data.launchMode).toBe('empty');
    expect(data.targetPath).toBeNull();
    expect(data.document).toBeNull();
    expect(data.preferences).toBeDefined();
    expect(data.preferences.fontSize).toBe(15);
    expect(data.isProLicensed).toBe(false);
  });

  it('correctly handles file launch mode structure', () => {
    const mockFileLaunch: InitialLaunchData = {
      launchMode: 'file',
      targetPath: '/path/to/doc.md',
      document: {
        filePath: '/path/to/doc.md',
        fileName: 'doc.md',
        rawContent: '# Hello World',
        diskContent: '# Hello World',
        isDirty: false,
        lineEnding: 'LF',
        encoding: 'UTF-8',
        isReadOnly: false,
        diskHash: 'hash-abc-123'
      },
      preferences: {
        theme: 'dark',
        fontSize: 16,
        fontFamily: 'sans-serif',
        isOutlinePinned: false,
        recentFiles: ['/path/to/doc.md']
      },
      isProLicensed: true
    };

    expect(mockFileLaunch.launchMode).toBe('file');
    expect(mockFileLaunch.document?.fileName).toBe('doc.md');
    expect(mockFileLaunch.document?.rawContent).toBe('# Hello World');
    expect(mockFileLaunch.isProLicensed).toBe(true);
  });
});
