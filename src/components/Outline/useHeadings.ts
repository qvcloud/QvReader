import { useState, useEffect, useMemo, useDeferredValue } from 'react';
import { extractHeadings } from '../../lib/markdown';

export function useHeadings(content: string) {
  // Defer heading extraction to React idle time. On very large documents the
  // full-text scan can be non-trivial; doing it synchronously on every edit
  // makes typing stutter. useDeferredValue keeps small files instant while
  // letting big ones recompute in the background.
  const deferredContent = useDeferredValue(content);
  const headings = useMemo(() => extractHeadings(deferredContent), [deferredContent]);
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);

  // Track active heading as user scrolls
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = document.querySelectorAll<HTMLElement>('.qv-markdown h1, .qv-markdown h2, .qv-markdown h3, .qv-markdown h4');
      if (headingElements.length === 0) return;

      let currentId: string | null = null;
      for (let i = 0; i < headingElements.length; i++) {
        const el = headingElements[i];
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120) {
          currentId = el.id || null;
        } else {
          break;
        }
      }
      if (currentId) {
        setActiveHeadingId(currentId);
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [headings]);

  return { headings, activeHeadingId };
}
