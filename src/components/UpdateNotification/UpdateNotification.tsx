import React from 'react';
import { X, Sparkles, Download, Clock } from 'lucide-react';
import { useI18n } from '../../i18n';
import { UpdateManifest } from '../../types/updater';
import { openExternalUrl } from '../../lib/ipc';

interface UpdateNotificationProps {
  manifest: UpdateManifest | null;
  onClose: () => void;
  onSnooze: () => void;
}

export const UpdateNotification: React.FC<UpdateNotificationProps> = ({
  manifest,
  onClose,
  onSnooze,
}) => {
  const { t } = useI18n();

  if (!manifest) return null;

  const handleDownload = () => {
    void openExternalUrl(manifest.downloadUrl || 'https://qvreader.com/#download');
    onClose();
  };

  return (
    <aside
      role="status"
      aria-live="polite"
      aria-label={t.updater.newVersionTitle.replace('{version}', manifest.version)}
      className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-blue-500/30 dark:border-blue-500/30 p-4.5 animate-in fade-in slide-in-from-bottom-5 duration-300 backdrop-blur-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              {t.updater.newVersionTitle.replace('{version}', manifest.version)}
            </h4>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
              {manifest.releaseDate}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          aria-label={t.shortcutsModal.close}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-2.5 leading-relaxed">
        {t.updater.newVersionSubtitle}
      </p>

      {manifest.releaseNotes && (
        <div className="mt-2.5 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400 max-h-20 overflow-y-auto whitespace-pre-line font-mono">
          {manifest.releaseNotes}
        </div>
      )}

      <div className="mt-3.5 flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
        <button
          type="button"
          onClick={handleDownload}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{t.updater.downloadUpdate}</span>
        </button>

        <button
          type="button"
          onClick={onSnooze}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition cursor-pointer"
          title={t.updater.remindLater}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{t.updater.remindLater}</span>
        </button>
      </div>
    </aside>
  );
};
