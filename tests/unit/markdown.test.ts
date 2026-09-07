import { describe, it, expect, beforeAll } from 'vitest';
import { renderMarkdown, extractHeadings, renderMath } from '../../src/lib/markdown';
import { loadKatex } from '../../src/lib/mathRenderer';

describe('Markdown Parser & Fidelity', () => {
  beforeAll(async () => {
    await loadKatex();
  });
  it('renders standard markdown headings and paragraphs with data-source-line markers', () => {
    const md = `# Document Title\n\nThis is a paragraph.`;
    const html = renderMarkdown(md);

    expect(html).toContain('<h1');
    expect(html).toContain('data-source-line="1"');
    expect(html).toContain('Document Title');
    expect(html).toContain('<p');
    expect(html).toContain('data-source-line="3"');
    expect(html).toContain('This is a paragraph.');
  });

  it('renders GFM task lists correctly', () => {
    const md = `- [x] Completed task\n- [ ] Pending task`;
    const html = renderMarkdown(md);

    expect(html).toContain('task-list-item');
    expect(html).toContain('type="checkbox"');
  });

  it('renders LaTeX math formulas', () => {
    const math = `Inline $E=mc^2$ and block:

$$
\\frac{a}{b}
$$`;
    const html = renderMarkdown(math);

    expect(html).toContain('katex');
  });

  it('renderMath fast-path returns untouched html when no dollar sign is present', () => {
    const plain = `<h1>Title</h1><p>No math here, just plain text and <code>vars</code>.</p>`;
    expect(renderMath(plain)).toBe(plain);
  });

  it('renderMath still transforms dollars into katex output', () => {
    const withMath = `<p>Inline $E=mc^2$ done.</p>`;
    const out = renderMath(withMath);
    expect(out).toContain('katex');
    expect(out).not.toContain('$E=mc^2$');
  });

  it('extracts structured headings with correct hierarchy and source line numbers', () => {
    const md = `# Chapter 1
Some intro text.

## Section 1.1
Content.

### Subsection 1.1.1
Deep dive.

## Section 1.2`;

    const headings = extractHeadings(md);

    expect(headings).toHaveLength(4);
    expect(headings[0]).toEqual({
      id: 'chapter-1',
      level: 1,
      text: 'Chapter 1',
      sourceLine: 1
    });
    expect(headings[1]).toEqual({
      id: 'section-1.1',
      level: 2,
      text: 'Section 1.1',
      sourceLine: 4
    });
    expect(headings[2]).toEqual({
      id: 'subsection-1.1.1',
      level: 3,
      text: 'Subsection 1.1.1',
      sourceLine: 7
    });
  });

  it('renders mermaid code blocks into .qv-mermaid-wrapper with source line', () => {
    const md = `\`\`\`mermaid\ngraph TD;\n    A-->B;\n\`\`\``;
    const html = renderMarkdown(md);

    expect(html).toContain('class="qv-mermaid-wrapper');
    expect(html).toContain('class="mermaid"');
    expect(html).toContain('graph TD;');
    expect(html).toContain('data-source-line="1"');
  });
});
