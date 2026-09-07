import React, { useMemo } from 'react';
import { useI18n } from '../../i18n';
import { FileEncoding, LineEnding } from '../../types/document';
import { HelpCircle, Lock } from 'lucide-react';

interface Props {
  content: string;
  encoding: FileEncoding;
  lineEnding: LineEnding;
  isReadOnly: boolean;
  onOpenShortcuts: () => void;
}

export const StatusBar: React.FC<Props> = ({
  content,
  encoding,
  lineEnding,
  isReadOnly,
  onOpenShortcuts
}) => {
  const { t } = useI18n();

  const stats = useMemo(() => {
    const chars = content.length;

    let words: number;
    if (chars > 120_000) {
      // Very large documents: skip the costly CJK/Latin regex scans on every
      // edit so typing in a big file stays responsive; approximate instead.
      words = Math.round(chars / 5);
    } else {
      const cjkMatches = content.match(/[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af]/g) || [];
      const latinWords = content
        .replace(/[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af]/g, ' ')
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0);
      words = cjkMatches.length + latinWords.length;
    }

    const readingTime = Math.max(1, Math.ceil(words / 250));

    return {
      chars,
      words,
      readingTime
    };
  }, [content]);

  return (
    <footer className="h-6 border-t border-slate-200 dark:border-neutral-800 bg-slate-50/90 dark:bg-[#181818]/90 text-[11px] text-slate-500 dark:text-neutral-400 flex items-center justify-between px-3 select-none shrink-0">
      {/* Left: Document Statistics */}
      <div className="flex items-center gap-3">
        {isReadOnly && (
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
            <Lock className="w-3 h-3" />
            {t.statusBar.readOnly}
          </span>
        )}
        <span>
          {stats.words.toLocaleString()} {t.statusBar.words}
        </span>
        <span className="opacity-40">•</span>
        <span>
          {stats.chars.toLocaleString()} {t.statusBar.chars}
        </span>
        <span className="opacity-40">•</span>
        <span>
          ~{stats.readingTime} {t.statusBar.readingTime}
        </span>
      </div>

      {/* Right: Technical Fidelity & Shortcuts Helper */}
      <div className="flex items-center gap-3">
        <span>{encoding}</span>
        <span className="opacity-40">•</span>
        <span>{lineEnding}</span>
        <button
          onClick={onOpenShortcuts}
          title={t.common.shortcuts}
          className="hover:text-slate-900 dark:hover:text-slate-200 transition flex items-center gap-1 ml-1"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
};
