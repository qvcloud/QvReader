import { useState, useCallback } from 'react';

const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 28;
const DEFAULT_FONT_SIZE = 15;

export function useZoom(initialSize: number = DEFAULT_FONT_SIZE) {
  const [fontSize, setFontSize] = useState<number>(initialSize);

  const zoomIn = useCallback(() => {
    setFontSize((prev) => Math.min(prev + 1, MAX_FONT_SIZE));
  }, []);

  const zoomOut = useCallback(() => {
    setFontSize((prev) => Math.max(prev - 1, MIN_FONT_SIZE));
  }, []);

  const resetZoom = useCallback(() => {
    setFontSize(DEFAULT_FONT_SIZE);
  }, []);

  return { fontSize, setFontSize, zoomIn, zoomOut, resetZoom };
}
