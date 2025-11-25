import React, { useState, useEffect } from 'react';
import { TerminalLine, FSNode, CommandHandler } from '../TerminalTypes';
import { COMMANDS, getAllCommandNames } from '../commands/registry/commandRegistry';
import { useAchievements } from '../../../contexts/AchievementContext';
import {
    createFileHandlers,
    createSystemHandlers,
    createNetworkHandlers,
    createInfoHandlers,
    createTerminalHandlers,
    createSimpleFunHandlers,
    createSnakeHandler,
    createTypeGameHandler,
    createMatrixHandler,
    createFireHandler,
    createHackHandler,
    createSteamLocomotiveHandler,
    createCryptoMinerHandler,
    createGitHandlers,
    createSystemFunHandlers,
    createEasterEggHandlers,
    createDevModeHandler,
} from '../commands/handlers';

interface CommandLogicProps {
    lines: TerminalLine[];
    setLines: React.Dispatch<React.SetStateAction<TerminalLine[]>>;
    currentPath: string[];
    setCurrentPath: React.Dispatch<React.SetStateAction<string[]>>;
    activeComponent: React.ReactNode | null;
    setActiveComponent: React.Dispatch<React.SetStateAction<React.ReactNode | null>>;
    setMatrixMode: React.Dispatch<React.SetStateAction<boolean>>;
    setBsodTriggered: React.Dispatch<React.SetStateAction<boolean>>;
    setInput: (val: string) => void;
    setCursorPos: (pos: number) => void;
    onClose: () => void;
    scrollToBottom: () => void;
    fileSystem: Record<string, FSNode>;
}

export const useCommandLogic = ({
    lines, setLines,
    currentPath, setCurrentPath,
    activeComponent, setActiveComponent,
    setMatrixMode, setBsodTriggered,
    setInput, setCursorPos,
    onClose, scrollToBottom, fileSystem
}: CommandLogicProps) => {
    const { trackEvent, stats } = useAchievements();
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    // --- Helper Functions for FS Traversal ---
    const getNodeAt = (path: string[]): FSNode | null => {
        if (!fileSystem['~']) return null;
        let current: FSNode = fileSystem['~'];
        for (let i = 1; i < path.length; i++) {
            if (current.type === 'dir' && current.children && current.children[path[i]]) {
                current = current.children[path[i]];
            } else {
                return null;
            }
        }
        return current;
    };

    const resolvePath = (targetPath: string): string[] => {
        if (!targetPath) return ['~'];
        if (targetPath === '/') return ['~'];
        if (targetPath === '~') return ['~'];

        const parts = targetPath.split('/').filter(p => p);
        let newPath = targetPath.startsWith('/') ? ['~'] : [...currentPath];

        for (const part of parts) {
            if (part === '.') continue;
            if (part === '..') {
                if (newPath.length > 1) newPath.pop();
            } else if (part === '~') {
                newPath = ['~'];
            } else {
                const currentNode = getNodeAt(newPath);
                if (currentNode && currentNode.type === 'dir' && currentNode.children[part]) {
                    newPath.push(part);
                } else {
                    throw new Error(`cd: no such file or directory: ${part}`);
                }
            }
        }
        return newPath;
    };

    // --- Command History ---
    const handleHistoryUp = () => {
        if (commandHistory.length > 0) {
            const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(historyIndex - 1, 0);
            setHistoryIndex(newIndex);
            const newVal = commandHistory[newIndex];
            setInput(newVal);
            setCursorPos(newVal.length);
        }
    };

    const handleHistoryDown = () => {
        if (historyIndex !== -1) {
            const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
            setHistoryIndex(newIndex);
            const newVal = commandHistory[newIndex];
            setInput(newVal);
            setCursorPos(newVal.length);
            if (historyIndex === commandHistory.length - 1) {
                setHistoryIndex(-1);
                setInput('');
                setCursorPos(0);
            }
        }
    };

    // --- Tab Completion ---
    const handleTabCompletion = (input: string) => {
        const commandList = getAllCommandNames();

        const args = input.split(' ');

        if (args.length === 1) {
            const currentInput = args[0].toLowerCase();
            if (!currentInput) return;

            const matches = commandList.filter(cmd => cmd.startsWith(currentInput));

            if (matches.length === 1) {
                const newVal = matches[0] + ' ';
                setInput(newVal);
                setCursorPos(newVal.length);
            } else if (matches.length > 1) {
                const commonPrefix = matches.reduce((acc, curr) => {
                    let i = 0;
                    while (i < acc.length && i < curr.length && acc[i] === curr[i]) i++;
                    return acc.substring(0, i);
                });
                setInput(commonPrefix);
                setCursorPos(commonPrefix.length);
            }
            return;
        }

        // File/Dir Completion
        const lastArg = args[args.length - 1];
        let searchPath = [...currentPath];
        let partialName = lastArg;
        let prefix = "";

        if (lastArg.includes('/')) {
            const lastSlashIndex = lastArg.lastIndexOf('/');
            const dirPart = lastArg.substring(0, lastSlashIndex + 1);
            partialName = lastArg.substring(lastSlashIndex + 1);
            prefix = dirPart;

            try {
                searchPath = resolvePath(dirPart);
            } catch {
                return;
            }
        }

        const node = getNodeAt(searchPath);

        if (node && node.type === 'dir') {
            const children = Object.keys(node.children);
            const matches = children.filter(child => child.startsWith(partialName));

            if (matches.length === 1) {
                const match = matches[0];
                const childNode = node.children[match];
                const isDir = childNode.type === 'dir';
                const completion = prefix + match + (isDir ? '/' : ' ');

                const newArgs = [...args];
                newArgs[newArgs.length - 1] = completion;
                const finalStr = newArgs.join(' ');
                setInput(finalStr);
                setCursorPos(finalStr.length);

            } else if (matches.length > 1) {
                const commonPrefix = matches.reduce((acc, curr) => {
                    let i = 0;
                    while (i < acc.length && i < curr.length && acc[i] === curr[i]) i++;
                    return acc.substring(0, i);
                });

                const completion = prefix + commonPrefix;
                const newArgs = [...args];
                newArgs[newArgs.length - 1] = completion;
                const finalStr = newArgs.join(' ');
                setInput(finalStr);
                setCursorPos(finalStr.length);
            }
        }
    };

    // --- Create Command Handlers ---
    const fileHandlers = createFileHandlers({
        currentPath,
        setCurrentPath,
        fileSystem,
        getNodeAt,
        resolvePath,
    });

    const systemHandlers = createSystemHandlers({
        setActiveComponent,
        setLines,
        scrollToBottom,
        trackEvent,
    });

    const networkHandlers = createNetworkHandlers({
        setActiveComponent,
        setLines,
        scrollToBottom,
    });

    const infoHandlers = createInfoHandlers({
        commandHistory,
        fileSystem,
    });

    const terminalHandlers = createTerminalHandlers({
        setLines,
        onClose,
    });

    const simpleFunHandlers = createSimpleFunHandlers({
        trackEvent,
    });

    const snakeHandler = createSnakeHandler({
        setActiveComponent,
        setLines,
        trackEvent,
    });

    const typeGameHandler = createTypeGameHandler({
        setActiveComponent,
        setLines,
        trackEvent,
    });

    const matrixHandler = createMatrixHandler({
        setActiveComponent,
        setMatrixMode,
        trackEvent,
    });

    const fireHandler = createFireHandler({
        setActiveComponent,
        scrollToBottom,
        trackEvent,
    });

    const hackHandler = createHackHandler({
        setActiveComponent,
        scrollToBottom,
        trackEvent,
    });

    const steamLocomotiveHandler = createSteamLocomotiveHandler({
        setActiveComponent,
        scrollToBottom,
    });

    const cryptoMinerHandler = createCryptoMinerHandler({
        setActiveComponent,
        scrollToBottom,
    });

    const gitHandlers = createGitHandlers();

    const systemFunHandlers = createSystemFunHandlers({
        setActiveComponent,
        setBsodTriggered,
        setLines,
        trackEvent,
    });

    const easterEggHandlers = createEasterEggHandlers({
        setActiveComponent,
        setBsodTriggered,
        trackEvent,
    });

    const devModeHandler = createDevModeHandler({
        stats,
    });

    // --- Combine All Handlers ---
    const handlers: Record<string, CommandHandler> = {
        ...fileHandlers,
        ...systemHandlers,
        ...networkHandlers,
        ...infoHandlers,
        ...terminalHandlers,
        ...simpleFunHandlers,
        ...snakeHandler,
        ...typeGameHandler,
        ...matrixHandler,
        ...fireHandler,
        ...hackHandler,
        ...steamLocomotiveHandler,
        ...cryptoMinerHandler,
        ...gitHandlers,
        ...systemFunHandlers,
        ...easterEggHandlers,
        ...devModeHandler,
    };

    // --- Execute Command ---
    const handleCommand = (rawInput: string) => {
        const cmdTrimmed = rawInput.trim();
        if (!cmdTrimmed) return;

        setCommandHistory(prev => {
            const newHistory = [...prev, rawInput];
            // Keep only last 100 commands
            return newHistory.slice(-100);
        });
        setHistoryIndex(-1);

        const [cmd, ...args] = cmdTrimmed.split(/\s+/);
        
        // Track command usage for achievements
        trackEvent('used_commands', cmd.toLowerCase());
        trackEvent('terminal_commands_used');

        const promptLine: TerminalLine = { type: 'input', content: rawInput };
        const newLines: TerminalLine[] = [promptLine];

        try {
            // Resolve command name (handle aliases)
            let commandName = cmd.toLowerCase();
            const commandInfo = COMMANDS.find(c => 
                c.name === commandName || 
                (c.aliases && c.aliases.includes(commandName))
            );
            if (commandInfo) {
                commandName = commandInfo.name; // Use canonical name
            }

            // Use handlers map
            if (handlers[commandName]) {
                const result = handlers[commandName](args, newLines);
                if (result === 'exit') {
                    onClose();
                    return;
                }
                if (result === 'clear') {
                    setLines([]);
                    return;
                }
            } else {
                // Unknown command
                newLines.push({ type: 'output', content: <span className="text-red-400">zsh: command not found: {cmd}</span> });
            }
        } catch (error) {
            newLines.push({ type: 'output', content: <span className="text-red-400">Error executing command</span> });
        }

        setLines(prev => [...prev, ...newLines]);
    };

    return {
        handleCommand,
        handleTabCompletion,
        handleHistoryUp,
        handleHistoryDown
    };
};
