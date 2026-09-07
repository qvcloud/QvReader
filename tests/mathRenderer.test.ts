import { describe, it, expect } from 'vitest';
import { renderMarkdown, renderMath, setKatexInstance } from '../src/lib/markdown';
import { loadKatex, isKatexLoaded } from '../src/lib/mathRenderer';

describe('On-Demand KaTeX Mathematical Rendering', () => {
  it('skips KaTeX processing when no $ is present in content', () => {
    const plain = '# Hello World\nThis is a standard markdown text without any math.';
    const html = renderMarkdown(plain);
    expect(html).toContain('Hello World');
    expect(html).not.toContain('qv-math');
    expect(html).not.toContain('katex');
  });

  it('generates valid placeholders when $ is present and KaTeX not yet loaded', () => {
    // Ensure instance is cleared
    setKatexInstance(null);
    const math = 'Inline $E = mc^2$ and block: $$\int x dx$$';
    const html = renderMarkdown(math);

    expect(html).toContain('qv-math-inline');
    expect(html).toContain('qv-math-block');
    expect(html).toContain('data-math');
  });

  it('dynamically loads KaTeX on demand and renders formulas with high fidelity', async () => {
    const katex = await loadKatex();
    expect(katex).toBeDefined();
    expect(isKatexLoaded()).toBe(true);

    const math = String.raw`Inline $\alpha + \beta = \gamma$`;
    const html = renderMarkdown(math);

    expect(html).toContain('katex');
    expect(html).toContain('class="katex-html"');
  });
});
