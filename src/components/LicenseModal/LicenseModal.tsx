import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ExternalLink, Laptop, AlertCircle, Sparkles } from 'lucide-react';
import { useLicense } from '../../contexts/LicenseContext';
import { useI18n } from '../../i18n';
import { EDITION_CONFIG } from '../../config/edition';
import { openExternalUrl } from '../../lib/ipc';

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LicenseModal: React.FC<LicenseModalProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n();
  const {
    isPro,
    trialRemaining,
    trialMax,
    customerEmail,
    deviceFingerprint,
    activate,
    deactivate
  } = useLicense();

  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setLicenseKeyInput('');
      setErrorMessage(null);
      setSuccessMessage(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

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

  const handleActivate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanKey = licenseKeyInput.trim();
    if (!cleanKey) {
      setErrorMessage(t.license.invalidKey);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await activate(cleanKey);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage(t.license.activatedSuccess);
    } else {
      setErrorMessage(res.error || t.license.invalidKey);
    }
  };

  const handleDeactivate = async () => {
    if (!window.confirm(t.license.deactivateConfirm)) return;
    setIsSubmitting(true);
    await deactivate();
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {isPro ? t.license.proEdition : t.license.proFeaturesTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {isPro ? (
            /* Activated Pro State */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-emerald-900 dark:text-emerald-200">
                    {t.license.activatedSuccess}
                  </div>
                  {customerEmail && (
                    <div className="text-emerald-700 dark:text-emerald-300">
                      {customerEmail}
                    </div>
                  )}
                  <div className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">
                    {t.license.offlineReadyNotice}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/50 text-[11px] font-mono text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5 text-zinc-400" />
                  ID: {deviceFingerprint ? deviceFingerprint.slice(0, 16) + '...' : 'Local'}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-sans font-medium">
                  {t.license.activeBadge}
                </span>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleDeactivate}
                  disabled={isSubmitting}
                  className="text-xs text-rose-600 dark:text-rose-400 hover:underline"
                >
                  {t.license.deactivateButton}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:opacity-90 transition-opacity"
                >
                  {t.settingsModal.close}
                </button>
              </div>
            </div>
          ) : (
            /* Unactivated / Trial State */
            <div className="space-y-4">
              {/* Feature list */}
              <div className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                  <span>{t.license.proFeatureEdit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                  <span>{t.license.proFeatureSplit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                  <span>{t.license.proFeatureDiagram}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                  <span>{t.license.proFeatureWorkspace}</span>
                </div>
              </div>

              {/* Trial Status Badge */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
                <span>
                  {trialRemaining > 0
                    ? t.license.trialRemaining.replace('{count}', String(trialRemaining))
                    : t.license.trialExhausted}
                </span>
                <span className="font-mono font-medium text-[11px] px-1.5 py-0.5 rounded bg-amber-200/60 dark:bg-amber-900/60">
                  {trialRemaining}/{trialMax}
                </span>
              </div>

              {/* Buy Pro Button */}
              <button
                type="button"
                onClick={() => void openExternalUrl(EDITION_CONFIG.creemCheckoutUrl)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <span>{t.license.buyPro}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <div className="text-[11px] text-center text-zinc-400 dark:text-zinc-500">
                {t.license.pricingNote}
              </div>

              {/* Key Activation Form */}
              <form onSubmit={handleActivate} className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {t.license.enterKey}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={licenseKeyInput}
                    onChange={(e) => setLicenseKeyInput(e.target.value)}
                    placeholder={t.license.licenseKeyPlaceholder}
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !licenseKeyInput.trim()}
                    className="px-4 py-2 text-xs font-medium bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity whitespace-nowrap"
                  >
                    {isSubmitting ? t.license.activating : t.license.activateButton}
                  </button>
                </div>

                {errorMessage && (
                  <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
                {successMessage && (
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
