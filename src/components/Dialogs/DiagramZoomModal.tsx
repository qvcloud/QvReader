import React, { useEffect, useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useI18n } from '../../i18n';

interface Props {
  isOpen: boolean;
  svgHtml: string;
  onClose: () => void;
}

export const DiagramZoomModal: React.FC<Props> = ({
  isOpen,
  svgHtml,
  onClose
}) => {
  const { t } = useI18n();
  const [scale, setScale] = useState(1);

  // Reset scale when reopened
  useEffect(() => {
    if (isOpen) setScale(1);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-md select-none"
      onClick={onClose}
    >
      {/* Top Controls Bar */}
      <div
        className="h-12 border-b border-white/10 bg-black/40 px-4 flex items-center justify-between shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-xs font-semibold text-white/80">
          {t.diagramModal.previewTitle}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setScale((s) => Math.max(0.4, Number((s - 0.2).toFixed(1))))}
            title={t.common.zoomOut}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-white/60 font-mono w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale((s) => Math.min(3, Number((s + 0.2).toFixed(1))))}
            title={t.common.zoomIn}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setScale(1)}
            title={t.common.resetZoom}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div className="h-4 w-px bg-white/20 mx-1.5" />
          <button
            onClick={onClose}
            title={t.diagramModal.close}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div
        className="flex-1 overflow-auto p-8 flex items-center justify-center cursor-default"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="transition-transform duration-150 ease-out bg-white dark:bg-[#1e1e1e] p-6 rounded-xl shadow-2xl border border-white/10 max-w-full max-h-full overflow-auto flex items-center justify-center [&>svg]:max-w-none [&>svg]:h-auto"
          style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
          onClick={(e) => e.stopPropagation()}
          dangerouslySetInnerHTML={{ __html: svgHtml }}
        />
      </div>
    </div>
  );
};
