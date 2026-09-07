/**
 * Pure TypeScript Semantic Versioning (SemVer) comparison utility.
 * Lightweight by design (Constitution Principle I) without external dependencies.
 */

export interface ParsedSemVer {
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
}

/**
 * Parse a version string (e.g. "v1.2.3", "1.0.0-beta.1") into structured components.
 */
export function parseSemVer(versionStr: string): ParsedSemVer | null {
  if (!versionStr || typeof versionStr !== 'string') return null;

  const cleaned = versionStr.trim().replace(/^[vV]/, '');
  const [releasePart, prerelease] = cleaned.split('-', 2);
  const parts = releasePart.split('.');

  const major = parseInt(parts[0], 10);
  const minor = parts.length > 1 ? parseInt(parts[1], 10) : 0;
  const patch = parts.length > 2 ? parseInt(parts[2], 10) : 0;

  if (isNaN(major) || isNaN(minor) || isNaN(patch)) {
    return null;
  }

  return { major, minor, patch, prerelease };
}

/**
 * Compare two semantic version strings.
 * Returns:
 *   1  if v1 > v2
 *  -1  if v1 < v2
 *   0  if v1 == v2
 */
export function compareSemVer(v1: string, v2: string): number {
  const p1 = parseSemVer(v1);
  const p2 = parseSemVer(v2);

  if (!p1 && !p2) return 0;
  if (!p1) return -1;
  if (!p2) return 1;

  if (p1.major !== p2.major) {
    return p1.major > p2.major ? 1 : -1;
  }
  if (p1.minor !== p2.minor) {
    return p1.minor > p2.minor ? 1 : -1;
  }
  if (p1.patch !== p2.patch) {
    return p1.patch > p2.patch ? 1 : -1;
  }

  // Handle prerelease comparison: a version without a prerelease has higher precedence than one with
  // e.g. 1.0.0 > 1.0.0-rc1
  if (!p1.prerelease && p2.prerelease) return 1;
  if (p1.prerelease && !p2.prerelease) return -1;
  if (p1.prerelease && p2.prerelease) {
    return p1.prerelease.localeCompare(p2.prerelease);
  }

  return 0;
}

/**
 * Check if remoteVersion is strictly newer than currentVersion.
 */
export function isNewerVersion(remoteVersion: string, currentVersion: string): boolean {
  return compareSemVer(remoteVersion, currentVersion) > 0;
}
