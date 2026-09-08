import { EDITION_CONFIG } from './edition';

/**
 * Centralized Client Application Version & Display Constants
 *
 * CLIENT_VERSION is injected at build/test time from git (see vite.config.ts
 * `define` + scripts/derive-version.mjs). Do NOT hardcode a literal here — the
 * version lives only in the git tag (release.sh auto-derives the next tag).
 */
declare const __CLIENT_VERSION__: string;
export const CLIENT_VERSION: string = __CLIENT_VERSION__;
export const APP_BASE_NAME = 'QvReader';
export const APP_DISPLAY_NAME =
  EDITION_CONFIG.isCommunityBuild && !EDITION_CONFIG.isDevOrTest
    ? `${APP_BASE_NAME} (Community Build) v${CLIENT_VERSION}`
    : `${APP_BASE_NAME} v${CLIENT_VERSION}`;

/**
 * Format document window title adhering to contracts/window-title.md
 *
 * Rules:
 * - Empty / Untitled: `Untitled.md - QvReader v0.1.3`
 * - Named file: `${dirtyPrefix}${fileName} - QvReader v0.1.3`
 * - Workspace file: `${dirtyPrefix}${fileName} — ${projectName} - QvReader v0.1.3`
 */
export function formatWindowTitle(options: {
  fileName?: string | null;
  projectName?: string | null;
  isDirty?: boolean;
  hasFilePath?: boolean;
}): string {
  const { fileName, projectName, isDirty = false, hasFilePath = false } = options;
  const dirtyPrefix = isDirty ? '• ' : '';
  const effectiveFileName = fileName || 'Untitled.md';

  if (projectName) {
    if (hasFilePath || (fileName && fileName !== 'Untitled.md')) {
      return `${dirtyPrefix}${effectiveFileName} — ${projectName} - ${APP_DISPLAY_NAME}`;
    }
    return `${projectName} - ${APP_DISPLAY_NAME}`;
  }

  return `${dirtyPrefix}${effectiveFileName} - ${APP_DISPLAY_NAME}`;
}
