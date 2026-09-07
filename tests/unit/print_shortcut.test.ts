import { describe, it, expect, vi } from 'vitest';

describe('Print & Export Shortcuts and Logic', () => {
  function handleShortcuts(
    e: { key: string; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; preventDefault: () => void },
    callbacks: {
      onPrint?: () => void;
      onExportPdf?: () => void;
      onExportImage?: () => void;
      onExportHtml?: () => void;
    }
  ) {
    const isMac = true;
    const modKey = isMac ? e.metaKey : e.ctrlKey;

    // Ctrl/Cmd + P -> Print
    if (modKey && !e.shiftKey && e.key.toLowerCase() === 'p') {
      e.preventDefault();
      if (callbacks.onPrint) callbacks.onPrint();
      return;
    }

    // Ctrl/Cmd + Shift + P -> Export as PDF
    if (modKey && e.shiftKey && e.key.toLowerCase() === 'p') {
      e.preventDefault();
      if (callbacks.onExportPdf) callbacks.onExportPdf();
      return;
    }

    // Ctrl/Cmd + Shift + E -> Export as Image (PNG)
    if (modKey && e.shiftKey && e.key.toLowerCase() === 'e') {
      e.preventDefault();
      if (callbacks.onExportImage) callbacks.onExportImage();
      return;
    }

    // Ctrl/Cmd + Shift + H -> Export as HTML
    if (modKey && e.shiftKey && e.key.toLowerCase() === 'h') {
      e.preventDefault();
      if (callbacks.onExportHtml) callbacks.onExportHtml();
      return;
    }
  }

  it('triggers onPrint when Cmd+P (without shift) is pressed', () => {
    const onPrint = vi.fn();
    const onExportPdf = vi.fn();
    const onExportImage = vi.fn();
    const onExportHtml = vi.fn();
    const preventDefault = vi.fn();

    handleShortcuts(
      { key: 'p', metaKey: true, ctrlKey: false, shiftKey: false, preventDefault },
      { onPrint, onExportPdf, onExportImage, onExportHtml }
    );

    expect(preventDefault).toHaveBeenCalled();
    expect(onPrint).toHaveBeenCalledTimes(1);
    expect(onExportPdf).not.toHaveBeenCalled();
    expect(onExportImage).not.toHaveBeenCalled();
    expect(onExportHtml).not.toHaveBeenCalled();
  });

  it('triggers onExportPdf when Cmd+Shift+P is pressed', () => {
    const onPrint = vi.fn();
    const onExportPdf = vi.fn();
    const onExportImage = vi.fn();
    const onExportHtml = vi.fn();
    const preventDefault = vi.fn();

    handleShortcuts(
      { key: 'p', metaKey: true, ctrlKey: false, shiftKey: true, preventDefault },
      { onPrint, onExportPdf, onExportImage, onExportHtml }
    );

    expect(preventDefault).toHaveBeenCalled();
    expect(onPrint).not.toHaveBeenCalled();
    expect(onExportPdf).toHaveBeenCalledTimes(1);
    expect(onExportImage).not.toHaveBeenCalled();
    expect(onExportHtml).not.toHaveBeenCalled();
  });

  it('triggers onExportImage when Cmd+Shift+E is pressed', () => {
    const onPrint = vi.fn();
    const onExportPdf = vi.fn();
    const onExportImage = vi.fn();
    const onExportHtml = vi.fn();
    const preventDefault = vi.fn();

    handleShortcuts(
      { key: 'e', metaKey: true, ctrlKey: false, shiftKey: true, preventDefault },
      { onPrint, onExportPdf, onExportImage, onExportHtml }
    );

    expect(preventDefault).toHaveBeenCalled();
    expect(onPrint).not.toHaveBeenCalled();
    expect(onExportPdf).not.toHaveBeenCalled();
    expect(onExportImage).toHaveBeenCalledTimes(1);
    expect(onExportHtml).not.toHaveBeenCalled();
  });

  it('triggers onExportHtml when Cmd+Shift+H is pressed', () => {
    const onPrint = vi.fn();
    const onExportPdf = vi.fn();
    const onExportImage = vi.fn();
    const onExportHtml = vi.fn();
    const preventDefault = vi.fn();

    handleShortcuts(
      { key: 'h', metaKey: true, ctrlKey: false, shiftKey: true, preventDefault },
      { onPrint, onExportPdf, onExportImage, onExportHtml }
    );

    expect(preventDefault).toHaveBeenCalled();
    expect(onPrint).not.toHaveBeenCalled();
    expect(onExportPdf).not.toHaveBeenCalled();
    expect(onExportImage).not.toHaveBeenCalled();
    expect(onExportHtml).toHaveBeenCalledTimes(1);
  });

  it('verifies typography.css does not have content-visibility: auto which breaks off-screen image export', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const cssPath = path.resolve(__dirname, '../../src/styles/typography.css');
    const content = fs.readFileSync(cssPath, 'utf-8');
    expect(content).not.toContain('content-visibility: auto');
    expect(content).not.toContain('contain-intrinsic-size');
  });

  it('verifies print.css enforces content-visibility: visible for code blocks', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const printCssPath = path.resolve(__dirname, '../../src/styles/print.css');
    const content = fs.readFileSync(printCssPath, 'utf-8');
    expect(content).toContain('content-visibility: visible !important;');
  });
});

