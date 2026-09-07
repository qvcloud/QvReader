import { getAppVersion, getPreferences, savePreferences } from '../lib/ipc';
import { isNewerVersion } from '../lib/version';
import { UpdateCheckResult, UpdateManifest } from '../types/updater';

export const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours
export const UPDATE_MANIFEST_URL = 'https://qvreader.com/api/version';
export const STATIC_FALLBACK_URL = 'https://qvreader.com/api/version.json';

/**
 * Checks for updates against the official version manifest endpoint.
 *
 * @param options.force - If true, bypasses the 24-hour interval check (used for manual checks).
 *                        If false, respects 24-hour interval and fails silently on network errors.
 */
export async function checkForUpdates(options: { force?: boolean } = {}): Promise<UpdateCheckResult> {
  const versionInfo = await getAppVersion();
  const currentVersion = versionInfo.version;

  let prefs = await getPreferences();

  // If not a manual check, enforce preferences and 24-hour interval
  if (!options.force) {
    if (prefs.autoCheckUpdate === false) {
      return { status: 'idle', currentVersion };
    }

    const lastCheck = prefs.lastUpdateCheck;
    if (lastCheck && Date.now() - lastCheck < CHECK_INTERVAL_MS) {
      return { status: 'idle', currentVersion };
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4500);

  let manifest: UpdateManifest | null = null;

  try {
    const res = await fetch(UPDATE_MANIFEST_URL, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      manifest = (await res.json()) as UpdateManifest;
    } else {
      // Try static fallback
      const fallbackRes = await fetch(STATIC_FALLBACK_URL, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      if (fallbackRes.ok) {
        manifest = (await fallbackRes.json()) as UpdateManifest;
      }
    }
  } catch (err: any) {
    if (options.force) {
      return {
        status: 'error',
        currentVersion,
        errorMessage: err?.message || 'Network connection failed',
      };
    }
    // Background check: fail 100% silently per Constitution Principle III
    return { status: 'idle', currentVersion };
  } finally {
    clearTimeout(timeoutId);
  }

  if (!manifest || !manifest.version) {
    if (options.force) {
      return {
        status: 'error',
        currentVersion,
        errorMessage: 'Invalid version manifest received',
      };
    }
    return { status: 'idle', currentVersion };
  }

  // Update lastUpdateCheck in preferences
  try {
    prefs = {
      ...prefs,
      lastUpdateCheck: Date.now(),
    };
    await savePreferences(prefs);
  } catch (e) {
    console.warn('Failed to save lastUpdateCheck in preferences:', e);
  }

  const hasNewRelease = isNewerVersion(manifest.version, currentVersion);

  if (hasNewRelease) {
    return {
      status: 'available',
      currentVersion,
      latestVersion: manifest.version,
      manifest,
    };
  }

  return {
    status: 'up-to-date',
    currentVersion,
    latestVersion: manifest.version,
    manifest,
  };
}

/**
 * Snooze update notifications for 24 hours by recording the current timestamp.
 */
export async function snoozeUpdate(): Promise<void> {
  try {
    const prefs = await getPreferences();
    await savePreferences({
      ...prefs,
      lastUpdateCheck: Date.now(),
    });
  } catch (e) {
    console.warn('Failed to snooze update:', e);
  }
}
