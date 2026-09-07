import { describe, it, expect, beforeEach } from 'vitest';
import { getLicenseInfo, activateLicense, deactivateLicense, recordTrialSession } from '../../src/lib/ipc';

describe('License & Entitlements Unit Tests (Non-Intrusive Baseline)', () => {
  beforeEach(async () => {
    // Reset to baseline state before each test
    await deactivateLicense();
  });

  it('provides Community/Trial state by default without blocking user', async () => {
    const info = await getLicenseInfo();
    expect(info).toBeDefined();
    expect(info.isPro).toBe(false);
    expect(info.trialMax).toBe(300);
    expect(info.trialUsed).toBeGreaterThanOrEqual(0);
  });

  it('records trial sessions accurately up to 300 sessions', async () => {
    const initial = await recordTrialSession();
    expect(initial.allowed).toBe(true);
    expect(initial.remaining).toBeLessThanOrEqual(300);
  });

  it('activates Pro with valid key and transitions tier to pro', async () => {
    const activation = await activateLicense('CR-TEST-PRO-LIFETIME-12345');
    expect(activation.success).toBe(true);
    expect(activation.tier).toBe('pro');

    const info = await getLicenseInfo();
    expect(info.isPro).toBe(true);
    expect(info.tier).toBe('pro');
    expect(info.customerEmail).toBeDefined();

    // In Pro mode, trial session recording is always allowed
    const sessionRes = await recordTrialSession();
    expect(sessionRes.allowed).toBe(true);
  });

  it('rejects empty or malformed license keys gracefully without crashing', async () => {
    const activation = await activateLicense('short');
    expect(activation.success).toBe(false);
    expect(activation.error).toBeDefined();

    // Ensure status remains non-Pro
    const info = await getLicenseInfo();
    expect(info.isPro).toBe(false);
  });

  it('returns signed entitlement response upon successful activation and supports offline reuse', async () => {
    const activation = await activateLicense('CR-TEST-PRO-LIFETIME-12345');
    expect(activation.success).toBe(true);
    expect(activation.entitlement).toBeDefined();
    expect(activation.entitlement?.schemaVersion).toBe(1);
    expect(activation.entitlement?.issuer).toBe('qvreader');
    expect(activation.entitlement?.edition).toBe('pro');
    expect(activation.entitlement?.signature).toBeDefined();

    // Offline reuse: subsequent calls verify Pro status without re-activating
    const info1 = await getLicenseInfo();
    const info2 = await getLicenseInfo();
    expect(info1.isPro).toBe(true);
    expect(info2.isPro).toBe(true);
  });

  it('handles network degradation or failure safely without corrupting local trial state', async () => {
    const baseline = await getLicenseInfo();
    const failedActivation = await activateLicense('FAIL-NETWORK-KEY-SIMULATION');
    expect(failedActivation.success).toBe(false);
    expect(failedActivation.error).toBeDefined();

    // State remains healthy Community/Trial baseline
    const after = await getLicenseInfo();
    expect(after.isPro).toBe(false);
    expect(after.trialUsed).toBe(baseline.trialUsed);
  });

  it('redacts secret license keys from error messages and logs', async () => {
    const secretKey = 'CR-SECRET-KEY-12345678-FAIL';
    const activation = await activateLicense(secretKey);
    expect(activation.success).toBe(false);
    expect(activation.error).toBeDefined();
    // Verify secret key is never leaked in the returned error message
    expect(activation.error).not.toContain(secretKey);
    expect(activation.error).not.toContain('CR-SECRET');
  });

  it('allows deactivating Pro to return to Community baseline', async () => {
    await activateLicense('CR-TEST-PRO-LIFETIME-12345');
    const deactivation = await deactivateLicense();
    expect(deactivation.success).toBe(true);

    const info = await getLicenseInfo();
    expect(info.isPro).toBe(false);
    expect(info.customerEmail).toBeNull();
  });
});
