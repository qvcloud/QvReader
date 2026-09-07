import { useEffect } from 'react';

/**
 * Prefetches heavy CodeMirror editor bundles in the background during idle periods
 * so that when the user presses F2 or F3, the editor mounts instantaneously (<50ms).
 */
export function useEditorPrefetch(delayMs: number = 1500): void {
  useEffect(() => {
    let timeoutId: number | undefined;
    let idleId: number | undefined;
    let hasPrefetched = false;

    const triggerPrefetch = () => {
      if (hasPrefetched) return;
      hasPrefetched = true;

      // Dynamic import loads and caches the chunks in browser/webview module cache
      import('../components/Editor/InlineEditor').catch(() => {});
      import('../components/SplitView/SplitContainer').catch(() => {});
    };

    if (typeof window !== 'undefined') {
      const win = window as any;
      if (typeof win.requestIdleCallback === 'function') {
        idleId = win.requestIdleCallback(triggerPrefetch, { timeout: delayMs + 1000 });
      } else {
        timeoutId = window.setTimeout(triggerPrefetch, delayMs);
      }

      // Also trigger prefetch on first user activity
      const onUserActive = () => {
        triggerPrefetch();
        cleanupListeners();
      };

      const cleanupListeners = () => {
        window.removeEventListener('mousemove', onUserActive);
        window.removeEventListener('keydown', onUserActive);
      };

      window.addEventListener('mousemove', onUserActive, { once: true, passive: true });
      window.addEventListener('keydown', onUserActive, { once: true, passive: true });

      return () => {
        if (timeoutId) window.clearTimeout(timeoutId);
        if (idleId && 'cancelIdleCallback' in window) {
          (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
        }
        cleanupListeners();
      };
    }
  }, [delayMs]);
}
