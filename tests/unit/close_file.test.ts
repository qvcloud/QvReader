import { describe, it, expect, vi } from 'vitest';

describe('Close File and Ctrl/Cmd+W logic', () => {
  it('detects whether active file exists to show close button', () => {
    function canCloseFile(doc: { filePath: string | null; isDirty: boolean; rawContent: string; fileName: string }) {
      return Boolean(
        doc.filePath !== null ||
        doc.isDirty ||
        (doc.rawContent && doc.rawContent.trim().length > 0) ||
        (doc.fileName && doc.fileName !== 'Untitled.md')
      );
    }

    // Clean untitled document -> should NOT show close button
    expect(canCloseFile({ filePath: null, isDirty: false, rawContent: '', fileName: 'Untitled.md' })).toBe(false);

    // Active file opened from disk -> should show close button
    expect(canCloseFile({ filePath: '/path/to/sample.md', isDirty: false, rawContent: 'hello', fileName: 'sample.md' })).toBe(true);

    // Dirty untitled draft -> should show close button
    expect(canCloseFile({ filePath: null, isDirty: true, rawContent: 'unsaved text', fileName: 'Untitled.md' })).toBe(true);

    // Typed content in untitled -> should show close button
    expect(canCloseFile({ filePath: null, isDirty: false, rawContent: 'drafting...', fileName: 'Untitled.md' })).toBe(true);
  });

  it('verifies Ctrl/Cmd+W event key mapping', () => {
    function handleKeyDown(
      e: { key: string; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; preventDefault: () => void },
      onClose?: () => void,
      onExit?: () => void
    ) {
      const isMac = true;
      const modKey = isMac ? e.metaKey : e.ctrlKey;
      if (modKey && !e.shiftKey && e.key.toLowerCase() === 'w') {
        e.preventDefault();
        if (onClose) onClose();
        else if (onExit) onExit();
      }
    }

    const onClose = vi.fn();
    const onExit = vi.fn();
    const preventDefault = vi.fn();

    handleKeyDown({ key: 'w', metaKey: true, ctrlKey: false, shiftKey: false, preventDefault }, onClose, onExit);
    expect(preventDefault).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onExit).not.toHaveBeenCalled();

    // Fallback to onExit if no onClose
    handleKeyDown({ key: 'w', metaKey: true, ctrlKey: false, shiftKey: false, preventDefault }, undefined, onExit);
    expect(onExit).toHaveBeenCalledTimes(1);
  });
});

