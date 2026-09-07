import React from 'react';
import { CodeMirrorEditor } from './CodeMirrorEditor';

interface Props {
  content: string;
  onChange: (val: string) => void;
  isDark: boolean;
  fontSize: number;
}

export const InlineEditor: React.FC<Props> = ({ content, onChange, isDark, fontSize }) => {
  // Full-bleed editing: the CodeMirror surface fills the whole window area so
  // long lines are not crammed into a narrow centered column. Comfortable
  // horizontal padding is applied inside the editor (see CodeMirrorEditor
  // `.cm-content` theme) rather than via an outer max-width wrapper.
  return (
    <main className="flex-1 h-full overflow-hidden bg-white dark:bg-[#1e1e1e]">
      <CodeMirrorEditor
        content={content}
        onChange={onChange}
        isDark={isDark}
        fontSize={fontSize}
        autoFocus={true}
      />
    </main>
  );
};
