import { describe, it, expect, beforeEach } from 'vitest';
import { getLicenseInfo, recordTrialSession, deactivateLicense } from '../../src/lib/ipc';

describe('Trial Quota & Non-Blocking Save Unit Tests', () => {
  beforeEach(async () => {
    await deactivateLicense();
  });

  it('initializes trial with 300 sessions allowed', async () => {
    const info = await getLicenseInfo();
    expect(info.trialMax).toBe(300);
    expect(info.trialUsed).toBeGreaterThanOrEqual(0);
  });

  it('decrements quota on each recorded trial session', async () => {
    const res1 = await recordTrialSession();
    expect(res1.allowed).toBe(true);

    const res2 = await recordTrialSession();
    expect(res2.allowed).toBe(true);
    expect(res2.remaining).toBeLessThan(res1.remaining);
  });

  it('stops allowing new sessions once quota is exhausted without affecting reading', async () => {
    // Consume quota until 0 remaining
    let current = await recordTrialSession();
    while (current.allowed && current.remaining > 0) {
      current = await recordTrialSession();
    }

    // Now quota is exhausted
    const exhaustedRes = await recordTrialSession();
    expect(exhaustedRes.allowed).toBe(false);
    expect(exhaustedRes.remaining).toBe(0);

    // Reading mode info is still cleanly accessible
    const info = await getLicenseInfo();
    expect(info).toBeDefined();
    expect(info.isPro).toBe(false);
  });
});
