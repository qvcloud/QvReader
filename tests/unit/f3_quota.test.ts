import { describe, it, expect, beforeEach } from 'vitest';
import { getF3DailyUsage, recordF3DailyUsage, F3_DAILY_LIMIT } from '../../src/services/f3Quota';

// Simple in-memory localStorage mock for node test runner
if (typeof globalThis.localStorage === 'undefined' || typeof globalThis.localStorage.clear !== 'function') {
  const store: Record<string, string> = {};
  (globalThis as any).localStorage = {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = String(value); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => {
      for (const k of Object.keys(store)) {
        delete store[k];
      }
    }
  };
}

describe('F3 Daily Quota Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with full daily quota of 20 uses', () => {
    const usage = getF3DailyUsage();
    expect(usage.count).toBe(0);
    expect(usage.remaining).toBe(F3_DAILY_LIMIT);
    expect(usage.exceeded).toBe(false);
  });

  it('increments usage and tracks remaining correctly up to 20', () => {
    for (let i = 1; i <= 20; i++) {
      const res = recordF3DailyUsage();
      expect(res.count).toBe(i);
      expect(res.remaining).toBe(20 - i);
      if (i < 20) {
        expect(res.exceeded).toBe(false);
      }
    }

    const finalUsage = getF3DailyUsage();
    expect(finalUsage.count).toBe(20);
    expect(finalUsage.remaining).toBe(0);
    expect(finalUsage.exceeded).toBe(true);
  });

  it('detects exceeded status beyond 20 uses without crashing', () => {
    for (let i = 1; i <= 25; i++) {
      recordF3DailyUsage();
    }
    const usage = getF3DailyUsage();
    expect(usage.count).toBe(25);
    expect(usage.remaining).toBe(0);
    expect(usage.exceeded).toBe(true);
  });

  it('automatically resets counter on a new day', () => {
    // Write yesterday data
    localStorage.setItem(
      'qvreader_f3_daily_quota',
      JSON.stringify({ date: '2020-01-01', count: 50 })
    );

    const usage = getF3DailyUsage();
    expect(usage.count).toBe(0);
    expect(usage.remaining).toBe(20);
    expect(usage.exceeded).toBe(false);
  });
});
