import React from 'react';
import { TerminalLine, FSNode } from '../../TerminalTypes';
import { LsOutput, CatBinaryError, CatFileOutput, OpenSuccessOutput } from '../outputs/fileOutputs';

export interface FileHandlersContext {
    currentPath: string[];
    setCurrentPath: React.Dispatch<React.SetStateAction<string[]>>;
    fileSystem: Record<string, FSNode>;
    getNodeAt: (path: string[]) => FSNode | null;
    resolvePath: (targetPath: string) => string[];
}

export const createFileHandlers = (context: FileHandlersContext) => {
    const { currentPath, setCurrentPath, getNodeAt, resolvePath } = context;

    return {
        ls: (args: string[], newLines: TerminalLine[]) => {
            const showHidden = args.includes('-a') || args.includes('--all');
            const node = getNodeAt(currentPath);
            if (node && node.type === 'dir') {
                const children = Object.entries(node.children)
                    .filter(([name]) => showHidden || !name.startsWith('.'));
                newLines.push({ type: 'output', content: <LsOutput children={children} /> });
            }
        },
        
        cd: (args: string[], newLines: TerminalLine[]) => {
            if (args.length === 0) {
                setCurrentPath(['~']);
            } else {
                try {
                    const newPath = resolvePath(args[0]);
                    const targetNode = getNodeAt(newPath);
                    if (targetNode && targetNode.type === 'dir') {
                        setCurrentPath(newPath);
                    } else {
                        newLines.push({ type: 'output', content: <span className="text-red-400">cd: not a directory: {args[0]}</span> });
                    }
                } catch (e) {
                    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
                    newLines.push({ type: 'output', content: <span className="text-red-400">{errorMessage}</span> });
                }
            }
        },

        cat: (args: string[], newLines: TerminalLine[]) => {
            if (args.length === 0) {
                newLines.push({ type: 'output', content: <span className="text-red-400">cat: missing filename</span> });
            } else {
                const fileName = args[0];
                const targetNode = getNodeAt(currentPath);
                if (targetNode && targetNode.type === 'dir' && targetNode.children[fileName]) {
                    const file = targetNode.children[fileName];
                    if (file.type === 'file') {
                        if (file.isBinary) {
                            newLines.push({ type: 'output', content: <CatBinaryError fileName={fileName} /> });
                        } else {
                            if (typeof file.content === 'string') {
                                newLines.push({ type: 'component', content: <CatFileOutput fileName={fileName} content={file.content} /> });
                            } else {
                                newLines.push({ type: 'output', content: <CatFileOutput fileName={fileName} content={file.content} /> });
                            }
                        }
                    } else {
                        newLines.push({ type: 'output', content: <span className="text-red-400">cat: {fileName}: Is a directory</span> });
                    }
                } else {
                    newLines.push({ type: 'output', content: <span className="text-red-400">cat: {fileName}: No such file or directory</span> });
                }
            }
        },

        open: (args: string[], newLines: TerminalLine[]) => {
            if (args.length === 0) {
                newLines.push({ type: 'output', content: <span className="text-red-400">open: missing filename</span> });
            } else {
                const fileName = args[0];
                const targetNode = getNodeAt(currentPath);
                if (targetNode && targetNode.type === 'dir' && targetNode.children[fileName]) {
                    const file = targetNode.children[fileName];
                    if (file.type === 'file' && file.url) {
                        newLines.push({ type: 'output', content: <OpenSuccessOutput fileName={fileName} /> });
                        window.open(file.url, '_blank');
                    } else {
                        newLines.push({ type: 'output', content: <span className="text-red-400">open: {fileName}: No external link associated or is a directory.</span> });
                    }
                } else {
                    newLines.push({ type: 'output', content: <span className="text-red-400">open: {fileName}: No such file or directory</span> });
                }
            }
        },

        pwd: (args: string[], newLines: TerminalLine[]) => {
            newLines.push({ type: 'output', content: currentPath.join('/').replace('~', '/home/visitor') });
        },

        tree: (args: string[], newLines: TerminalLine[]) => {
            // Tree output will be handled by importing TreeOutput component
            // This is a placeholder - actual implementation will be in useCommandLogic
        },
    };
};

