import React from 'react';
import { useI18n } from '../../i18n';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  isVisible: boolean;
  onReload: () => void;
  onDismiss: () => void;
}

export const ExternalConflictBanner: React.FC<Props> = ({
  isVisible,
  onReload,
  onDismiss
}) => {
  const { t } = useI18n();

  if (!isVisible) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between text-xs text-amber-800 dark:text-amber-200">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
        <span>{t.dialogs.externalConflictTitle}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onReload}
          className="flex items-center gap-1 font-semibold underline underline-offset-2 hover:opacity-80 transition"
        >
          <RefreshCw className="w-3 h-3" />
          {t.dialogs.reloadDisk}
        </button>
        <span className="opacity-40">|</span>
        <button
          onClick={onDismiss}
          className="opacity-70 hover:opacity-100 transition"
        >
          {t.dialogs.keepChanges}
        </button>
      </div>
    </div>
  );
};
