import React, { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, lineNumbers, highlightActiveLineGutter, highlightActiveLine, keymap } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';

interface Props {
  content: string;
  onChange: (newContent: string) => void;
  onScroll?: (view: EditorView) => void;
  /** Fires whenever the primary cursor moves to a different source line (1-based). */
  onCursorLine?: (line: number) => void;
  isDark?: boolean;
  fontSize?: number;
  autoFocus?: boolean;
  editorViewRef?: React.MutableRefObject<EditorView | null>;
}

export const CodeMirrorEditor: React.FC<Props> = ({
  content,
  onChange,
  onScroll,
  onCursorLine,
  isDark = false,
  fontSize = 15,
  autoFocus = false,
  editorViewRef
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const lastCursorLineRef = useRef(-1);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        onChange(update.state.doc.toString());
      }
      if (
        onCursorLine &&
        (update.selectionSet || update.docChanged)
      ) {
        const head = update.state.selection.main.head;
        const line = update.state.doc.lineAt(head).number;
        if (line !== lastCursorLineRef.current) {
          lastCursorLineRef.current = line;
          onCursorLine(line);
        }
      }
      if (update.geometryChanged && onScroll && viewRef.current) {
        onScroll(viewRef.current);
      }
    });

    const scrollListener = EditorView.domEventHandlers({
      scroll() {
        if (onScroll && viewRef.current) {
          onScroll(viewRef.current);
        }
      }
    });

    const extensions = [
      EditorView.lineWrapping, // soft-wrap long lines so content fills the pane width
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightActiveLine(),
      history(),
      markdown(),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      updateListener,
      scrollListener,
      EditorView.theme({
        '&': {
          height: '100%',
          fontSize: `${fontSize}px`
        },
        '.cm-scroller': {
          overflow: 'auto',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
        },
        '.cm-content': {
          // Balanced breathing room so a full-bleed (full-window) editor never
          // sits text flush against the window edges.
          padding: '16px 24px 28px',
          maxWidth: 'none'
        }
      })
    ];

    if (isDark) {
      extensions.push(oneDark);
    }

    const state = EditorState.create({
      doc: content,
      extensions
    });

    const view = new EditorView({
      state,
      parent: containerRef.current
    });

    viewRef.current = view;
    if (editorViewRef) {
      editorViewRef.current = view;
    }

    if (autoFocus) {
      view.focus();
    }

    return () => {
      view.destroy();
      viewRef.current = null;
      if (editorViewRef) {
        editorViewRef.current = null;
      }
    };
  }, [isDark]);

  // Update content externally if changed from outside
  useEffect(() => {
    if (viewRef.current) {
      const currentVal = viewRef.current.state.doc.toString();
      if (content !== currentVal) {
        viewRef.current.dispatch({
          changes: { from: 0, to: currentVal.length, insert: content }
        });
      }
    }
  }, [content]);

  return <div ref={containerRef} className="h-full w-full overflow-hidden" />;
};
