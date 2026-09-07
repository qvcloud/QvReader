import { setKatexInstance } from './markdown';

let katexPromise: Promise<any> | null = null;
let cachedKatex: any = null;

/**
 * Dynamically imports KaTeX on demand so that plain Markdown reading
 * avoids downloading or parsing the ~260 KB KaTeX bundle on startup.
 */
export async function loadKatex(): Promise<any> {
  if (cachedKatex) return cachedKatex;
  if (!katexPromise) {
    katexPromise = import('katex').then((mod) => {
      const katex = mod.default || mod;
      cachedKatex = katex;
      setKatexInstance(katex);
      return katex;
    });
  }
  return katexPromise;
}

export function isKatexLoaded(): boolean {
  return cachedKatex !== null;
}

/**
 * Asynchronously renders all unhydrated math placeholders within a container.
 */
export async function renderMathInContainer(container: HTMLElement): Promise<void> {
  const nodes = container.querySelectorAll<HTMLElement>(
    '.qv-math-block:not([data-processed="true"]), .qv-math-inline:not([data-processed="true"])'
  );
  if (nodes.length === 0) return;

  const katex = await loadKatex();
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const raw = decodeURIComponent(node.getAttribute('data-math') || '');
    if (!raw.trim()) continue;

    const isDisplay = node.classList.contains('qv-math-block');
    try {
      node.innerHTML = katex.renderToString(raw, {
        displayMode: isDisplay,
        throwOnError: false
      });
      node.setAttribute('data-processed', 'true');
    } catch {
      node.setAttribute('data-processed', 'true');
    }
  }
}
