import React, { useMemo, useEffect, useRef, useState } from 'react';
import { renderMarkdown } from '../../lib/markdown';
import { DiagramZoomModal } from '../Dialogs/DiagramZoomModal';

interface Props {
  content: string;
  filePath?: string | null;
  className?: string;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  containerRef?: React.RefObject<HTMLDivElement>;
}

export const MarkdownRenderer: React.FC<Props> = ({
  content,
  filePath,
  className = '',
  onScroll,
  containerRef
}) => {
  const localRef = useRef<HTMLDivElement>(null);
  const effectiveRef = containerRef || localRef;

  const [zoomSvg, setZoomSvg] = useState<string | null>(null);

  const html = useMemo(() => {
    let rendered = renderMarkdown(content);
    // If local file path is known, rewrite relative image sources if necessary
    if (filePath && filePath.includes('/')) {
      const baseDir = filePath.substring(0, filePath.lastIndexOf('/'));
      rendered = rendered.replace(
        /<img\s+([^>]*?)src=["'](?!https?:\/\/|\/|data:)([^"']+)["']([^>]*?)>/gi,
        (_, before, src, after) => {
          return `<img ${before}src="${baseDir}/${src}"${after}>`;
        }
      );
    }
    return rendered;
  }, [content, filePath]);

  // Asynchronous Mermaid rendering pipeline
  useEffect(() => {
    if (!effectiveRef.current || !html.includes('class="mermaid"')) {
      return;
    }

    let isCancelled = false;

    async function processMermaid() {
      const container = effectiveRef.current;
      if (!container) return;

      const mermaidNodes = container.querySelectorAll<HTMLElement>('.mermaid:not([data-processed="true"])');
      if (mermaidNodes.length === 0) return;

      try {
        const mermaid = (await import('mermaid')).default;
        if (isCancelled) return;

        const isDark = document.documentElement.classList.contains('dark');
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'default',
          securityLevel: 'loose',
          fontFamily: 'inherit'
        });

        for (let i = 0; i < mermaidNodes.length; i++) {
          if (isCancelled) break;
          const node = mermaidNodes[i];
          const rawCode = node.textContent || '';
          if (!rawCode.trim()) continue;

          const uniqueId = `qv-mermaid-${Math.random().toString(36).substring(2, 9)}`;
          try {
            const { svg } = await mermaid.render(uniqueId, rawCode.trim());
            if (isCancelled) break;
            node.innerHTML = svg;
            node.setAttribute('data-processed', 'true');
            node.setAttribute('title', 'Double-click to zoom diagram');
            node.classList.add('cursor-pointer', 'transition-transform', 'hover:scale-[1.01]');
          } catch (renderErr) {
            console.warn('Mermaid rendering error:', renderErr);
            node.setAttribute('data-processed', 'true');
            node.innerHTML = `
              <div class="my-2 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-lg text-xs font-mono text-red-600 dark:text-red-400 max-w-xl text-left">
                <div class="font-semibold mb-1 flex items-center gap-1.5">
                  <span>⚠️ Mermaid Syntax Error</span>
                </div>
                <pre class="overflow-x-auto whitespace-pre-wrap">${rawCode}</pre>
              </div>
            `;
          }
        }
      } catch (loadErr) {
        console.warn('Failed to load mermaid engine:', loadErr);
      }
    }

    processMermaid();

    return () => {
      isCancelled = true;
    };
  }, [html, effectiveRef]);

  // Asynchronous on-demand KaTeX rendering pipeline
  useEffect(() => {
    if (!effectiveRef.current || !content.includes('$')) {
      return;
    }

    let isCancelled = false;
    import('../../lib/mathRenderer')
      .then(({ renderMathInContainer }) => {
        if (!isCancelled && effectiveRef.current) {
          void renderMathInContainer(effectiveRef.current);
        }
      })
      .catch((err) => console.warn('Failed to load math renderer:', err));

    return () => {
      isCancelled = true;
    };
  }, [html, content, effectiveRef]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    if (anchor && anchor.href) {
      e.preventDefault();
      const href = anchor.getAttribute('href') || '';
      if (href.startsWith('#')) {
        // Smooth scroll to anchor
        const elementId = href.slice(1);
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (href.startsWith('http://') || href.startsWith('https://')) {
        // Open external browser
        import('@tauri-apps/plugin-shell')
          .then(({ open }) => open(href))
          .catch(() => window.open(href, '_blank'));
      }
    }
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const mermaidWrap = target.closest('.qv-mermaid-wrapper') || target.closest('.mermaid');
    if (mermaidWrap) {
      const svgEl = mermaidWrap.querySelector('svg');
      if (svgEl) {
        setZoomSvg(svgEl.outerHTML);
      }
    }
  };

  return (
    <>
      <div
        ref={effectiveRef}
        onScroll={onScroll}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        className={`qv-markdown selectable-text ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <DiagramZoomModal
        isOpen={Boolean(zoomSvg)}
        svgHtml={zoomSvg || ''}
        onClose={() => setZoomSvg(null)}
      />
    </>
  );
};
