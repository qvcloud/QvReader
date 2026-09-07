import React, { useEffect } from 'react';
import { useI18n } from '../../i18n';

interface Props {
  isOpen: boolean;
  fileName: string;
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

export const SafeExitDialog: React.FC<Props> = ({
  isOpen,
  fileName,
  onSave,
  onDiscard,
  onCancel
}) => {
  const { t } = useI18n();

  // Esc dismisses the dialog (cancel) instead of leaking to window close.
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const title = t.dialogs.savePromptTitle.replace('{fileName}', fileName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#252526] rounded-xl shadow-2xl border border-slate-200 dark:border-neutral-700 w-full max-w-sm p-5 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
            {t.dialogs.savePromptDesc}
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-700 rounded-lg transition"
          >
            {t.dialogs.cancel}
          </button>
          <button
            onClick={onDiscard}
            className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
          >
            {t.dialogs.dontSave}
          </button>
          <button
            onClick={onSave}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition"
          >
            {t.dialogs.save}
          </button>
        </div>
      </div>
    </div>
  );
};
