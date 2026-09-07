import { describe, it, expect } from 'vitest';
import { en } from '../../src/i18n/locales/en';
import { zh } from '../../src/i18n/locales/zh';
import { ja } from '../../src/i18n/locales/ja';
import { ko } from '../../src/i18n/locales/ko';
import { ptBR } from '../../src/i18n/locales/pt-BR';
import { es } from '../../src/i18n/locales/es';

function extractKeys(obj: Record<string, any>, prefix = ''): string[] {
  let keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys = keys.concat(extractKeys(value, currentPath));
    } else {
      keys.push(currentPath);
    }
  }
  return keys.sort();
}

describe('Client i18n Translation Dictionaries Parity', () => {
  const locales = {
    zh,
    ja,
    ko,
    'pt-BR': ptBR,
    es
  };

  const enKeys = extractKeys(en);

  it('should ensure en has all required translation sections and keys', () => {
    expect(enKeys.length).toBeGreaterThan(50);
  });

  for (const [localeCode, localeDict] of Object.entries(locales)) {
    it(`should ensure 100% key parity and non-empty values for locale '${localeCode}'`, () => {
      const localeKeys = extractKeys(localeDict);

      const missingInLocale = enKeys.filter((k) => !localeKeys.includes(k));
      const extraInLocale = localeKeys.filter((k) => !enKeys.includes(k));

      expect(missingInLocale, `Locale '${localeCode}' is missing keys from en`).toEqual([]);
      expect(extraInLocale, `Locale '${localeCode}' has extra keys not in en`).toEqual([]);

      // Ensure no values are empty or undefined
      for (const key of localeKeys) {
        const parts = key.split('.');
        let val: any = localeDict;
        for (const p of parts) {
          val = val?.[p];
        }
        expect(typeof val, `Key '${key}' in locale '${localeCode}' should be a string`).toBe('string');
        expect(val.trim().length, `Key '${key}' in locale '${localeCode}' should not be empty`).toBeGreaterThan(0);
      }
    });
  }
});
