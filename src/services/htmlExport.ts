export interface HtmlExportOptions {
  fileName?: string;
  isDark?: boolean;
}

/**
 * Generates a self-contained, beautifully styled standalone HTML document string.
 */
export function generateStandaloneHtml(
  _rawContent: string,
  renderedHtml: string,
  options: HtmlExportOptions = {}
): string {
  const isDark =
    options.isDark ?? (typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false);
  const rawName = options.fileName?.trim() || 'Document';
  const title = rawName.replace(/\.(md|markdown|txt)$/i, '');

  const hasMermaid = renderedHtml.includes('class="mermaid"') || renderedHtml.includes('qv-mermaid-wrapper');
  const hasKatex = renderedHtml.includes('katex');

  return `<!DOCTYPE html>
<html lang="en" class="${isDark ? 'dark' : ''}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  ${
    hasKatex
      ? '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css">'
      : ''
  }
  <style>
    :root {
      --bg-color: #ffffff;
      --text-color: #111827;
      --border-color: #e5e7eb;
      --code-bg: #f6f8fa;
      --code-border: #e1e4e8;
      --code-text: #24292e;
      --link-color: #2563eb;
    }
    html.dark {
      --bg-color: #1e1e1e;
      --text-color: #e4e4e7;
      --border-color: #27272a;
      --code-bg: #161b22;
      --code-border: #30363d;
      --code-text: #c9d1d9;
      --link-color: #60a5fa;
    }
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg-color);
      color: var(--text-color);
      line-height: 1.7;
      word-wrap: break-word;
      transition: background-color 0.2s ease, color 0.2s ease;
    }
    .container {
      max-width: 860px;
      margin: 0 auto;
      padding: 48px 24px;
    }
    .qv-markdown h1, .qv-markdown h2, .qv-markdown h3, .qv-markdown h4, .qv-markdown h5, .qv-markdown h6 {
      font-weight: 600;
      line-height: 1.3;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
    }
    .qv-markdown h1 { font-size: 2em; border-bottom: 1px solid var(--border-color); padding-bottom: 0.3em; }
    .qv-markdown h2 { font-size: 1.5em; border-bottom: 1px solid var(--border-color); padding-bottom: 0.25em; }
    .qv-markdown h3 { font-size: 1.25em; }
    .qv-markdown h4 { font-size: 1em; }
    .qv-markdown h5 { font-size: 0.875em; }
    .qv-markdown h6 { font-size: 0.85em; opacity: 0.8; }
    .qv-markdown p { margin: 0.85em 0; }
    .qv-markdown a { color: var(--link-color); text-decoration: underline; text-underline-offset: 2px; }
    .qv-markdown code:not(pre code) {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.88em;
      padding: 0.2em 0.4em;
      border-radius: 4px;
      background-color: rgba(125, 125, 125, 0.12);
    }
    .qv-markdown pre {
      margin: 1.2em 0;
      padding: 1.1em;
      border-radius: 8px;
      overflow-x: auto;
      font-size: 0.9em;
      line-height: 1.45;
      background-color: var(--code-bg) !important;
      border: 1px solid var(--code-border) !important;
      color: var(--code-text) !important;
    }
    .qv-markdown pre code {
      background: transparent !important;
      padding: 0 !important;
      border: none !important;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    .qv-markdown blockquote {
      margin: 1em 0;
      padding: 0.5em 1em;
      color: #64748b;
      border-left: 4px solid var(--border-color);
      background-color: rgba(125, 125, 125, 0.05);
      border-radius: 0 6px 6px 0;
    }
    html.dark .qv-markdown blockquote {
      color: #94a3b8;
    }
    .qv-markdown table {
      border-collapse: collapse;
      width: 100%;
      margin: 1.2em 0;
      overflow-x: auto;
      display: block;
    }
    .qv-markdown table th, .qv-markdown table td {
      padding: 8px 14px;
      border: 1px solid var(--border-color);
    }
    .qv-markdown table tr:nth-child(2n) {
      background-color: rgba(125, 125, 125, 0.04);
    }
    .qv-markdown ul, .qv-markdown ol {
      padding-left: 2em;
      margin: 0.85em 0;
    }
    .qv-markdown li + li { margin-top: 0.3em; }
    .qv-markdown hr {
      height: 2px;
      padding: 0;
      margin: 28px 0;
      background-color: var(--border-color);
      border: 0;
    }
    .qv-markdown img {
      max-width: 100%;
      height: auto;
      border-radius: 6px;
    }
    .task-list-item {
      list-style-type: none;
      margin-left: -1.5em;
    }
    .task-list-item input[type="checkbox"] {
      margin-right: 0.5em;
    }

    /* Light Syntax Highlighting */
    .hljs-doctag, .hljs-keyword, .hljs-meta .hljs-keyword, .hljs-type { color: #d73a49; }
    .hljs-title, .hljs-title.function_ { color: #6f42c1; }
    .hljs-attr, .hljs-number, .hljs-literal, .hljs-variable { color: #005cc5; }
    .hljs-string, .hljs-regexp { color: #032f62; }
    .hljs-built_in, .hljs-symbol { color: #e36209; }
    .hljs-comment, .hljs-code { color: #6a737d; font-style: italic; }

    /* Dark Syntax Highlighting */
    html.dark .hljs-doctag, html.dark .hljs-keyword, html.dark .hljs-meta .hljs-keyword, html.dark .hljs-type { color: #ff7b72; }
    html.dark .hljs-title, html.dark .hljs-title.function_ { color: #d2a8ff; }
    html.dark .hljs-attr, html.dark .hljs-number, html.dark .hljs-literal, html.dark .hljs-variable { color: #79c0ff; }
    html.dark .hljs-string, html.dark .hljs-regexp { color: #a5d6ff; }
    html.dark .hljs-built_in, html.dark .hljs-symbol { color: #ffa657; }
    html.dark .hljs-comment, html.dark .hljs-code { color: #8b949e; font-style: italic; }

    /* Print styling */
    @media print {
      body { background-color: #ffffff !important; color: #111827 !important; }
      .container { max-width: 100% !important; padding: 0 !important; }
      pre, .qv-markdown pre {
        background-color: #f8fafc !important;
        border: 1px solid #e2e8f0 !important;
        color: #0f172a !important;
        white-space: pre-wrap !important;
        word-break: break-word !important;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <article class="qv-markdown ${isDark ? 'dark' : ''}">
      ${renderedHtml}
    </article>
  </div>
  ${
    hasMermaid
      ? `<script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
    mermaid.initialize({ startOnLoad: true, theme: '${isDark ? 'dark' : 'default'}' });
  </script>`
      : ''
  }
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Exports document to standalone HTML and triggers download.
 */
export function exportDocumentAsHtml(
  _rawContent: string,
  renderedHtml: string,
  options: HtmlExportOptions = {}
): { success: boolean; fileName: string } {
  const rawName = options.fileName?.trim() || 'Document';
  const cleanBase = rawName.replace(/\.(md|markdown|txt)$/i, '');
  const fileName = `${cleanBase}.html`;

  const html = generateStandaloneHtml(_rawContent, renderedHtml, options);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.download = fileName;
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return { success: true, fileName };
}
