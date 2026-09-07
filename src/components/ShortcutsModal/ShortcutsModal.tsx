import React, { useEffect } from 'react';
import { useI18n } from '../../i18n';
import { X, Command } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useI18n();

  // Esc closes the shortcuts guide.
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes('MAC');
  const modKey = isMac ? '⌘' : 'Ctrl';

  const shortcutItems = [
    { key: 'Esc', desc: t.shortcutsModal.escDesc },
    { key: `${modKey} + W`, desc: t.shortcutsModal.closeFileDesc },
    { key: 'F2', desc: t.shortcutsModal.f2Desc },
    { key: 'F3', desc: t.shortcutsModal.f3Desc },
    { key: `${modKey} + S`, desc: t.shortcutsModal.saveDesc },
    { key: `${modKey} + P`, desc: t.shortcutsModal.printDesc },
    { key: `${modKey} + Shift + P`, desc: t.shortcutsModal.exportPdfDesc },
    { key: `${modKey} + Shift + E`, desc: t.shortcutsModal.exportImageDesc },
    { key: `${modKey} + Shift + H`, desc: t.shortcutsModal.exportHtmlDesc },
    { key: `${modKey} + Shift + O`, desc: t.shortcutsModal.outlineDesc },
    { key: `${modKey} + / - / 0`, desc: t.shortcutsModal.zoomDesc }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#252526] rounded-xl shadow-2xl border border-slate-200 dark:border-neutral-700 w-full max-w-md p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-700 pb-3">
          <div className="flex items-center gap-2">
            <Command className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              {t.shortcutsModal.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 py-1">
          {shortcutItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg bg-slate-50 dark:bg-neutral-800/50"
            >
              <span className="text-slate-600 dark:text-neutral-300">{item.desc}</span>
              <kbd className="px-2 py-0.5 rounded font-mono font-semibold bg-white dark:bg-neutral-700 text-slate-800 dark:text-neutral-200 border border-slate-200 dark:border-neutral-600 shadow-sm text-[11px]">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition"
          >
            {t.shortcutsModal.close}
          </button>
        </div>
      </div>
    </div>
  );
};
