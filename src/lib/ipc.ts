import { DocumentModel, FileEncoding, LineEnding, PathKind, UserPreferences, WorkspaceNode } from '../types/document';
import { InitialLaunchData } from '../types/startup';

// Check if running inside Tauri runtime
export const isTauri = () => {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
};

// Cached invoke function to eliminate dynamic import overhead on every call
let cachedInvoke: (<T>(cmd: string, args?: Record<string, unknown>) => Promise<T>) | null = null;
export async function getInvoke(): Promise<(<T>(cmd: string, args?: Record<string, unknown>) => Promise<T>) | null> {
  if (!cachedInvoke && isTauri()) {
    const { invoke } = await import('@tauri-apps/api/core');
    cachedInvoke = invoke;
  }
  return cachedInvoke;
}

// Fallback in-memory state for browser development or unit testing
let mockDoc: DocumentModel = {
  filePath: '/mock/welcome.md',
  fileName: 'welcome.md',
  rawContent: `# Welcome to QvReader

QvReader is a ~5MB instant Markdown viewer & lightweight editor.

## Key Bindings
- **Double click**: Open any \`.md\` file in reading view.
- **Esc**: Instantly close window.
- **F2**: In-place inline edit.
- **F3**: Synchronized split view (editor + live preview).
- **Ctrl/Cmd+S**: Save file preserving original line endings & encoding.

### Math Support
Inline: $E = mc^2$ and block math:
$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

### GFM Checklist
- [x] Lightweight by default
- [x] Markdown fidelity
- [x] 100% Offline with zero telemetry
- [ ] Try editing with F2 or F3!
`,
  diskContent: '',
  isDirty: false,
  lineEnding: 'LF',
  encoding: 'UTF-8',
  isReadOnly: false,
  diskHash: 'mock-hash-123'
};
mockDoc.diskContent = mockDoc.rawContent;

/** Unified single-roundtrip startup data bootstrap */
export async function getInitialLaunchData(): Promise<InitialLaunchData> {
  if (isTauri()) {
    const invoke = await getInvoke();
    if (invoke) {
      return invoke<InitialLaunchData>('get_initial_launch_data');
    }
  }
  return {
    launchMode: 'empty',
    targetPath: null,
    document: null,
    preferences: {
      theme: 'system',
      fontSize: 15,
      fontFamily: 'sans-serif',
      isOutlinePinned: false,
      recentFiles: []
    },
    isProLicensed: false
  };
}

/** Explicitly surface window after initial paint */
export async function showWindow(): Promise<void> {
  if (isTauri()) {
    const invoke = await getInvoke();
    if (invoke) {
      return invoke('show_window');
    }
  }
}

export async function openFile(path: string): Promise<DocumentModel> {
  if (isTauri()) {
    const invoke = await getInvoke();
    if (invoke) {
      return invoke<DocumentModel>('open_file', { path });
    }
  }
  return { ...mockDoc, filePath: path, fileName: path.split('/').pop() || 'document.md' };
}

export async function saveFile(
  filePath: string,
  content: string,
  lineEnding: LineEnding,
  encoding: FileEncoding
): Promise<{ success: boolean; diskHash: string }> {
  if (isTauri()) {
    const invoke = await getInvoke();
    if (invoke) {
      return invoke<{ success: boolean; diskHash: string }>('save_file', {
        filePath,
        content,
        lineEnding,
        encoding
      });
    }
  }
  mockDoc.rawContent = content;
  mockDoc.diskContent = content;
  mockDoc.isDirty = false;
  return { success: true, diskHash: 'mock-hash-updated' };
}

export async function showOpenDialog(): Promise<string | null> {
  if (isTauri()) {
    const invoke = await getInvoke();
    if (invoke) {
      return invoke<string | null>('show_open_dialog');
    }
  }
  return null;
}

export async function closeWindow(force: boolean = false): Promise<void> {
  if (isTauri()) {
    const invoke = await getInvoke();
    if (invoke) {
      return invoke('close_window', { force });
    }
  }
  console.log('[Mock IPC] closeWindow called with force:', force);
}

export async function setWindowTitle(title: string): Promise<void> {
  if (isTauri()) {
    const invoke = await getInvoke();
    if (invoke) {
      return invoke('set_window_title', { title });
    }
  }
  if (typeof document !== 'undefined') {
    document.title = title;
  }
}

export async function getPreferences(): Promise<UserPreferences> {
  if (isTauri()) {
    const invoke = await getInvoke();
    if (invoke) {
      return invoke<UserPreferences>('get_preferences');
    }
  }
  return {
    theme: 'system',
    fontSize: 15,
    fontFamily: 'sans-serif',
    isOutlinePinned: false,
    recentFiles: []
  };
}

export async function savePreferences(prefs: UserPreferences): Promise<{ success: boolean }> {
  if (isTauri()) {
    const invoke = await getInvoke();
    if (invoke) {
      return invoke<{ success: boolean }>('save_preferences', { prefs });
    }
  }
  return { success: true };
}

export async function getInitialFile(): Promise<string | null> {
  if (isTauri()) {
    const invoke = await getInvoke();
    if (invoke) {
      return invoke<string | null>('get_initial_file');
    }
  }
  return null;
}

export async function showSaveDialog(defaultName?: string): Promise<string | null> {
  if (isTauri()) {
    const invoke = await getInvoke();
    if (invoke) {
      return invoke<string | null>('show_save_dialog', { defaultName });
    }
  }
  return null;
}

export async function revealInFinder(path: string): Promise<void> {
  if (isTauri()) {
    const invoke = await getInvoke();
    if (invoke) {
      return invoke('reveal_in_finder', { path });
    }
  }
  console.log('[Mock IPC] revealInFinder called for path:', path);
}

/** Classify whether a path is a file, directory, or missing (see Rust). */
export async function classifyPath(path: string): Promise<PathKind> {
  if (isTauri()) {
    const invoke = await getInvoke();
    if (invoke) {
      return invoke<PathKind>('classify_path', { path });
    }
  }
  // Browser/mock: treat the sample file as a file.
  return path.endsWith('/') ? 'directory' : 'file';
}

/** Scan a folder and return its Markdown file tree (root node first). */
export async function scanDirectory(root: string): Promise<WorkspaceNode[]> {
  if (isTauri()) {
    const invoke = await getInvoke();
    if (invoke) {
      return invoke<WorkspaceNode[]>('scan_directory', { root });
    }
  }
  return [
    {
      name: root.split('/').pop() || root,
      path: root,
      relativePath: '',
      isDir: true,
      children: []
    }
  ];
}

/** Open external URL in system browser reliably using plugin-shell */
export async function openExternalUrl(url: string): Promise<void> {
  if (isTauri()) {
    try {
      const { open } = await import('@tauri-apps/plugin-shell');
      await open(url);
      return;
    } catch (e) {
      console.warn('Failed to open URL via plugin-shell:', e);
    }
  }
  window.open(url, '_blank');
}

/** Check if the `qvreader` CLI command is installed in PATH */
export async function isCliInstalled(): Promise<boolean> {
  if (isTauri()) {
    const invoke = await getInvoke();
    if (invoke) {
      return invoke<boolean>('is_cli_installed');
    }
  }
  return false;
}

/** Install the `qvreader` CLI command */
export async function installCli(): Promise<string> {
  if (isTauri()) {
    const invoke = await getInvoke();
    if (invoke) {
      return invoke<string>('install_cli');
    }
  }
  return '~/.local/bin/qvreader';
}

/** Uninstall the `qvreader` CLI command */
export async function uninstallCli(): Promise<void> {
  if (isTauri()) {
    const invoke = await getInvoke();
    if (invoke) {
      return invoke<void>('uninstall_cli');
    }
  }
}

// --- Version & Runtime Information IPC ---
import { AppVersionInfo } from '../types/updater';

let mockAppVersion: AppVersionInfo = {
  version: '1.0.0',
  buildType: 'release',
  platform: typeof navigator !== 'undefined' && navigator.userAgent.includes('Mac') ? 'macos' : 'windows',
  arch: 'arm64'
};

/** Get desktop app runtime version information */
export async function getAppVersion(): Promise<AppVersionInfo> {
  if (isTauri()) {
    try {
      const invoke = await getInvoke();
      if (invoke) {
        return await invoke<AppVersionInfo>('get_app_version');
      }
    } catch (e) {
      console.warn('Failed to invoke get_app_version, using fallback:', e);
    }
  }
  return mockAppVersion;
}

// --- Licensing & Entitlements IPC ---

import {
  ActivateLicenseResponse,
  DeactivateLicenseResponse,
  LicenseInfoResponse,
  RecordTrialResponse
} from '../types/license';

let mockLicenseInfo: LicenseInfoResponse = {
  tier: 'trial',
  isPro: false,
  trialUsed: 0,
  trialMax: 300,
  customerEmail: null,
  expiresAt: null,
  deviceFingerprint: 'mock-browser-device-fingerprint'
};

/** Get current license info and trial status */
export async function getLicenseInfo(): Promise<LicenseInfoResponse> {
  if (isTauri()) {
    const invoke = await getInvoke();
    if (invoke) {
      return invoke<LicenseInfoResponse>('get_license_info');
    }
  }
  return { ...mockLicenseInfo };
}

/** Activate Pro license with Creem key */
export async function activateLicense(licenseKey: string): Promise<ActivateLicenseResponse> {
  if (isTauri()) {
    const invoke = await getInvoke();
    if (invoke) {
      return invoke<ActivateLicenseResponse>('activate_license', { licenseKey });
    }
  }
  if (licenseKey.trim().length >= 10 && !licenseKey.includes('INVALID') && !licenseKey.includes('FAIL')) {
    mockLicenseInfo.isPro = true;
    mockLicenseInfo.tier = 'pro';
    mockLicenseInfo.customerEmail = 'pro@qvreader.com';
    return {
      success: true,
      tier: 'pro',
      message: 'Mock activation successful',
      entitlement: {
        schemaVersion: 1,
        entitlementId: 'ent_mock_dev_001',
        edition: 'pro',
        deviceIdHash: mockLicenseInfo.deviceFingerprint,
        issuedAt: Math.floor(Date.now() / 1000),
        expiresAt: null,
        issuer: 'qvreader',
        keyId: 'qv-test-key-1',
        signature: 'mock_signature_hex'
      }
    };
  }
  return { success: false, error: 'Invalid license key format or activation failed' };
}

/** Deactivate Pro license on current machine */
export async function deactivateLicense(): Promise<DeactivateLicenseResponse> {
  if (isTauri()) {
    const invoke = await getInvoke();
    if (invoke) {
      return invoke<DeactivateLicenseResponse>('deactivate_license');
    }
  }
  mockLicenseInfo.isPro = false;
  mockLicenseInfo.tier = 'community';
  mockLicenseInfo.customerEmail = null;
  return { success: true };
}

/** Record a trial editing session and return allowance */
export async function recordTrialSession(): Promise<RecordTrialResponse> {
  if (isTauri()) {
    const invoke = await getInvoke();
    if (invoke) {
      return invoke<RecordTrialResponse>('record_trial_session');
    }
  }
  if (mockLicenseInfo.isPro) {
    return { allowed: true, remaining: 300 };
  }
  if (mockLicenseInfo.trialUsed < mockLicenseInfo.trialMax) {
    mockLicenseInfo.trialUsed += 1;
    const remaining = mockLicenseInfo.trialMax - mockLicenseInfo.trialUsed;
    return { allowed: true, remaining };
  }
  return { allowed: false, remaining: 0 };
}

/** Trigger native system print or window.print fallback */
export async function printDocument(): Promise<void> {
  if (isTauri()) {
    try {
      const invoke = await getInvoke();
      if (invoke) {
        await invoke('print_document');
        return;
      }
    } catch (err) {
      console.warn('Native print command error, falling back to window.print():', err);
    }
  }
  window.print();
}
