
import React from 'react';
import { FSNode } from '../TerminalTypes';
import { SyntaxHighlighter } from '../SyntaxHighlighter';

// LS Output Component
export const LsOutput: React.FC<{ children: Array<[string, FSNode]> }> = ({ children }) => {
    return (
        <div className="flex flex-wrap gap-x-6 gap-y-2">
            {children.map(([name, child]) => (
                <span key={name} className={`font-bold ${child.type === 'dir' ? 'text-blue-400' : child.isBinary ? 'text-red-400' : 'text-green-400'}`}>
                    {name}{child.type === 'dir' ? '/' : child.isBinary ? '*' : ''}
                </span>
            ))}
        </div>
    );
};

// Cat Binary Error Component
export const CatBinaryError: React.FC<{ fileName: string }> = ({ fileName }) => {
    return (
        <span className="text-red-400">
            Error: Binary file matches. <br />
            <span className="opacity-60">Hint: Use <span className="text-yellow-400 font-bold">open {fileName}</span> to view this file.</span>
        </span>
    );
};

// Cat File Output Component
export const CatFileOutput: React.FC<{ fileName: string; content: string | React.ReactNode }> = ({ fileName, content }) => {
    if (typeof content === 'string') {
        const ext = fileName.split('.').pop() || 'txt';
        return <SyntaxHighlighter code={content} language={ext} />;
    }
    return <>{content}</>;
};

