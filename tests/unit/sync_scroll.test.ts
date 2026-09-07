import { describe, it, expect } from 'vitest';

describe('Synchronized Scroll Calculation', () => {
  it('interpolates visible lines linearly', () => {
    const totalLines = 100;
    const currentLine = 50;
    const ratio = (currentLine - 1) / (totalLines - 1);
    expect(ratio).toBeCloseTo(0.495, 2);
  });
});
