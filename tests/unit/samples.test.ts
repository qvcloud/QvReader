import { describe, it, expect } from 'vitest';
import { getSampleDocument, SAMPLE_DOCUMENTS } from '../../src/data/samples';
import { SupportedLocale } from '../../src/i18n';

describe('Localized Sample Document', () => {
  const supportedLocales: SupportedLocale[] = ['zh', 'en', 'ja', 'ko', 'es', 'pt-BR'];

  it('provides a distinct localized sample document for all 6 constitutional locales', () => {
    supportedLocales.forEach((locale) => {
      const doc = getSampleDocument(locale);
      expect(doc).toBeDefined();
      expect(typeof doc).toBe('string');
      expect(doc.length).toBeGreaterThan(500);

      // Must have Mermaid chart
      expect(doc).toContain('```mermaid');
      // Must have Math formula
      expect(doc).toContain('E = mc^2');
      // Must have GFM checklist
      expect(doc).toContain('- [x]');
      // Must have callout alerts
      expect(doc).toContain('> [!NOTE]');
    });
  });

  it('contains language-specific titles', () => {
    expect(getSampleDocument('zh')).toContain('# 欢迎使用 QvReader');
    expect(getSampleDocument('en')).toContain('# Welcome to QvReader');
    expect(getSampleDocument('ja')).toContain('# QvReader へようこそ');
    expect(getSampleDocument('ko')).toContain('# QvReader에 오신 것을 환영합니다');
    expect(getSampleDocument('es')).toContain('# Bienvenido a QvReader');
    expect(getSampleDocument('pt-BR')).toContain('# Bem-vindo ao QvReader');
  });

  it('falls back to English for unknown locales', () => {
    // @ts-expect-error test unknown locale fallback
    const fallback = getSampleDocument('fr');
    expect(fallback).toBe(SAMPLE_DOCUMENTS.en);
  });
});
