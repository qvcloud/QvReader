const F3_STORAGE_KEY = 'qvreader_f3_daily_quota';
export const F3_DAILY_LIMIT = 20;

interface F3DailyRecord {
  date: string; // YYYY-MM-DD
  count: number;
}

function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getF3DailyUsage(): { count: number; remaining: number; exceeded: boolean } {
  try {
    const today = getTodayString();
    const raw = localStorage.getItem(F3_STORAGE_KEY);
    if (raw) {
      const data: F3DailyRecord = JSON.parse(raw);
      if (data.date === today) {
        const count = typeof data.count === 'number' ? data.count : 0;
        return {
          count,
          remaining: Math.max(0, F3_DAILY_LIMIT - count),
          exceeded: count >= F3_DAILY_LIMIT
        };
      }
    }
  } catch (e) {
    console.warn('Failed to read F3 daily quota from localStorage:', e);
  }

  return {
    count: 0,
    remaining: F3_DAILY_LIMIT,
    exceeded: false
  };
}

export function recordF3DailyUsage(): { count: number; remaining: number; exceeded: boolean } {
  const today = getTodayString();
  const current = getF3DailyUsage();
  const nextCount = current.count + 1;
  try {
    localStorage.setItem(
      F3_STORAGE_KEY,
      JSON.stringify({ date: today, count: nextCount })
    );
  } catch (e) {
    console.warn('Failed to save F3 daily quota to localStorage:', e);
  }

  return {
    count: nextCount,
    remaining: Math.max(0, F3_DAILY_LIMIT - nextCount),
    exceeded: nextCount >= F3_DAILY_LIMIT
  };
}
