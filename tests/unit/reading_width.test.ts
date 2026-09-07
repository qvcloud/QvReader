import { describe, it, expect } from 'vitest';
import { UserPreferences, ReadingWidth } from '../../src/types/document';

describe('Reading Width Layout Configuration', () => {
  it('should support adaptive, standard, and full reading widths', () => {
    const validWidths: ReadingWidth[] = ['adaptive', 'standard', 'full'];
    validWidths.forEach((w) => {
      const prefs: UserPreferences = {
        theme: 'system',
        fontSize: 15,
        fontFamily: 'sans-serif',
        readingWidth: w,
        isOutlinePinned: false,
        recentFiles: []
      };
      expect(prefs.readingWidth).toBe(w);
    });
  });

  it('should fallback to adaptive when readingWidth is undefined or null', () => {
    const prefs: UserPreferences = {
      theme: 'system',
      fontSize: 15,
      fontFamily: 'sans-serif',
      isOutlinePinned: false,
      recentFiles: []
    };
    const activeWidth = prefs.readingWidth || 'adaptive';
    expect(activeWidth).toBe('adaptive');
  });
});
