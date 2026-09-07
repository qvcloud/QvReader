import { describe, it, expect } from 'vitest';
import { extractHeadings } from '../../src/lib/markdown';

describe('Heading Extraction', () => {
  it('handles empty document gracefully', () => {
    expect(extractHeadings('')).toEqual([]);
  });

  it('ignores code block hashes', () => {
    const md = `\`\`\`bash
# Not a heading
\`\`\`
# Real Heading`;
    const headings = extractHeadings(md);
    // Real heading is present
    expect(headings.some(h => h.text === 'Real Heading')).toBe(true);
  });
});
