import MarkdownIt from 'markdown-it';
import taskLists from 'markdown-it-task-lists';
import footnote from 'markdown-it-footnote';
import anchor from 'markdown-it-anchor';
import hljs from 'highlight.js/lib/common';
import { HeadingItem } from '../types/document';

// Cached KaTeX instance populated on demand when formulas are present
let globalKatex: any = null;

export function setKatexInstance(instance: any) {
  globalKatex = instance;
}

export function getKatexInstance(): any {
  return globalKatex;
}

export function createMarkdownParser(): MarkdownIt {
  const md: MarkdownIt = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str: string, lang: string): string {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="hljs"><code class="language-${lang}">${
            hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
          }</code></pre>`;
        } catch (_) {}
      }
      return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
    }
  });

  md.use(taskLists, { enabled: true, label: true });
  md.use(footnote);
  md.use(anchor, {
    permalink: false,
    slugify: (s: string) =>
      encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'))
  });

  // Inject data-source-line attribute into block tokens for sync scroll
  const defaultParagraphOpen =
    md.renderer.rules.paragraph_open ||
    function (tokens: any, idx: number, options: any, _env: any, self: any) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.paragraph_open = function (
    tokens: any,
    idx: number,
    options: any,
    env: any,
    self: any
  ) {
    const token = tokens[idx];
    if (token.map) {
      token.attrSet('data-source-line', String(token.map[0] + 1));
    }
    return defaultParagraphOpen(tokens, idx, options, env, self);
  };

  const defaultHeadingOpen =
    md.renderer.rules.heading_open ||
    function (tokens: any, idx: number, options: any, _env: any, self: any) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.heading_open = function (
    tokens: any,
    idx: number,
    options: any,
    env: any,
    self: any
  ) {
    const token = tokens[idx];
    if (token.map) {
      token.attrSet('data-source-line', String(token.map[0] + 1));
    }
    return defaultHeadingOpen(tokens, idx, options, env, self);
  };

  // Fenced code blocks are emitted as a single <pre> through the `fence` rule
  // (no per-open token hook), so wrap it to stamp the block with the source line
  // where the fence starts. This lets split-view highlight/scroll anchor onto a
  // code block the user is editing rather than the next paragraph.
  const defaultFence =
    md.renderer.rules.fence ||
    function (tokens: any, idx: number, options: any, _env: any, self: any) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.fence = function (
    tokens: any,
    idx: number,
    options: any,
    env: any,
    self: any
  ) {
    const token = tokens[idx];
    const lang = (token.info || '').trim().toLowerCase();
    const line = token.map ? token.map[0] + 1 : 1;

    if (lang === 'mermaid') {
      const code = token.content;
      return `<div class="qv-mermaid-wrapper my-4 flex flex-col items-center select-none" data-source-line="${line}"><div class="mermaid" data-processed="false">${md.utils.escapeHtml(code)}</div></div>\n`;
    }

    const out = defaultFence(tokens, idx, options, env, self);
    if (token.map) {
      // Insert the marker into the opening <pre ...> tag of the rendered block.
      return out.replace(/^<pre(\s|>)/, `<pre data-source-line="${line}"$1`);
    }
    return out;
  };

  return md;
}

const parser = createMarkdownParser();

// Render LaTeX math formulas
export function renderMath(content: string, katexMod?: any): string {
  // Fast path: skip both regex passes when no dollar sign is present.
  if (!content.includes('$')) {
    return content;
  }

  const k = katexMod || globalKatex;
  if (k) {
    // Block math: $$ ... $$
    let res = content.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
      try {
        return k.renderToString(math.trim(), { displayMode: true, throwOnError: false });
      } catch {
        return `<pre class="math-error">$$${math}$$</pre>`;
      }
    });

    // Inline math: $ ... $
    res = res.replace(/(^|[^\\])\$([^\$\n]+?)\$/g, (_, prefix, math) => {
      try {
        return prefix + k.renderToString(math.trim(), { displayMode: false, throwOnError: false });
      } catch {
        return `${prefix}$${math}$`;
      }
    });

    return res;
  }

  // KaTeX not yet loaded: output semantic placeholders hydrated on-demand by mathRenderer
  let res = content.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
    return `<div class="qv-math-block my-3 select-none" data-math="${encodeURIComponent(math.trim())}" data-processed="false"><pre class="math-raw font-mono text-sm text-slate-700 dark:text-neutral-300">$$${math.trim()}$$</pre></div>`;
  });

  res = res.replace(/(^|[^\\])\$([^\$\n]+?)\$/g, (_, prefix, math) => {
    return `${prefix}<span class="qv-math-inline" data-math="${encodeURIComponent(math.trim())}" data-processed="false"><code class="math-raw font-mono text-xs text-slate-700 dark:text-neutral-300">$${math.trim()}$</code></span>`;
  });

  return res;
}

export function renderMarkdown(source: string): string {
  const renderedHtml = parser.render(source);
  return renderMath(renderedHtml);
}

export function extractHeadings(source: string): HeadingItem[] {
  const headings: HeadingItem[] = [];
  const lines = source.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = encodeURIComponent(text.toLowerCase().replace(/\s+/g, '-'));
      headings.push({
        id,
        level,
        text,
        sourceLine: i + 1
      });
    }
  }

  return headings;
}
