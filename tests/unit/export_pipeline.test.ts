import { describe, it, expect } from 'vitest';
import { generateStandaloneHtml } from '../../src/services/htmlExport';

describe('Standalone HTML Export Parity', () => {
  it('generates self-contained HTML document with title and dark/light styling', () => {
    const raw = "# Title";
    const rendered = "<h1>Title</h1><p>Hello world</p>";
    const html = generateStandaloneHtml(raw, rendered, { fileName: "test-doc.md", isDark: false });

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<title>test-doc</title>");
    expect(html).toContain("<h1>Title</h1>");
    expect(html).not.toContain("class=\"dark\"");
  });

  it('includes KaTeX stylesheet link when equations are present in rendered content', () => {
    const raw = "$E=mc^2$";
    const rendered = "<span class=\"katex\">math</span>";
    const html = generateStandaloneHtml(raw, rendered, { fileName: "math.md" });

    expect(html).toContain("katex.min.css");
  });

  it('can dynamically import imageExport without top-level evaluation errors', async () => {
    const module = await import('../../src/services/imageExport');
    expect(typeof module.exportMarkdownAsImage).toBe('function');
    expect(typeof module.calculateImageExportDimensions).toBe('function');
  });

  it('calculates image export dimensions matching actual display width without clamping to 860px', async () => {
    const { calculateImageExportDimensions } = await import('../../src/services/imageExport');

    // Mock an element displayed at 1200px on a widescreen monitor
    const mockElement = {
      getBoundingClientRect: () => ({ width: 1200, height: 1800 }),
      offsetWidth: 1200,
      offsetHeight: 1800,
      scrollWidth: 1200,
      scrollHeight: 1800,
      querySelectorAll: () => []
    } as unknown as HTMLElement;

    const dims = calculateImageExportDimensions(mockElement);
    expect(dims.contentWidth).toBe(1200);
    expect(dims.contentHeight).toBe(1800);
    expect(dims.paddingX).toBe(40);
    expect(dims.paddingY).toBe(48);
    // Canvas total width accounts for padding so content is not cut off
    expect(dims.totalWidth).toBe(1200 + 40 * 2);
    expect(dims.totalHeight).toBe(1800 + 48 * 2);
  });

  it('expands export width when wide tables or code blocks exceed display width', async () => {
    const { calculateImageExportDimensions } = await import('../../src/services/imageExport');

    // Mock an element displayed at 800px with a wide table of 1150px
    const wideTable = {
      scrollWidth: 1150,
      offsetWidth: 1150
    };

    const mockElement = {
      getBoundingClientRect: () => ({ width: 800, height: 1000 }),
      offsetWidth: 800,
      offsetHeight: 1000,
      scrollWidth: 1150,
      scrollHeight: 1000,
      querySelectorAll: () => [wideTable]
    } as unknown as HTMLElement;

    const dims = calculateImageExportDimensions(mockElement);
    expect(dims.contentWidth).toBe(1150);
    expect(dims.totalWidth).toBe(1150 + dims.paddingX * 2);
  });

  it('includes pre-wrap and overflow CSS rules to prevent right-side truncation of code blocks and tables', async () => {
    const { EXTRA_EXPORT_CSS } = await import('../../src/services/imageExport');

    expect(EXTRA_EXPORT_CSS).toContain('white-space: pre-wrap !important');
    expect(EXTRA_EXPORT_CSS).toContain('word-break: break-word !important');
    expect(EXTRA_EXPORT_CSS).toContain('overflow-x: visible !important');
    expect(EXTRA_EXPORT_CSS).toContain('display: table !important');
    expect(EXTRA_EXPORT_CSS).toContain('max-width: 100% !important');
  });
});
