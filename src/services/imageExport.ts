import { toPng, getFontEmbedCSS } from 'html-to-image';

export interface ImageExportOptions {
  fileName?: string;
  isDark?: boolean;
  onStart?: () => void;
  onSuccess?: (fileName: string) => void;
  onError?: (err: Error) => void;
}

/**
 * Converts a base64 DataURL directly into a binary Blob
 * without re-executing an expensive canvas rendering pass.
 */
async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  try {
    const res = await fetch(dataUrl);
    return await res.blob();
  } catch {
    const parts = dataUrl.split(';base64,');
    const contentType = parts[0].split(':')[1] || 'image/png';
    const binary = atob(parts[1]);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    return new Blob([array], { type: contentType });
  }
}

export interface ImageExportDimensions {
  contentWidth: number;
  contentHeight: number;
  totalWidth: number;
  totalHeight: number;
  paddingX: number;
  paddingY: number;
}

/**
 * Calculates the full export dimensions based on the element's actual displayed
 * width, scroll width, and child elements to guarantee zero right-side clipping.
 */
export function calculateImageExportDimensions(targetElement: HTMLElement): ImageExportDimensions {
  const paddingX = 40;
  const paddingY = 48;

  let displayedWidth = 860;
  let displayedHeight = 600;

  if (typeof targetElement.getBoundingClientRect === 'function') {
    const rect = targetElement.getBoundingClientRect();
    if (rect.width > 0) displayedWidth = Math.ceil(rect.width);
    if (rect.height > 0) displayedHeight = Math.ceil(rect.height);
  }

  if (targetElement.offsetWidth && targetElement.offsetWidth > displayedWidth) {
    displayedWidth = targetElement.offsetWidth;
  }
  if (targetElement.offsetHeight && targetElement.offsetHeight > displayedHeight) {
    displayedHeight = targetElement.offsetHeight;
  }

  const scrollWidth = targetElement.scrollWidth || 0;
  const scrollHeight = targetElement.scrollHeight || 0;

  let maxChildWidth = displayedWidth;
  if (typeof targetElement.querySelectorAll === 'function') {
    const wideElements = targetElement.querySelectorAll<HTMLElement>('pre, table, svg, img, .qv-mermaid-wrapper');
    wideElements.forEach((el) => {
      const elScroll = el.scrollWidth || 0;
      const elOffset = el.offsetWidth || 0;
      const elWidth = Math.max(elScroll, elOffset);
      if (elWidth > maxChildWidth) {
        maxChildWidth = elWidth;
      }
    });
  }

  const contentWidth = Math.max(displayedWidth, scrollWidth, maxChildWidth);
  const contentHeight = Math.max(displayedHeight, scrollHeight);

  const totalWidth = contentWidth + paddingX * 2;
  const totalHeight = contentHeight + paddingY * 2;

  return {
    contentWidth,
    contentHeight,
    totalWidth,
    totalHeight,
    paddingX,
    paddingY
  };
}

export const EXTRA_EXPORT_CSS = `
  * {
    box-sizing: border-box !important;
  }

  .qv-markdown {
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
    overflow: visible !important;
  }

  .qv-markdown p,
  .qv-markdown h1,
  .qv-markdown h2,
  .qv-markdown h3,
  .qv-markdown h4,
  .qv-markdown h5,
  .qv-markdown h6,
  .qv-markdown ul,
  .qv-markdown ol,
  .qv-markdown blockquote,
  .qv-markdown hr {
    width: auto !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
  }

  /* Code blocks: wrap long lines so nothing is cut off on the right */
  pre,
  pre.hljs,
  pre code,
  .qv-markdown pre,
  .qv-markdown pre.hljs,
  .qv-markdown pre code {
    white-space: pre-wrap !important;
    word-break: break-word !important;
    overflow-x: visible !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
  }

  /* Tables: display fully with word wrap on cell contents */
  table,
  .qv-markdown table {
    display: table !important;
    width: 100% !important;
    max-width: 100% !important;
    overflow: visible !important;
    box-sizing: border-box !important;
  }

  table th,
  table td,
  .qv-markdown table th,
  .qv-markdown table td {
    word-break: break-word !important;
  }

  /* Diagrams, images, and math: ensure they scale cleanly without right-side clipping */
  img,
  svg,
  .qv-markdown img,
  .qv-mermaid-wrapper,
  .qv-mermaid-wrapper svg {
    max-width: 100% !important;
    height: auto !important;
    box-sizing: border-box !important;
  }

  .qv-math-block,
  .katex-display {
    overflow-x: visible !important;
    max-width: 100% !important;
  }
`;

/**
 * Captures rendered Markdown container and exports it as a high-resolution PNG image.
 * Saves the file to downloads/disk and also copies it to clipboard if supported.
 * Robustly resolves KaTeX formulas and web fonts via two-pass rendering.
 */
export async function exportMarkdownAsImage(
  targetElement: HTMLElement,
  options: ImageExportOptions = {}
): Promise<{ success: boolean; fileName?: string; error?: Error }> {
  if (options.onStart) options.onStart();

  const isDark = options.isDark ?? document.documentElement.classList.contains('dark');
  const backgroundColor = isDark ? '#1e1e1e' : '#ffffff';
  const textColor = isDark ? '#e4e4e7' : '#111827';

  // Format safe export file name
  const rawName = options.fileName?.trim() || 'Document';
  const cleanBase = rawName.replace(/\.(md|markdown|txt)$/i, '');
  const finalFileName = `${cleanBase}.png`;

  const pixelRatio = Math.max(2, typeof window !== 'undefined' ? window.devicePixelRatio || 2 : 2);

  // Synchronize .dark class on the target container itself during rendering
  // so that cloned element descendant selectors (.dark .qv-markdown pre, etc.) match accurately
  const wasDark = targetElement.classList.contains('dark');
  if (isDark && !wasDark) {
    targetElement.classList.add('dark');
  } else if (!isDark && wasDark) {
    targetElement.classList.remove('dark');
  }

  try {
    // 1. Ensure any document fonts (e.g. KaTeX math fonts) are resolved
    if (typeof document !== 'undefined' && document.fonts) {
      try {
        await document.fonts.ready;
      } catch {
        // Document fonts ready check non-fatal
      }
    }

    // 2. Extract web font CSS if possible with modern woff2 preference
    let fontEmbedCSS: string | undefined;
    try {
      fontEmbedCSS = await getFontEmbedCSS(targetElement, {
        preferredFontFormat: 'woff2'
      });
    } catch {
      // Font extraction fallback to browser standard resolution
    }

    // 3. Compute accurate bounding dimensions based on actual display width
    const dimensions = calculateImageExportDimensions(targetElement);
    const { totalWidth, totalHeight, paddingX, paddingY } = dimensions;

    const computedStyle = typeof window !== 'undefined' ? window.getComputedStyle(targetElement) : null;
    const fontSize = computedStyle?.fontSize || '16px';
    const fontFamily = computedStyle?.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

    const combinedCSS = [fontEmbedCSS, EXTRA_EXPORT_CSS].filter(Boolean).join('\n');

    const renderOptions = {
      backgroundColor,
      pixelRatio,
      width: totalWidth,
      height: totalHeight,
      canvasWidth: totalWidth,
      canvasHeight: totalHeight,
      preferredFontFormat: 'woff2' as const,
      fontEmbedCSS: combinedCSS,
      style: {
        background: backgroundColor,
        color: textColor,
        padding: `${paddingY}px ${paddingX}px`,
        margin: '0',
        width: `${totalWidth}px`,
        minWidth: `${totalWidth}px`,
        maxWidth: 'none',
        height: `${totalHeight}px`,
        minHeight: `${totalHeight}px`,
        boxSizing: 'border-box' as const,
        fontSize,
        fontFamily,
        lineHeight: '1.7',
        borderRadius: '0px'
      }
    };

    // 4. Warm-up pass: triggers SVG foreignObject font decoding for KaTeX symbols
    await toPng(targetElement, renderOptions);

    // 5. Final capture pass: renders all formulas, math symbols and typography
    const dataUrl = await toPng(targetElement, renderOptions);

    // 5. Trigger browser / OS download
    const downloadAnchor = document.createElement('a');
    downloadAnchor.download = finalFileName;
    downloadAnchor.href = dataUrl;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);

    // 6. Attempt clipboard copy using the exact generated dataUrl
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        const blob = await dataUrlToBlob(dataUrl);
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
      }
    } catch {
      // Clipboard copy might be restricted in some environments; ignore silently
    }

    if (options.onSuccess) {
      options.onSuccess(finalFileName);
    }

    return { success: true, fileName: finalFileName };
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    if (options.onError) {
      options.onError(error);
    }
    return { success: false, error };
  } finally {
    // Restore original class state
    if (isDark && !wasDark) {
      targetElement.classList.remove('dark');
    } else if (!isDark && wasDark) {
      targetElement.classList.add('dark');
    }
  }
}
