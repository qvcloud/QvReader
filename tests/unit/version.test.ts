import { describe, it, expect } from 'vitest';
import { compareSemVer, isNewerVersion, parseSemVer } from '../../src/lib/version';

describe('SemVer Utility (parseSemVer, compareSemVer, isNewerVersion)', () => {
  it('parses valid semantic version strings correctly', () => {
    expect(parseSemVer('1.0.0')).toEqual({ major: 1, minor: 0, patch: 0, prerelease: undefined });
    expect(parseSemVer('v1.2.3')).toEqual({ major: 1, minor: 2, patch: 3, prerelease: undefined });
    expect(parseSemVer('V2.10.4-beta.1')).toEqual({ major: 2, minor: 10, patch: 4, prerelease: 'beta.1' });
    expect(parseSemVer('0.1')).toEqual({ major: 0, minor: 1, patch: 0, prerelease: undefined });
    expect(parseSemVer('')).toBeNull();
    expect(parseSemVer('not-a-version')).toBeNull();
  });

  it('correctly compares version numbers adhering to SemVer', () => {
    // Newer patch
    expect(compareSemVer('1.0.1', '1.0.0')).toBe(1);
    expect(compareSemVer('1.0.0', '1.0.1')).toBe(-1);

    // Multi-digit numbers
    expect(compareSemVer('1.0.10', '1.0.9')).toBe(1);
    expect(compareSemVer('1.0.9', '1.0.10')).toBe(-1);

    // Newer minor
    expect(compareSemVer('1.1.0', '1.0.99')).toBe(1);
    expect(compareSemVer('1.0.99', '1.1.0')).toBe(-1);

    // Newer major
    expect(compareSemVer('2.0.0', '1.9.9')).toBe(1);
    expect(compareSemVer('1.9.9', '2.0.0')).toBe(-1);

    // Equal versions (including leading v)
    expect(compareSemVer('v1.0.0', '1.0.0')).toBe(0);
    expect(compareSemVer('1.2.3', '1.2.3')).toBe(0);

    // Prerelease comparison
    expect(compareSemVer('1.0.0', '1.0.0-rc1')).toBe(1);
    expect(compareSemVer('1.0.0-rc1', '1.0.0')).toBe(-1);
  });

  it('determines if remote version is strictly newer via isNewerVersion', () => {
    expect(isNewerVersion('1.0.1', '1.0.0')).toBe(true);
    expect(isNewerVersion('v1.1.0', '1.0.0')).toBe(true);
    expect(isNewerVersion('1.0.0', '1.0.0')).toBe(false);
    expect(isNewerVersion('0.9.0', '1.0.0')).toBe(false);
    expect(isNewerVersion('invalid', '1.0.0')).toBe(false);
  });
});
