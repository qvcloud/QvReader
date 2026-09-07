import React from 'react';
import { useI18n } from '../../i18n';
import { HeadingItem } from '../../types/document';
import { ChevronRight, X } from 'lucide-react';

interface Props {
  headings: HeadingItem[];
  activeId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectHeading: (sourceLine: number, id: string) => void;
}

export const OutlineDrawer: React.FC<Props> = ({
  headings,
  activeId,
  isOpen,
  onClose,
  onSelectHeading
}) => {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <aside className="w-72 h-full border-r border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-[#181818] flex flex-col z-20 transition-all duration-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-neutral-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
          {t.outline.title}
        </span>
        <button
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {headings.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs text-slate-400 dark:text-neutral-500">
            {t.outline.noHeadings}
          </div>
        ) : (
          headings.map((heading) => {
            const isActive = activeId === heading.id;
            return (
              <button
                key={`${heading.sourceLine}-${heading.id}`}
                onClick={() => onSelectHeading(heading.sourceLine, heading.id)}
                style={{ paddingLeft: `${(heading.level - 1) * 12 + 8}px` }}
                className={`w-full text-left py-1.5 pr-2 rounded text-xs transition flex items-center gap-1.5 group ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-200/50 dark:hover:bg-neutral-800'
                }`}
              >
                <ChevronRight className="w-3 h-3 shrink-0 opacity-40 group-hover:opacity-100" />
                <span className="truncate">{heading.text}</span>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
};
