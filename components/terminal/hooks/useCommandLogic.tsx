
import React, { useState } from 'react';
import { TerminalLine, FSNode } from '../TerminalTypes';
import { SysInfoOutput, NeofetchOutput, PsOutput, TopProcess, DockerPsOutput, DockerImagesOutput, DockerRunOutput } from '../commands/SystemCommands';
import { PingProcess } from '../commands/NetworkCommands';
import { CowsayOutput, MatrixProcess, SteamLocomotive, CryptoMiner, TypeGame, SingPlayer, FortuneOutput, FireEffect, CoffeeOutput, HackProcess, SnakeGame, PartyParrot } from '../commands/FunCommands';
import { SyntaxHighlighter } from '../SyntaxHighlighter';

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

    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    // --- Helper Functions for FS Traversal ---
    const getNodeAt = (path: string[]): FSNode | null => {
        let current: FSNode = fileSystem['~'];
        for (let i = 1; i < path.length; i++) {
            if (current.type === 'dir' && current.children[path[i]]) {
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
        const commandList = [
            'help', 'ls', 'cd', 'cat', 'open', 'clear', 'sysinfo', 'neofetch', 
            'ps', 'top', 'ping', 'sing', 'matrix', 'type', 'sl', 'miner', 
            'cowsay', 'whoami', 'pwd', 'exit', 'sudo', 'rm', 'vim', 'vi', 
            'nano', 'emacs', 'weather', 'coinflip', 'hack', 'coffee', 'brew', 
            'joke', '42', 'eastereggs', 'whois', 'fortune', 'fire', 'docker', 
            'game', 'party', 'bsod'
        ];

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

    // --- Execute Command ---
    const handleCommand = (rawInput: string) => {
        const cmdTrimmed = rawInput.trim();
        if (!cmdTrimmed) return;

        setCommandHistory(prev => [...prev, rawInput]);
        setHistoryIndex(-1);

        const [cmd, ...args] = cmdTrimmed.split(/\s+/);
        const promptLine: TerminalLine = { type: 'input', content: rawInput };
        const newLines: TerminalLine[] = [promptLine];

        try {
            switch (cmd.toLowerCase()) {
                case 'help':
                    newLines.push({
                        type: 'output', content: (
                            <div className="grid grid-cols-1 gap-1 opacity-80 max-w-xl font-mono text-sm">
                                <div className="flex"><span className="w-24 text-yellow-400 font-bold">ls</span> <span>List directory contents</span></div>
                                <div className="flex"><span className="w-24 text-yellow-400 font-bold">cd</span> <span>Change directory</span></div>
                                <div className="flex"><span className="w-24 text-yellow-400 font-bold">cat</span> <span>Print file content</span></div>
                                <div className="flex"><span className="w-24 text-yellow-400 font-bold">open</span> <span>Open file/link</span></div>
                                <div className="flex"><span className="w-24 text-yellow-400 font-bold">clear</span> <span>Clear terminal screen</span></div>
                                <div className="flex"><span className="w-24 text-yellow-400 font-bold">sysinfo</span> <span>Display system info</span></div>
                                <div className="flex"><span className="w-24 text-yellow-400 font-bold">neofetch</span> <span>Display OS logo & info</span></div>
                                <div className="flex"><span className="w-24 text-yellow-400 font-bold">ps</span> <span>List running processes</span></div>
                                <div className="flex"><span className="w-24 text-yellow-400 font-bold">top</span> <span>Monitor system resources</span></div>
                                <div className="flex"><span className="w-24 text-yellow-400 font-bold">docker</span> <span>Container management (Simulated)</span></div>
                                <div className="flex"><span className="w-24 text-yellow-400 font-bold">ping</span> <span>Check network status</span></div>
                                <div className="flex"><span className="w-24 text-yellow-400 font-bold">sing</span> <span>Auditory output protocol</span></div>
                                <div className="flex"><span className="w-24 text-yellow-400 font-bold">matrix</span> <span>Enter the Matrix</span></div>
                                <div className="flex"><span className="w-24 text-yellow-400 font-bold">type</span> <span>Test WPM speed</span></div>
                                <div className="flex"><span className="w-24 text-yellow-400 font-bold">fire</span> <span>Burn the terminal</span></div>
                                <div className="flex"><span className="w-24 text-yellow-400 font-bold">game</span> <span>Play Snake</span></div>
                                <div className="flex"><span className="w-24 text-yellow-400 font-bold">hack</span> <span>Simulate a hack</span></div>
                            </div>
                        )
                    });
                    break;

                case 'sysinfo':
                    newLines.push({ type: 'output', content: <SysInfoOutput /> });
                    break;

                case 'neofetch':
                    newLines.push({ type: 'output', content: <NeofetchOutput /> });
                    break;

                case 'cowsay':
                    newLines.push({ type: 'output', content: <CowsayOutput args={args} /> });
                    break;

                case 'fortune':
                    newLines.push({ type: 'output', content: <FortuneOutput /> });
                    break;

                case 'ps':
                    newLines.push({ type: 'output', content: <PsOutput /> });
                    break;

                case 'ping':
                    setActiveComponent(
                        <PingProcess
                            args={args}
                            onExit={(outputLines) => {
                                setActiveComponent(null);
                                setLines(prev => [...prev, ...outputLines.map(l => ({ type: 'output', content: l } as TerminalLine))]);
                            }}
                            scrollToBottom={scrollToBottom}
                        />
                    );
                    break;

                case 'top':
                    setActiveComponent(
                        <TopProcess
                            onExit={(finalSnapshot) => {
                                setActiveComponent(null);
                                setLines(prev => [...prev, { type: 'output', content: finalSnapshot }]);
                            }}
                            scrollToBottom={scrollToBottom}
                        />
                    );
                    break;

                case 'type':
                    setActiveComponent(<TypeGame onExit={(score) => {
                        setActiveComponent(null);
                        if (score) {
                            setLines(prev => [...prev, { type: 'output', content: <span className="text-green-400">{score}</span> }]);
                        }
                    }} />);
                    break;

                case 'fire':
                    setActiveComponent(<FireEffect onExit={() => setActiveComponent(null)} scrollToBottom={scrollToBottom} />);
                    break;

                case 'docker':
                    if (args.length === 0) {
                        newLines.push({ type: 'output', content: <span className="text-slate-400">Usage: docker [ps | images | run &lt;image&gt;]</span> });
                    } else {
                        switch (args[0]) {
                            case 'ps':
                                newLines.push({ type: 'output', content: <DockerPsOutput /> });
                                break;
                            case 'images':
                                newLines.push({ type: 'output', content: <DockerImagesOutput /> });
                                break;
                            case 'run':
                                const img = args[1] || 'unknown';
                                newLines.push({ type: 'output', content: <DockerRunOutput image={img} /> });
                                break;
                            default:
                                newLines.push({ type: 'output', content: <span className="text-red-400">docker: '{args[0]}' is not a docker command.</span> });
                        }
                    }
                    break;

                case 'ls':
                    const node = getNodeAt(currentPath);
                    if (node && node.type === 'dir') {
                        const children = Object.entries(node.children);
                        const content = (
                            <div className="flex flex-wrap gap-x-6 gap-y-2">
                                {children.map(([name, child]) => (
                                    <span key={name} className={`font-bold ${child.type === 'dir' ? 'text-blue-400' : child.isBinary ? 'text-red-400' : 'text-green-400'}`}>
                                        {name}{child.type === 'dir' ? '/' : child.isBinary ? '*' : ''}
                                    </span>
                                ))}
                            </div>
                        );
                        newLines.push({ type: 'output', content });
                    }
                    break;

                case 'cd':
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
                        } catch (e: any) {
                            newLines.push({ type: 'output', content: <span className="text-red-400">{e.message}</span> });
                        }
                    }
                    break;

                case 'cat':
                    if (args.length === 0) {
                        newLines.push({ type: 'output', content: <span className="text-red-400">cat: missing filename</span> });
                    } else {
                        const fileName = args[0];
                        const targetNode = getNodeAt(currentPath);
                        if (targetNode && targetNode.type === 'dir' && targetNode.children[fileName]) {
                            const file = targetNode.children[fileName];
                            if (file.type === 'file') {
                                if (file.isBinary) {
                                    newLines.push({
                                        type: 'output', content: (
                                            <span className="text-red-400">
                                                Error: Binary file matches. <br />
                                                <span className="opacity-60">Hint: Use <span className="text-yellow-400 font-bold">open {fileName}</span> to view this file.</span>
                                            </span>
                                        )
                                    });
                                } else {
                                    if (typeof file.content === 'string') {
                                        // Attempt Syntax Highlighting
                                        const ext = fileName.split('.').pop() || 'txt';
                                        newLines.push({ type: 'component', content: <SyntaxHighlighter code={file.content} language={ext} /> });
                                    } else {
                                        newLines.push({ type: 'output', content: file.content });
                                    }
                                }
                            } else {
                                newLines.push({ type: 'output', content: <span className="text-red-400">cat: {fileName}: Is a directory</span> });
                            }
                        } else {
                            newLines.push({ type: 'output', content: <span className="text-red-400">cat: {fileName}: No such file or directory</span> });
                        }
                    }
                    break;

                case 'open':
                    if (args.length === 0) {
                        newLines.push({ type: 'output', content: <span className="text-red-400">open: missing filename</span> });
                    } else {
                        const fileName = args[0];
                        const targetNode = getNodeAt(currentPath);
                        if (targetNode && targetNode.type === 'dir' && targetNode.children[fileName]) {
                            const file = targetNode.children[fileName];
                            if (file.type === 'file' && file.url) {
                                newLines.push({ type: 'output', content: <span className="text-green-400">Opening {fileName}...</span> });
                                window.open(file.url, '_blank');
                            } else {
                                newLines.push({ type: 'output', content: <span className="text-red-400">open: {fileName}: No external link associated or is a directory.</span> });
                            }
                        } else {
                            newLines.push({ type: 'output', content: <span className="text-red-400">open: {fileName}: No such file or directory</span> });
                        }
                    }
                    break;

                case 'pwd':
                    newLines.push({ type: 'output', content: currentPath.join('/').replace('~', '/home/visitor') });
                    break;

                case 'whoami':
                    newLines.push({ type: 'output', content: 'visitor' });
                    break;

                case 'clear':
                    setLines([]);
                    return;

                case 'exit':
                    onClose();
                    return;

                // --- Easter Eggs ---
                case 'eastereggs':
                    newLines.push({
                        type: 'output', content: (
                            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm font-mono text-purple-400">
                                <div>hack</div>
                                <div>matrix</div>
                                <div>sing</div>
                                <div>coffee / brew</div>
                                <div>joke</div>
                                <div>coinflip</div>
                                <div>weather</div>
                                <div>sudo</div>
                                <div>rm -rf /</div>
                                <div>vim / nano</div>
                                <div>42</div>
                                <div>whois ankit</div>
                                <div>sysinfo</div>
                                <div>neofetch</div>
                                <div>top</div>
                                <div>ping</div>
                                <div>sl</div>
                                <div>cowsay</div>
                                <div>miner</div>
                                <div>fortune</div>
                                <div>fire</div>
                                <div>docker</div>
                                <div>game</div>
                                <div>party</div>
                                <div>bsod</div>
                            </div>
                        )
                    });
                    break;

                case 'bsod':
                    setBsodTriggered(true);
                    return;

                case 'sudo':
                    if (args.join(' ').includes('rm -rf /')) {
                        setBsodTriggered(true);
                        return;
                    } else if (args.join(' ').includes('make-me-a-sandwich')) {
                        newLines.push({ type: 'output', content: <span className="text-green-400">Okay. 🥪</span> });
                    } else {
                        newLines.push({ type: 'output', content: <span className="text-red-400 font-bold">Permission denied: You are not in the sudoers file. This incident will be reported.</span> });
                    }
                    break;

                case 'matrix':
                    setActiveComponent(<MatrixProcess setMatrixMode={setMatrixMode} onExit={() => setActiveComponent(null)} />);
                    break;

                case 'sl':
                    setActiveComponent(<SteamLocomotive onExit={() => setActiveComponent(null)} scrollToBottom={scrollToBottom} />);
                    break;

                case 'miner':
                    setActiveComponent(<CryptoMiner onExit={() => setActiveComponent(null)} scrollToBottom={scrollToBottom} />);
                    break;

                case 'rm':
                    if (args.includes('-rf') && (args.includes('/') || args.includes('*'))) {
                        setBsodTriggered(true);
                        return;
                    } else {
                        newLines.push({ type: 'output', content: <span className="text-red-400">rm: Permission denied. Protected system.</span> });
                    }
                    break;

                case 'vi':
                case 'vim':
                case 'emacs':
                case 'nano':
                    newLines.push({ type: 'output', content: <span className="text-yellow-400">Vim/Emacs not found. To exit this thought loop, simply click the close button on the top right.</span> });
                    break;

                case 'weather':
                    newLines.push({ type: 'output', content: <span className="text-blue-300">Current weather in Server Room: 21°C, 0% chance of sunlight, 100% chance of bugs.</span> });
                    break;

                case 'coinflip':
                    const result = Math.random() > 0.5 ? 'HEADS' : 'TAILS';
                    newLines.push({ type: 'output', content: <span className="font-bold text-yellow-400">{result}</span> });
                    break;

                case 'hack':
                    setActiveComponent(<HackProcess onExit={() => setActiveComponent(null)} scrollToBottom={scrollToBottom} />);
                    break;

                case 'game':
                    setActiveComponent(<SnakeGame onExit={(score) => {
                        setActiveComponent(null);
                        setLines(prev => [...prev, { type: 'output', content: <span className="text-green-400">Game Over! Score: {score}</span> }]);
                    }} />);
                    break;

                case 'party':
                    setActiveComponent(<PartyParrot onExit={() => setActiveComponent(null)} />);
                    break;

                case 'sing':
                    newLines.push({
                        type: 'component',
                        content: <SingPlayer onFinish={() => { }} />
                    });
                    break;

                case 'coffee':
                case 'brew':
                    newLines.push({ type: 'output', content: <CoffeeOutput /> });
                    break;

                case 'joke':
                    const jokes = [
                        "Why do programmers prefer dark mode? Because light attracts bugs.",
                        "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
                        "I told my wife she was drawing her eyebrows too high. She looked surprised.",
                        "There are 10 types of people in the world: Those who understand binary, and those who don't."
                    ];
                    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
                    newLines.push({ type: 'output', content: <span className="text-cyan-300">{randomJoke}</span> });
                    break;

                case '42':
                    newLines.push({ type: 'output', content: <span className="text-green-400">The Answer to the Ultimate Question of Life, the Universe, and Everything.</span> });
                    break;

                case 'whois':
                    const subArg = args[0]?.toLowerCase();
                    if (!subArg || subArg === 'ankit') {
                        newLines.push({
                            type: 'output', content: (
                                <div className="border border-green-500 p-2 text-green-500 font-mono">
                                    NAME: Ankit Kumar<br />
                                    CLASS: S-Tier Developer<br />
                                    SPECIALTY: Turning Coffee into Code<br />
                                    STATUS: Online & Ready to Hire<br />
                                    <span className="text-slate-500 text-xs mt-1">Try 'whois cse' or 'whois salesforce' for more.</span>
                                </div>
                            )
                        });
                    } else if (['salesforce', 'sf', 'work'].includes(subArg)) {
                        newLines.push({
                            type: 'output', content: (
                                <div className="text-blue-400 font-mono">
                                    <div className="font-bold border-b border-blue-500 mb-1">SALESFORCE IDENTITY</div>
                                    <div>ROLE: Member of Technical Staff (MTS)</div>
                                    <div>TENURE: Aug 2025 - Present</div>
                                    <div>PREVIOUS: Associate MTS (2023-2025)</div>
                                    <div>MISSION: Building enterprise cloud solutions at scale.</div>
                                </div>
                            )
                        });
                    } else if (['cse', 'college', 'iit', 'bhu'].includes(subArg)) {
                        newLines.push({
                            type: 'output', content: (
                                <div className="text-yellow-400 font-mono">
                                    <div className="font-bold border-b border-yellow-500 mb-1">ACADEMIC RECORDS</div>
                                    <div>INSTITUTE: IIT (BHU) Varanasi</div>
                                    <div>DEGREE: B.Tech in Computer Science & Engineering</div>
                                    <div>CLASS: 2023</div>
                                    <div>ACHIEVEMENTS: ICPC Regionalist (Rank 61), Design Head (Codefest).</div>
                                </div>
                            )
                        });
                    } else if (['linkedin', 'social'].includes(subArg)) {
                        newLines.push({
                            type: 'output', content: (
                                <div>
                                    Find me on LinkedIn: <a href="https://www.linkedin.com/in/cgankitsharma/" target="_blank" className="text-blue-400 underline">cgankitsharma</a>
                                </div>
                            )
                        });
                    } else {
                        newLines.push({ type: 'output', content: <span className="text-slate-400">Unknown user or entity: {subArg}. Try 'ankit', 'salesforce', or 'cse'.</span> });
                    }
                    break;

                default:
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
