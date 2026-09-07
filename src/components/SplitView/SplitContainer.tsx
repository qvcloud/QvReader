import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { EditorView } from '@codemirror/view';
import { CodeMirrorEditor } from '../Editor/CodeMirrorEditor';
import { MarkdownRenderer } from '../Reader/MarkdownRenderer';
import { useSyncScroll, findContainingBlock } from './useSyncScroll';

interface Props {
  content: string;
  filePath: string | null;
  onChange: (val: string) => void;
  isDark: boolean;
  fontSize: number;
}

export const SplitContainer: React.FC<Props> = ({
  content,
  filePath,
  onChange,
  isDark,
  fontSize
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const editorViewRef = useRef<EditorView | null>(null);
  const { handleEditorScroll, handlePreviewScroll, scrollPreviewToLine } = useSyncScroll();

  // The source line the cursor/active editing is on (1-based, 0 = none yet).
  const [activeLine, setActiveLine] = useState(0);
  const activeLineRef = useRef(activeLine);
  activeLineRef.current = activeLine;

  // Debounce the live preview render. Re-rendering markdown-it + katex on every
  // keystroke makes editing a large document in split view stutter; coalescing
  // edits ~120ms keeps the preview near-real-time while the editor stays fluid.
  const [previewContent, setPreviewContent] = useState(content);
  useEffect(() => {
    const id = window.setTimeout(() => setPreviewContent(content), 120);
    return () => window.clearTimeout(id);
  }, [content]);

  // Cursor moved to a different line: reflect it on the preview side.
  const handleCursorLine = useCallback(
    (line: number) => {
      setActiveLine(line);
      scrollPreviewToLine(editorViewRef.current, previewRef.current, line);
    },
    [scrollPreviewToLine]
  );

  // Apply / move the "active block" highlight on the preview. Runs whenever the
  // rendered preview is replaced (content changed) or the active line changes.
  // The block *containing* the cursor source line is highlighted (so a cursor
  // anywhere inside a multi-line code fence highlights that whole fence block).
  // Note: visibility scrolling is handled by `handleCursorLine` / the scroll
  // sync handlers; this effect only paints the highlight marker.
  useLayoutEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;
    const line = activeLineRef.current;
    // Clear any previous highlight.
    preview
      .querySelectorAll<HTMLElement>('.qv-sync-active')
      .forEach((el) => el.classList.remove('qv-sync-active'));
    if (line <= 0) return;
    const el = findContainingBlock(preview, line);
    if (el) {
      el.classList.add('qv-sync-active');
    }
  }, [previewContent, activeLine]);

  return (
    <div className="flex-1 flex h-full overflow-hidden divide-x divide-slate-200 dark:divide-neutral-800">
      {/* Left Pane: CodeMirror Source Editor */}
      <div className="w-1/2 h-full bg-slate-50 dark:bg-[#181818] overflow-hidden">
        <CodeMirrorEditor
          content={content}
          onChange={onChange}
          onScroll={(view) => handleEditorScroll(view, previewRef.current)}
          onCursorLine={handleCursorLine}
          isDark={isDark}
          fontSize={fontSize}
          autoFocus={true}
          editorViewRef={editorViewRef}
        />
      </div>

      {/* Right Pane: Live Synchronized Preview */}
      <div
        ref={previewRef}
        onScroll={(e) => handlePreviewScroll(e.currentTarget, editorViewRef.current)}
        className="w-1/2 h-full overflow-y-auto px-8 py-8 bg-white dark:bg-[#1e1e1e]"
      >
        <div style={{ fontSize: `${fontSize}px` }}>
          <MarkdownRenderer content={previewContent} filePath={filePath} />
        </div>
      </div>
    </div>
  );
};
