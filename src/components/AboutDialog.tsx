import React from 'react';
import { EDITION_CONFIG } from '../config/edition';
import { AppVersionInfo } from '../types/updater';
import { X } from 'lucide-react';
import { useI18n } from '../i18n';

export interface AboutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  versionInfo?: AppVersionInfo | null;
}

export const AboutDialog: React.FC<AboutDialogProps> = ({ isOpen, onClose, versionInfo }) => {
  const { locale } = useI18n();
  if (!isOpen) return null;

  const isCommunity = EDITION_CONFIG.isCommunityBuild;
  const buildTypeLabel = isCommunity
    ? (locale === 'zh' ? '非官方构建 (Community Build)' : 'Community Build')
    : (locale === 'zh' ? '官方正式版 (Official Release)' : 'Official Release');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 text-center shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 mb-3 shadow-sm">
          <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            Qv
          </span>
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-center gap-1.5">
          QvReader
          {isCommunity && (
            <span className="text-xs px-2 py-0.5 rounded-full font-normal bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700">
              {locale === 'zh' ? '非官方构建' : 'Community Build'}
            </span>
          )}
        </h3>
        <p className="text-xs font-mono text-zinc-500 mt-1">
          {versionInfo ? `v${versionInfo.version}` : 'v0.1.5'} · {buildTypeLabel}
        </p>
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 space-y-1">
          <p>Apache-2.0 Open Source License</p>
          <p className="text-[11px] text-zinc-400">© 2026 QvReader Team. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
