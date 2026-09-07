import { describe, it, expect } from 'vitest';
import { renderMarkdown } from '../../src/lib/markdown';

describe('Common Syntax Highlighting Parity (highlight.js/lib/common)', () => {
  const testCases = [
    {
      lang: 'javascript',
      code: 'const greet = (name) => `Hello, ${name}!`;',
      expectedToken: 'hljs-keyword'
    },
    {
      lang: 'typescript',
      code: 'interface User { id: number; name: string; }',
      expectedToken: 'hljs-keyword'
    },
    {
      lang: 'python',
      code: 'def calculate_total(items):\n    return sum(items)',
      expectedToken: 'hljs-keyword'
    },
    {
      lang: 'rust',
      code: 'pub fn main() {\n    println!("Hello, world!");\n}',
      expectedToken: 'hljs-keyword'
    },
    {
      lang: 'go',
      code: 'package main\nimport "fmt"\nfunc main() {\n    fmt.Println("Hello")\n}',
      expectedToken: 'hljs-keyword'
    },
    {
      lang: 'bash',
      code: '#!/usr/bin/env bash\necho "Running"\nexit 0',
      expectedToken: 'hljs-string'
    },
    {
      lang: 'sql',
      code: 'SELECT id, username FROM users WHERE active = 1;',
      expectedToken: 'hljs-keyword'
    },
    {
      lang: 'json',
      code: '{"status": "ok", "code": 200}',
      expectedToken: 'hljs-attr'
    },
    {
      lang: 'yaml',
      code: 'name: release\nversion: 1.0.0',
      expectedToken: 'hljs-attr'
    },
    {
      lang: 'xml',
      code: '<component id="test"><child/></component>',
      expectedToken: 'hljs-tag'
    }
  ];

  testCases.forEach(({ lang, code, expectedToken }) => {
    it(`renders syntax highlighting tokens for ${lang}`, () => {
      const markdown = `\`\`\`${lang}\n${code}\n\`\`\``;
      const html = renderMarkdown(markdown);

      expect(html).toContain(`class="language-${lang}"`);
      expect(html).toContain(expectedToken);
    });
  });

  it('falls back cleanly to escaped plain code block for unknown language', () => {
    const markdown = "```unknownlang123\n<script>alert(1)</script>\n```";
    const html = renderMarkdown(markdown);

    expect(html).toContain("class=\"hljs\"><code>");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(html).not.toContain("<script>alert(1)</script>");
  });
});
