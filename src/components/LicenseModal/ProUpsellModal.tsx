import React, { useEffect } from 'react';
import { X, Sparkles, KeyRound, ExternalLink } from 'lucide-react';
import { useI18n } from '../../i18n';
import { useLicense } from '../../contexts/LicenseContext';
import { EDITION_CONFIG } from '../../config/edition';
import { openExternalUrl } from '../../lib/ipc';

interface ProUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLicenseModal: () => void;
  featureName?: string | null;
}

export const ProUpsellModal: React.FC<ProUpsellModalProps> = ({
  isOpen,
  onClose,
  onOpenLicenseModal,
  featureName
}) => {
  const { t } = useI18n();

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 text-center">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            {t.license.proFeaturesTitle}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {t.license.trialExhausted}
          </p>
        </div>

        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
          {t.license.upsellDesc.replace('{feature}', featureName || t.license.proFeaturesTitle)}
        </p>

        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={() => {
              void openExternalUrl(EDITION_CONFIG.creemCheckoutUrl);
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-1.5 transition-all"
          >
            <span>{t.license.buyPro}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenLicenseModal();
            }}
            className="w-full py-2 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{t.license.activatePro}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-1.5 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          >
            {t.license.continueReading}
          </button>
        </div>
      </div>
    </div>
  );
};

export interface ProFeatureGateProps {
  featureName: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProFeatureGate: React.FC<ProFeatureGateProps> = ({
  children,
  fallback = null
}) => {
  const { isPro, trialRemaining } = useLicense();
  if (isPro || trialRemaining > 0) {
    return <>{children}</>;
  }
  return <>{fallback}</>;
};
