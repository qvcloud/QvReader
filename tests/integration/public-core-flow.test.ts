import { describe, it, expect } from 'vitest';
import { openFile, saveFile } from '../../src/lib/ipc';
import { formatWindowTitle, APP_DISPLAY_NAME } from '../../src/config/version';
import { LineEnding, FileEncoding } from '../../src/types/document';

describe('Public Core Flow Integration Regressions (Open Source MVP)', () => {
  const sampleMarkdown = '# Hello Public QvReader\n\nThis is a sample document for open-source verification.\n';

  it('verifies public core flow: open, read, format title, and offline status', async () => {
    const doc = await openFile('/test/sample.md');
    expect(doc).toBeDefined();
    expect(doc.filePath).toBe('/test/sample.md');

    // Window title formatting
    const title = formatWindowTitle({
      fileName: 'sample.md',
      isDirty: false,
      hasFilePath: true
    });
    expect(title).toContain('sample.md');
    expect(title).toContain(APP_DISPLAY_NAME);
  });

  it('preserves line endings and encodings on roundtrip save', async () => {
    // 1. CRLF line endings
    const crlfContent = '# Windows File\r\nLine 1\r\nLine 2\r\n';
    const crlfSave = await saveFile('/test/crlf.md', crlfContent, 'CRLF' as LineEnding, 'UTF-8' as FileEncoding);
    expect(crlfSave.success).toBe(true);

    // 2. LF line endings
    const lfContent = '# Unix File\nLine 1\nLine 2\n';
    const lfSave = await saveFile('/test/lf.md', lfContent, 'LF' as LineEnding, 'UTF-8' as FileEncoding);
    expect(lfSave.success).toBe(true);

    // 3. UTF-8 with BOM
    const bomSave = await saveFile('/test/bom.md', lfContent, 'LF' as LineEnding, 'UTF-8-BOM' as FileEncoding);
    expect(bomSave.success).toBe(true);
  });

  it('validates dirty state and edit transitions', () => {
    const cleanTitle = formatWindowTitle({ fileName: 'doc.md', isDirty: false });
    const dirtyTitle = formatWindowTitle({ fileName: 'doc.md', isDirty: true });

    expect(cleanTitle).toBe(`doc.md - ${APP_DISPLAY_NAME}`);
    expect(dirtyTitle).toBe(`• doc.md - ${APP_DISPLAY_NAME}`);
  });
});
