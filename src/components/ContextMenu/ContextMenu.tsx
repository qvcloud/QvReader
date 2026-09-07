import React, { useEffect, useRef } from 'react';
import {
  BookOpen,
  Edit3,
  Columns2,
  ListTree,
  Printer,
  FileText,
  Image,
  Globe
} from 'lucide-react';
import { ViewMode } from '../../types/document';
import { useI18n } from '../../i18n';

interface Props {
  isOpen: boolean;
  x: number;
  y: number;
  onClose: () => void;
  mode: ViewMode;
  onSetMode: (mode: ViewMode) => void;
  isOutlineOpen: boolean;
  onToggleOutline: () => void;
  onPrint: () => void;
  onExportPdf: () => void;
  onExportImage: () => void;
  onExportHtml: () => void;
}

export const ContextMenu: React.FC<Props> = ({
  isOpen,
  x,
  y,
  onClose,
  mode,
  onSetMode,
  isOutlineOpen,
  onToggleOutline,
  onPrint,
  onExportPdf,
  onExportImage,
  onExportHtml
}) => {
  const { t } = useI18n();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    const handleWindowChange = () => onClose();

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleWindowChange);
    window.addEventListener('scroll', handleWindowChange, true);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleWindowChange);
      window.removeEventListener('scroll', handleWindowChange, true);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Viewport clamping
  const menuWidth = 230;
  const menuHeight = 250;
  const clampedX = Math.max(10, Math.min(x, window.innerWidth - menuWidth - 10));
  const clampedY = Math.max(10, Math.min(y, window.innerHeight - menuHeight - 10));

  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes('MAC');
  const modKey = isMac ? '⌘' : 'Ctrl+';

  return (
    <div
      ref={menuRef}
      style={{ left: `${clampedX}px`, top: `${clampedY}px` }}
      className="qv-context-menu fixed z-50 w-56 bg-white/95 dark:bg-[#202020]/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-200/80 dark:border-neutral-800 p-1.5 text-xs text-slate-700 dark:text-neutral-200 select-none animate-in fade-in zoom-in-95 duration-100"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modes Group */}
      <div className="space-y-0.5 pb-1 mb-1 border-b border-slate-100 dark:border-neutral-800/80">
        <button
          type="button"
          onClick={() => {
            onSetMode('reading');
            onClose();
          }}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
            mode === 'reading'
              ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-medium'
              : 'hover:bg-slate-100 dark:hover:bg-neutral-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t.contextMenu?.readingMode || 'Reading Mode'}</span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">
            {modKey}1
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            onSetMode('inline_edit');
            onClose();
          }}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
            mode === 'inline_edit'
              ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-medium'
              : 'hover:bg-slate-100 dark:hover:bg-neutral-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Edit3 className="w-3.5 h-3.5" />
            <span>{t.contextMenu?.inlineEdit || 'Inline Edit'}</span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">
            F2
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            onSetMode('split_edit');
            onClose();
          }}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
            mode === 'split_edit'
              ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-medium'
              : 'hover:bg-slate-100 dark:hover:bg-neutral-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Columns2 className="w-3.5 h-3.5" />
            <span>{t.contextMenu?.splitView || 'Split View'}</span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">
            F3
          </span>
        </button>
      </div>

      {/* Navigation & Actions Group */}
      <div className="space-y-0.5">
        <button
          type="button"
          onClick={() => {
            onToggleOutline();
            onClose();
          }}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ListTree className="w-3.5 h-3.5 text-slate-500 dark:text-neutral-400" />
            <span>
              {isOutlineOpen
                ? t.contextMenu?.hideOutline || 'Hide Outline'
                : t.contextMenu?.showOutline || 'Show Outline'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">
            {modKey}⇧O
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            onPrint();
          }}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-neutral-400" />
            <span>{t.contextMenu?.print || 'Print...'}</span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">
            {modKey}P
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            onExportPdf();
          }}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-neutral-400" />
            <span>{t.contextMenu?.exportPdf || 'Export as PDF...'}</span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">
            {modKey}⇧P
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            onExportImage();
          }}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Image className="w-3.5 h-3.5 text-slate-500 dark:text-neutral-400" />
            <span>{t.contextMenu?.exportImage || 'Export as Image...'}</span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">
            {modKey}⇧E
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            onExportHtml();
          }}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-neutral-400" />
            <span>{t.contextMenu?.exportHtml || 'Export as HTML...'}</span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">
            {modKey}⇧H
          </span>
        </button>
      </div>
    </div>
  );
};
