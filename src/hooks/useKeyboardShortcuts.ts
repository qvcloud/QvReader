import { useEffect } from 'react';
import { ViewMode } from '../types/document';

interface ShortcutOptions {
  mode: ViewMode;
  setMode: (mode: ViewMode | ((prev: ViewMode) => ViewMode)) => void;
  onNew?: () => void;
  onClose?: () => void;
  onSave: () => void;
  onReload?: () => void;
  onExit: () => void;
  onToggleOutline: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onPrint?: () => void;
  onExportPdf?: () => void;
  onExportImage?: () => void;
  onExportHtml?: () => void;
  onShortcuts?: () => void;
  /** When true, global shortcuts are suppressed (e.g. a modal owns keyboard). */
  enabled?: boolean;
}

export function useKeyboardShortcuts({
  mode: _mode,
  setMode,
  onNew,
  onClose,
  onSave,
  onReload,
  onExit,
  onToggleOutline,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onPrint,
  onExportPdf,
  onExportImage,
  onExportHtml,
  onShortcuts,
  enabled = true
}: ShortcutOptions) {
  useEffect(() => {
    if (!enabled) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // Esc -> Exit reading window / prompt safe exit
      if (e.key === 'Escape') {
        e.preventDefault();
        onExit();
        return;
      }

      // Ctrl/Cmd + P -> Print Document
      if (modKey && !e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        if (onPrint) onPrint();
        return;
      }

      // Ctrl/Cmd + Shift + P -> Export as PDF
      if (modKey && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        if (onExportPdf) onExportPdf();
        return;
      }

      // Ctrl/Cmd + Shift + E -> Export as Image (PNG)
      if (modKey && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        if (onExportImage) onExportImage();
        return;
      }

      // Ctrl/Cmd + Shift + H -> Export as HTML
      if (modKey && e.shiftKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        if (onExportHtml) onExportHtml();
        return;
      }

      // F2 -> Toggle Inline Editing Mode
      if (e.key === 'F2') {
        e.preventDefault();
        setMode((prev) => (prev === 'inline_edit' ? 'reading' : 'inline_edit'));
        return;
      }

      // F3 -> Toggle Split View Mode
      if (e.key === 'F3') {
        e.preventDefault();
        setMode((prev) => (prev === 'split_edit' ? 'reading' : 'split_edit'));
        return;
      }

      // Ctrl/Cmd + 1 -> Reading Mode
      if (modKey && e.key === '1') {
        e.preventDefault();
        setMode('reading');
        return;
      }

      // Ctrl/Cmd + 2 -> Inline Edit Mode (Toggle)
      if (modKey && e.key === '2') {
        e.preventDefault();
        setMode((prev) => (prev === 'inline_edit' ? 'reading' : 'inline_edit'));
        return;
      }

      // Ctrl/Cmd + 3 -> Split View Mode (Toggle)
      if (modKey && e.key === '3') {
        e.preventDefault();
        setMode((prev) => (prev === 'split_edit' ? 'reading' : 'split_edit'));
        return;
      }

      // Ctrl/Cmd + W -> Close active file (or exit window)
      if (modKey && !e.shiftKey && e.key.toLowerCase() === 'w') {
        e.preventDefault();
        if (onClose) {
          onClose();
        } else {
          onExit();
        }
        return;
      }

      // Ctrl/Cmd + N -> New document
      if (modKey && !e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        if (onNew) onNew();
        return;
      }

      // Ctrl/Cmd + S -> Save document
      if (modKey && !e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        onSave();
        return;
      }

      // Ctrl/Cmd + R -> Reload document from disk
      if (modKey && !e.shiftKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        if (onReload) onReload();
        return;
      }

      // Ctrl/Cmd + Shift + O -> Toggle Table of Contents Outline
      if (modKey && e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        onToggleOutline();
        return;
      }

      // Ctrl/Cmd + / -> Keyboard Shortcuts
      if (modKey && e.key === '/') {
        e.preventDefault();
        if (onShortcuts) onShortcuts();
        return;
      }

      // Zoom controls: Ctrl/Cmd + =/+
      if (modKey && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        onZoomIn();
        return;
      }

      // Zoom controls: Ctrl/Cmd + -
      if (modKey && e.key === '-') {
        e.preventDefault();
        onZoomOut();
        return;
      }

      // Zoom reset: Ctrl/Cmd + 0
      if (modKey && e.key === '0') {
        e.preventDefault();
        onResetZoom();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setMode, onNew, onClose, onSave, onReload, onExit, onToggleOutline, onZoomIn, onZoomOut, onResetZoom, onPrint, onExportPdf, onExportImage, onExportHtml, onShortcuts, enabled]);
}
