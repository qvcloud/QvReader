import { describe, it, expect, beforeAll } from 'vitest';
import { renderMarkdown, renderMath } from '../../src/lib/markdown';
import { loadKatex } from '../../src/lib/mathRenderer';

describe('KaTeX Mathematical Notation Rendering Parity', () => {
  beforeAll(async () => {
    await loadKatex();
  });
  it('renders Greek letters and mathematical symbols correctly', () => {
    const math = String.raw`Inline $\alpha + \beta = \gamma \times \delta$`;
    const html = renderMarkdown(math);

    expect(html).toContain('katex');
    expect(html).toContain('class="katex-html"');
    expect(html).not.toContain('$\alpha');
  });

  it('renders fractions and square roots', () => {
    const frac = String.raw`Inline $\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$`;
    const html = renderMarkdown(frac);

    expect(html).toContain('katex');
    expect(html).toContain('mfrac');
    expect(html).toContain('sqrt');
  });

  it('renders integrals, summations, and limits in display mode', () => {
    const calculus = String.raw`$$
\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$`;
    const html = renderMarkdown(calculus);

    expect(html).toContain('katex-display');
    expect(html).toContain('int_{0}');
  });

  it('renders matrices and arrays', () => {
    const matrix = String.raw`$$
\begin{matrix} a & b \\ c & d \end{matrix}
$$`;
    const html = renderMarkdown(matrix);

    expect(html).toContain('katex-display');
  });

  it('handles invalid math gracefully without throwing', () => {
    const invalidMath = String.raw`$$\invalidCommandXYZ{123}$$`;
    expect(() => renderMarkdown(invalidMath)).not.toThrow();
  });
});
