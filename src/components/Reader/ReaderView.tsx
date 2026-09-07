import React from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ReadingWidth } from '../../types/document';

interface Props {
  content: string;
  filePath: string | null;
  fontSize: number;
  readingWidth?: ReadingWidth;
}

export const ReaderView: React.FC<Props> = ({
  content,
  filePath,
  fontSize,
  readingWidth = 'adaptive'
}) => {
  const getContainerClasses = () => {
    switch (readingWidth) {
      case 'standard':
        return 'max-w-3xl px-6 py-10 md:px-12';
      case 'full':
        return 'max-w-none px-6 md:px-12 py-8';
      case 'adaptive':
      default:
        return 'w-full max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl px-4 sm:px-8 md:px-10 lg:px-12 xl:px-14 py-8 md:py-10';
    }
  };

  return (
    <main className="flex-1 h-full overflow-y-auto">
      <div
        className={`mx-auto transition-all duration-200 ease-out ${getContainerClasses()}`}
        style={{ fontSize: `${fontSize}px` }}
      >
        <MarkdownRenderer content={content} filePath={filePath} />
      </div>
    </main>
  );
};
