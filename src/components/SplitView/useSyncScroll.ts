import { useRef, useCallback } from 'react';
import { EditorView } from '@codemirror/view';

// Vertical inset (px) reserved at the top of each pane when aligning a source
// line's rendered block, so the anchored content does not hug the very edge.
const ALIGN_OFFSET = 4;

/** content-relative Y (i.e. would-be scrollTop value) of an element inside a
 *  scroll container. Using getBoundingClientRect keeps this correct no matter
 *  where the element's CSS offsetParent sits. */
function contentTop(el: HTMLElement, scroller: HTMLElement): number {
  return el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
}

/**
 * Return the preview block that *contains* `sourceLine`. Blocks are stamped with
 * `data-source-line` = the first source line of that block; because blocks do
 * not overlap and appear in source order, the block containing line N is the
 * last one whose start line is <= N (e.g. a multi-line code fence starting at
 * line 10 contains cursor lines 10..17). Exported so the SplitContainer can use
 * the exact same lookup when painting the active highlight.
 */
export function findContainingBlock(previewEl: HTMLElement, sourceLine: number): HTMLElement | null {
  let container: HTMLElement | null = null;
  const elements = previewEl.querySelectorAll<HTMLElement>('[data-source-line]');
  for (const el of elements) {
    const line = parseInt(el.getAttribute('data-source-line') || '0', 10);
    if (line <= sourceLine) {
      container = el;
    } else {
      break;
    }
  }
  return container;
}

/**
 * Bidirectional "anchor to top line" scroll sync between the CodeMirror editor
 * and the rendered Markdown preview.
 *
 * The two panes can't be pixel line-aligned (Markdown blocks expand/wrap), so
 * the contract is: whichever pane is scrolled, the OTHER pane scrolls so the
 * SAME source line sits at the top of its viewport. This keeps the top-most
 * visible content of both panes in agreement as the user reads/edits.
 *
 * Callers pass the DOM/editor accessors as function args so the hook stays
 * reusable and free of component wiring.
 */
export function useSyncScroll() {
  const isSyncingFromEditor = useRef(false);
  const isSyncingFromPreview = useRef(false);

  // The source line currently being edited / top-aligned; used so that a
  // programmatic scroll from the cursor handler does not fight a user scroll.
  const activeSourceLine = useRef(1);

  /** Find the first preview block whose source line is >= `line`. */
  function findBlockAtOrAfter(
    previewEl: HTMLElement,
    line: number
  ): HTMLElement | null {
    const elements = previewEl.querySelectorAll<HTMLElement>('[data-source-line]');
    for (const el of elements) {
      const elLine = parseInt(el.getAttribute('data-source-line') || '0', 10);
      if (elLine >= line) return el;
    }
    return null;
  }

  /** Top visible source line of the editor (content-line number, 1-based). */
  function topSourceLine(view: EditorView): number {
    const lineBlock = view.lineBlockAtHeight(view.scrollDOM.scrollTop);
    return view.state.doc.lineAt(lineBlock.from).number;
  }

  // Sync scroll from CodeMirror Editor to Preview (align top line).
  const handleEditorScroll = useCallback(
    (view: EditorView, previewEl: HTMLDivElement | null) => {
      if (isSyncingFromPreview.current || !previewEl) return;
      isSyncingFromEditor.current = true;

      const lineNumber = topSourceLine(view);
      activeSourceLine.current = lineNumber;
      const targetEl = findBlockAtOrAfter(previewEl, lineNumber);
      if (targetEl) {
        previewEl.scrollTop = contentTop(targetEl, previewEl) - ALIGN_OFFSET;
      } else {
        // No later block found: bottom of preview.
        previewEl.scrollTop = previewEl.scrollHeight;
      }

      window.setTimeout(() => {
        isSyncingFromEditor.current = false;
      }, 40);
    },
    []
  );

  // Sync scroll from Preview to Editor (align top line).
  const handlePreviewScroll = useCallback(
    (previewEl: HTMLDivElement, editorView: EditorView | null) => {
      if (isSyncingFromEditor.current || !editorView) return;
      isSyncingFromPreview.current = true;

      const previewTop = previewEl.scrollTop + ALIGN_OFFSET;
      const elements = previewEl.querySelectorAll<HTMLElement>('[data-source-line]');
      let activeLine = 1;
      for (const el of elements) {
        // contentTop(el) is the block's current content-relative top.
        if (contentTop(el, previewEl) <= previewTop + 1) {
          activeLine = parseInt(el.getAttribute('data-source-line') || '1', 10);
        } else {
          break;
        }
      }
      activeSourceLine.current = activeLine;

      const doc = editorView.state.doc;
      if (activeLine <= doc.lines) {
        const line = doc.line(activeLine);
        const lineBlock = editorView.lineBlockAt(line.from);
        editorView.scrollDOM.scrollTop = lineBlock.top - ALIGN_OFFSET;
      }

      window.setTimeout(() => {
        isSyncingFromPreview.current = false;
      }, 40);
    },
    []
  );

  // Scroll the preview so the given source line's block is visible, anchored
  // toward the top when it is above the viewport or centred otherwise. Used by
  // cursor/click following so the line being edited is always reachable.
  const scrollPreviewToLine = useCallback(
    (view: EditorView | null, previewEl: HTMLDivElement | null, line: number) => {
      if (!previewEl) return;
      activeSourceLine.current = line;
      const targetEl = findContainingBlock(previewEl, line) || findBlockAtOrAfter(previewEl, line);
      if (!targetEl) return;

      const targetTop = contentTop(targetEl, previewEl);
      const clientBottom = previewEl.scrollTop + previewEl.clientHeight;
      // Already comfortably within the visible area -> no scroll.
      if (targetTop >= previewEl.scrollTop + ALIGN_OFFSET && targetTop <= clientBottom - 40) {
        return;
      }
      // Bring the block to the top of the preview viewport so it is clearly
      // visible and aligned with the top of the pane. Guard the induced scroll
      // event so it does not bounce back and re-sync the editor (which would
      // yank the just-clicked line to the top of the editor).
      isSyncingFromEditor.current = true;
      previewEl.scrollTop = targetTop - ALIGN_OFFSET;
      window.setTimeout(() => {
        isSyncingFromEditor.current = false;
      }, 40);

      // Reflect the same anchor on the editor side (if it scrolled outside the
      // editor viewport) so both panes keep a shared top line.
      if (view) {
        const doc = view.state.doc;
        if (line <= doc.lines) {
          const lb = view.lineBlockAt(doc.line(line).from);
          if (lb.top < view.scrollDOM.scrollTop || lb.bottom > view.scrollDOM.scrollTop + view.scrollDOM.clientHeight) {
            view.scrollDOM.scrollTop = lb.top - ALIGN_OFFSET;
          }
        }
      }
    },
    []
  );

  return {
    handleEditorScroll,
    handlePreviewScroll,
    scrollPreviewToLine
  };
}
