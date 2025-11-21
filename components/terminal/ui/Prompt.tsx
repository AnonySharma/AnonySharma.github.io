import React from 'react';
import { Terminal as TerminalIcon, GitBranch } from 'lucide-react';

interface PromptProps {
  path: string[];
  command?: string;
  matrixMode?: boolean;
}

export const Prompt: React.FC<PromptProps> = ({ path, command, matrixMode }) => {
  const displayPath = path.join('/').replace('~', '~');

  return (
    <div className="flex items-center font-mono text-sm sm:text-base h-6 mb-1 flex-wrap">
      {/* Segment 1: Dir (Blue) */}
      <div className="bg-blue-600 text-black px-3 h-full flex items-center font-bold whitespace-nowrap z-10">
        <TerminalIcon size={14} className="mr-2" />
        <span>{displayPath}</span>
      </div>

      {/* Arrow 1 */}
      <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[12px] border-l-blue-600 border-b-[12px] border-b-transparent z-10"></div>

      {/* Segment 2: Git (Green) */}
      <div className="bg-green-500 text-black px-3 h-full flex items-center font-bold whitespace-nowrap -ml-3 pl-5 z-0">
        <GitBranch size={14} className="mr-2" />
        <span>main</span>
      </div>

      {/* Arrow 2 */}
      <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[12px] border-l-green-500 border-b-[12px] border-b-transparent z-0"></div>

      {/* Render command if it's a history line */}
      {command !== undefined && (
        <span className={`ml-2 ${matrixMode ? 'text-green-400' : 'text-slate-200'}`}>{command}</span>
      )}
    </div>
  );
};
