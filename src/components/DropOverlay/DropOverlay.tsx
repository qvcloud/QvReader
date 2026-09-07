import React from 'react';
import { FileText, ArrowDownToLine } from 'lucide-react';
import { useI18n } from '../../i18n';

interface DropOverlayProps {
  isVisible: boolean;
}

export const DropOverlay: React.FC<DropOverlayProps> = ({ isVisible }) => {
  const { t } = useI18n();

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-8 bg-black/40 backdrop-blur-sm transition-all duration-200 animate-in fade-in"
      style={{ animationDuration: '150ms' }}
    >
      <div className="w-full max-w-lg p-10 rounded-2xl border-2 border-dashed border-cyan-500 bg-white/90 dark:bg-zinc-900/90 shadow-2xl flex flex-col items-center text-center backdrop-blur-md transform scale-100 transition-transform">
        <div className="relative mb-5">
          <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
            <FileText className="w-10 h-10" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-lg animate-bounce">
            <ArrowDownToLine className="w-4 h-4" />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          {t.dropOverlay.dropToOpen}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {t.dropOverlay.supportedFormats}
        </p>
      </div>
    </div>
  );
};
