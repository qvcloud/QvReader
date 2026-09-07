import React, { useState, useEffect } from 'react';
import {
  X,
  Settings,
  Globe,
  Type,
  ShieldCheck,
  Info,
  Sun,
  Moon,
  Monitor,
  Check,
  ChevronDown,
  Sparkles,
  RefreshCw,
  Download,
  AlertCircle
} from 'lucide-react';
import { useI18n, LOCALE_OPTIONS, SupportedLocale } from '../../i18n';
import { UserPreferences } from '../../types/document';
import { openExternalUrl, isCliInstalled, installCli, uninstallCli, getAppVersion } from '../../lib/ipc';
import { useLicense } from '../../contexts/LicenseContext';
import { AppVersionInfo, UpdateCheckResult } from '../../types/updater';
import { checkForUpdates } from '../../services/updater';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLicense?: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (updater: Partial<UserPreferences>) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  onResetFontSize: () => void;
}

type SettingsTab = 'general' | 'typography' | 'fidelity' | 'about';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onOpenLicense,
  preferences,
  onUpdatePreferences,
  fontSize,
  onFontSizeChange,
  onResetFontSize
}) => {
  const { locale, setLocale, t } = useI18n();
  const { isPro, trialRemaining } = useLicense();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [cliInstalled, setCliInstalled] = useState<boolean>(false);
  const [isCliBusy, setIsCliBusy] = useState<boolean>(false);
  const [cliMessage, setCliMessage] = useState<string>('');
  const [versionInfo, setVersionInfo] = useState<AppVersionInfo | null>(null);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState<boolean>(false);
  const [updateResult, setUpdateResult] = useState<UpdateCheckResult | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    void getAppVersion().then(setVersionInfo);
    void isCliInstalled().then(setCliInstalled);
    let unlisten: (() => void) | undefined;
    import('@tauri-apps/api/event').then(({ listen }) => {
      listen('cli-status-changed', () => {
        void isCliInstalled().then(setCliInstalled);
      }).then((fn) => {
        unlisten = fn;
      });
    });
    return () => {
      if (unlisten) unlisten();
    };
  }, [isOpen]);

  const handleToggleCli = async () => {
    setIsCliBusy(true);
    setCliMessage('');
    try {
      if (cliInstalled) {
        await uninstallCli();
        setCliInstalled(false);
        setCliMessage(t.settingsModal.cliUninstalled);
      } else {
        const path = await installCli();
        setCliInstalled(true);
        setCliMessage(t.settingsModal.cliReady.replace('{path}', path));
      }
    } catch (e: any) {
      setCliMessage(t.settingsModal.cliFailed.replace('{error}', e?.message || String(e)));
    } finally {
      setIsCliBusy(false);
    }
  };

  const handleCheckUpdates = async () => {
    setIsCheckingUpdate(true);
    setUpdateResult(null);
    try {
      const res = await checkForUpdates({ force: true });
      setUpdateResult(res);
    } catch (e: any) {
      setUpdateResult({
        status: 'error',
        currentVersion: versionInfo?.version || '1.0.0',
        errorMessage: e?.message || 'Error',
      });
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  // Keyboard shortcut Esc to close
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

  const tabs = [
    { id: 'general' as SettingsTab, label: t.settingsModal.tabGeneral, icon: Globe },
    { id: 'typography' as SettingsTab, label: t.settingsModal.tabTypography, icon: Type },
    { id: 'fidelity' as SettingsTab, label: t.settingsModal.tabFidelity, icon: ShieldCheck },
    { id: 'about' as SettingsTab, label: t.settingsModal.tabAbout, icon: Info }
  ];

  const themeOptions = [
    { value: 'system', label: t.common.themeSystem, icon: Monitor },
    { value: 'light', label: t.common.themeLight, icon: Sun },
    { value: 'dark', label: t.common.themeDark, icon: Moon }
  ];

  const fontOptions = [
    { value: 'sans-serif', label: t.settingsModal.fontSans, sample: 'Aa Bb Gg 123 中文' },
    { value: 'monospace', label: t.settingsModal.fontMono, sample: 'const qv = new QvReader();' },
    { value: 'serif', label: t.settingsModal.fontSerif, sample: 'Typography & Editorial' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl h-[520px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {t.settingsModal.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            title="Esc"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Left Tab Sidebar + Right Tab Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Tabs */}
          <div className="w-48 border-r border-zinc-200 dark:border-zinc-800 p-3 space-y-1 bg-zinc-50/50 dark:bg-zinc-900/50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* GENERAL TAB */}
            {activeTab === 'general' && (
              <div className="space-y-6 animate-in fade-in duration-100">
                {/* Language Selection */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">
                      {t.settingsModal.language}
                    </label>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {t.settingsModal.languageDesc}
                    </p>
                  </div>

                  <div className="relative shrink-0">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
                      <Globe className="w-3.5 h-3.5" />
                    </div>
                    <select
                      value={locale}
                      onChange={(e) => {
                        const code = e.target.value as SupportedLocale;
                        setLocale(code);
                        onUpdatePreferences({ locale: code });
                      }}
                      className="appearance-none pl-8 pr-8 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition shadow-sm"
                    >
                      {LOCALE_OPTIONS.map((item) => (
                        <option
                          key={item.code}
                          value={item.code}
                          className="bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                        >
                          {item.nativeLabel} · {item.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* CLI Tool */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <label className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        {t.settingsModal.cliTool}
                      </label>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          cliInstalled
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
                            : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cliInstalled ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
                        {cliInstalled ? t.settingsModal.cliInstalled : t.settingsModal.cliNotInstalled}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {t.settingsModal.cliToolDesc}
                    </p>
                    {cliMessage && (
                      <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 truncate">
                        {cliMessage}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={isCliBusy}
                    onClick={handleToggleCli}
                    className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      cliInstalled
                        ? 'bg-zinc-100 hover:bg-red-50 hover:text-red-600 dark:bg-zinc-800 dark:hover:bg-red-950/40 dark:hover:text-red-400 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                    }`}
                  >
                    {cliInstalled ? t.settingsModal.cliUninstall : t.settingsModal.cliInstall}
                  </button>
                </div>

                {/* Theme Selection */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                  <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    {t.settingsModal.theme}
                  </label>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                    {t.settingsModal.themeDesc}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {themeOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = preferences.theme === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => onUpdatePreferences({ theme: opt.value as any })}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-xs font-medium transition cursor-pointer ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-semibold shadow-sm'
                              : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TYPOGRAPHY TAB */}
            {activeTab === 'typography' && (
              <div className="space-y-6 animate-in fade-in duration-100">
                {/* Font Size */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      {t.settingsModal.fontSize}
                    </label>
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                      {fontSize}px
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                    {t.settingsModal.fontSizeDesc}
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={12}
                      max={26}
                      step={1}
                      value={fontSize}
                      onChange={(e) => onFontSizeChange(Number(e.target.value))}
                      className="flex-1 accent-blue-600 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <button
                      onClick={onResetFontSize}
                      className="px-2.5 py-1 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition"
                    >
                      {t.common.resetZoom}
                    </button>
                  </div>
                </div>

                {/* Font Family */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                  <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    {t.settingsModal.fontFamily}
                  </label>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                    {t.settingsModal.fontFamilyDesc}
                  </p>
                  <div className="space-y-2">
                    {fontOptions.map((opt) => {
                      const isSelected = preferences.fontFamily === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => onUpdatePreferences({ fontFamily: opt.value })}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition text-left ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-semibold'
                              : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                          }`}
                        >
                          <div>
                            <div>{opt.label}</div>
                            <div className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5" style={{ fontFamily: opt.value }}>
                              {opt.sample}
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Reading Area Width */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                  <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    {t.settingsModal.readingWidth}
                  </label>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                    {t.settingsModal.readingWidthDesc}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        value: 'adaptive',
                        label: t.settingsModal.readingWidthAdaptive,
                        desc: t.settingsModal.readingWidthAdaptiveDesc
                      },
                      {
                        value: 'standard',
                        label: t.settingsModal.readingWidthStandard,
                        desc: t.settingsModal.readingWidthStandardDesc
                      },
                      {
                        value: 'full',
                        label: t.settingsModal.readingWidthFull,
                        desc: t.settingsModal.readingWidthFullDesc
                      }
                    ].map((opt) => {
                      const isSelected = (preferences.readingWidth || 'adaptive') === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => onUpdatePreferences({ readingWidth: opt.value as any })}
                          className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-semibold shadow-sm'
                              : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-medium flex items-center justify-between">
                              <span>{opt.label}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
                            </div>
                            <div className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 leading-relaxed font-normal">
                              {opt.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Word Wrap */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <label className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      {t.settingsModal.wordWrap}
                    </label>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {t.settingsModal.wordWrapDesc}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.wordWrap !== false}
                    onChange={(e) => onUpdatePreferences({ wordWrap: e.target.checked })}
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* FIDELITY TAB */}
            {activeTab === 'fidelity' && (
              <div className="space-y-5 animate-in fade-in duration-100">
                <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-blue-900 dark:text-blue-200">
                        {t.settingsModal.preserveLineEndings}
                      </h4>
                      <p className="text-xs text-blue-700/80 dark:text-blue-300/80 mt-1">
                        {t.settingsModal.preserveLineEndingsDesc}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      {t.settingsModal.fidelityLineEndings}
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {t.settingsModal.fidelityLineEndingsDesc}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    {t.settingsModal.fidelityLineEndingsBadge}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      {t.settingsModal.fidelityEncoding}
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {t.settingsModal.fidelityEncodingDesc}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    {t.settingsModal.fidelityEncodingBadge}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      {t.settingsModal.fidelityHotReload}
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {t.settingsModal.fidelityHotReloadDesc}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                    {t.settingsModal.fidelityHotReloadBadge}
                  </span>
                </div>
              </div>
            )}

            {/* ABOUT TAB */}
            {activeTab === 'about' && (
              <div className="space-y-6 text-center py-4 animate-in fade-in duration-100">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-lg mb-2">
                  <span className="text-3xl font-black bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    Qv
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    QvReader
                  </h3>
                  <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500 mt-0.5">
                    {t.settingsModal.version} {versionInfo ? `v${versionInfo.version} (${versionInfo.platform}/${versionInfo.arch})` : 'v1.0.0'}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-2.5">
                    {isPro ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        {t.license.proEdition} · {t.license.activeBadge}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          if (onOpenLicense) onOpenLicense();
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>{t.license.communityEdition} · {trialRemaining > 0 ? t.license.trialRemaining.replace('{count}', String(trialRemaining)) : t.license.freeTier}</span>
                        <span className="text-[11px] font-semibold underline ml-1">{t.license.activatePro}</span>
                      </button>
                    )}
                  </div>

                  {/* Manual Check for Updates */}
                  <div className="mt-3.5 flex flex-col items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCheckUpdates}
                      disabled={isCheckingUpdate}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 transition disabled:opacity-60 cursor-pointer shadow-xs"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isCheckingUpdate ? 'animate-spin text-blue-500' : 'text-zinc-400'}`} />
                      <span>{isCheckingUpdate ? t.updater.checking : t.updater.checkUpdates}</span>
                    </button>

                    {updateResult && (
                      <div className="animate-in fade-in duration-150">
                        {updateResult.status === 'up-to-date' && (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            <Check className="w-3.5 h-3.5" />
                            {t.updater.upToDate.replace('{version}', updateResult.latestVersion || versionInfo?.version || '')}
                          </span>
                        )}
                        {updateResult.status === 'available' && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                              {t.updater.updateAvailable.replace('{version}', updateResult.latestVersion || '')}
                            </span>
                            <button
                              type="button"
                              onClick={() => void openExternalUrl(updateResult.manifest?.downloadUrl || 'https://qvreader.com/#download')}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition"
                            >
                              <Download className="w-3 h-3" />
                              <span>{t.updater.downloadUpdate}</span>
                            </button>
                          </div>
                        )}
                        {updateResult.status === 'error' && (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            {t.updater.checkFailed}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="max-w-sm mx-auto space-y-1">
                  <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    {t.settingsModal.tagline}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {t.settingsModal.offlinePromise}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => void openExternalUrl('https://qvreader.com')}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 transition cursor-pointer"
                  >
                    {t.settingsModal.officialWebsite}
                  </button>
                  <button
                    type="button"
                    onClick={() => void openExternalUrl('https://github.com/qvcloud/QvReader')}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition cursor-pointer"
                  >
                    {t.settingsModal.githubRepo}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition"
          >
            {t.settingsModal.close}
          </button>
        </div>
      </div>
    </div>
  );
};
