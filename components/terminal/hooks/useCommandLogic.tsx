
import React, { useState, useEffect } from 'react';
import { TerminalLine, FSNode } from '../TerminalTypes';
import { SysInfoOutput, NeofetchOutput, PsOutput, TopProcess, DockerPsOutput, DockerImagesOutput, DockerRunOutput } from '../commands/SystemCommands';
import { PingProcess } from '../commands/NetworkCommands';
import { CowsayOutput, MatrixProcess, SteamLocomotive, CryptoMiner, TypeGame, SingPlayer, FortuneOutput, FireEffect, CoffeeOutput, HackProcess, SnakeGame, PartyParrot } from '../commands/FunCommands';
import { SyntaxHighlighter } from '../SyntaxHighlighter';
import { SKILLS } from '../../../constants';
import { useAchievements } from '../../../contexts/AchievementContext';

// DevMode Status Component with Toggle
const DevModeStatus: React.FC<{ 
    found: Array<{ key: string; name: string }>; 
    easterEggs: Array<{ key: string; name: string }> 
}> = ({ found, easterEggs }) => {
    const { stats } = useAchievements();
    const [achievementsUnlocked, setAchievementsUnlocked] = useState(() => {
        return localStorage.getItem('achievements_unlocked') === 'true';
    });

    useEffect(() => {
        // Check for changes in localStorage (in case unlocked from another tab/component)
        const checkUnlock = () => {
            const unlocked = localStorage.getItem('achievements_unlocked') === 'true';
            setAchievementsUnlocked(unlocked);
        };
        const interval = setInterval(checkUnlock, 500);
        return () => clearInterval(interval);
    }, []);

    const handleToggle = () => {
        if (!achievementsUnlocked) {
            localStorage.setItem('achievements_unlocked', 'true');
            setAchievementsUnlocked(true);
            // Trigger a custom event to notify Achievements component
            window.dispatchEvent(new Event('achievementsUnlocked'));
        }
    };

    const isDevMode = !!stats.developer_mode;

    return (
        <div className="font-mono text-sm space-y-2">
            <div className="text-green-400 font-bold">Developer Mode Status:</div>
            <div className={isDevMode ? 'text-green-400' : 'text-red-400'}>
                {isDevMode ? '✓ ACTIVE' : '✗ INACTIVE'}
            </div>
            <div className="text-cyan-400 font-bold mt-4">Easter Eggs Found: {found.length}/{easterEggs.length}</div>
            <div className="text-slate-400 text-xs space-y-1">
                {found.map((egg, idx) => (
                    <div key={idx} className="text-green-400">✓ {egg.name}</div>
                ))}
                {easterEggs.filter(egg => !found.some(f => f.key === egg.key)).map((egg, idx) => (
                    <div key={idx} className="text-slate-600">✗ {egg.name}</div>
                ))}
            </div>
            {!isDevMode && (
                <div className="text-yellow-400 text-xs mt-2">💡 Tip: Try the Konami code to unlock developer mode!</div>
            )}
            <div className="text-cyan-400 font-bold mt-4">Achievements Panel:</div>
            <div className="flex items-center gap-3">
                <div className={achievementsUnlocked ? 'text-green-400' : 'text-red-400'}>
                    {achievementsUnlocked ? '✓ UNLOCKED' : '✗ LOCKED'}
                </div>
                {!achievementsUnlocked && (
                    <button
                        onClick={handleToggle}
                        className="px-3 py-1 bg-primary hover:bg-indigo-600 text-white text-xs font-bold rounded transition-colors border border-primary/50 hover:border-primary"
                    >
                        [UNLOCK]
                    </button>
                )}
            </div>
            {achievementsUnlocked && (
                <div className="text-green-400 text-xs mt-1">The achievements button is now visible in the bottom-left corner.</div>
            )}
        </div>
    );
};

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
        const commandList = [
            'help', 'ls', 'cd', 'cat', 'open', 'clear', 'sysinfo', 'neofetch', 
            'ps', 'top', 'ping', 'sing', 'matrix', 'type', 'sl', 'miner', 
            'cowsay', 'whoami', 'pwd', 'exit', 'sudo', 'rm', 'vim', 'vi', 
            'nano', 'emacs', 'weather', 'coinflip', 'hack', 'coffee', 'brew', 
            'joke', '42', 'eastereggs', 'whois', 'fortune', 'fire', 'docker', 
            'game', 'party', 'bsod', 'skills', 'resume', 'devmode', 'developer', 'history', 'tree'
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
                                <div className="flex"><span className="w-24 text-yellow-400 font-bold">skills</span> <span>Show skills (--graph, --level)</span></div>
                                <div className="flex"><span className="w-24 text-yellow-400 font-bold">resume</span> <span>Display resume in terminal</span></div>
                                <div className="flex"><span className="w-24 text-yellow-400 font-bold">devmode</span> <span>Show developer mode status (unlock achievements)</span></div>
                                <div className="flex"><span className="w-24 text-yellow-400 font-bold">history</span> <span>Show command history</span></div>
                                <div className="flex"><span className="w-24 text-yellow-400 font-bold">tree</span> <span>Display directory tree structure</span></div>
                                <div className="flex"><span className="w-24 text-yellow-400 font-bold">eastereggs</span> <span>List all easter eggs</span></div>
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
                    trackEvent('cowsay_used', true);
                    newLines.push({ type: 'output', content: <CowsayOutput args={args} /> });
                    break;

                case 'fortune':
                    trackEvent('fortune_used', true);
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
                    trackEvent('typing_test', true);
                    setActiveComponent(<TypeGame onExit={(score) => {
                        setActiveComponent(null);
                        if (score) {
                            setLines(prev => [...prev, { type: 'output', content: <span className="text-green-400">{score}</span> }]);
                        }
                    }} />);
                    break;

                case 'fire':
                    trackEvent('fire_used', true);
                    setActiveComponent(<FireEffect onExit={() => setActiveComponent(null)} scrollToBottom={scrollToBottom} />);
                    break;

                case 'docker':
                    trackEvent('docker_used', true);
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
                        } catch (e) {
                            const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
                            newLines.push({ type: 'output', content: <span className="text-red-400">{errorMessage}</span> });
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

                case 'skills':
                    // Skill level mapping (for consistent display)
                    const skillLevels: { [key: string]: number } = {
                        "C++": 90,
                        "JavaScript": 85,
                        "HTML": 80,
                        "Spring Boot": 75,
                        "Flutter": 70,
                        "AWS": 65,
                        "Material UI": 60,
                        "Data Structures": 95,
                        "Algorithms": 95,
                        "Competitive Programming": 90
                    };

                    if (args[0] === '--graph' || args[0] === '-g') {
                        const maxLength = Math.max(...SKILLS.map(s => s.length));
                        newLines.push({
                            type: 'output',
                            content: (
                                <div className="font-mono text-sm space-y-1">
                                    <div className="text-green-400 mb-2">Skills Proficiency Graph:</div>
                                    {SKILLS.map((skill, idx) => {
                                        const level = skillLevels[skill] || 70;
                                        const barLength = Math.floor(level / 5);
                                        const bar = '█'.repeat(barLength) + '░'.repeat(20 - barLength);
                                        return (
                                            <div key={idx} className="flex items-center gap-2">
                                                <span className="text-cyan-400 w-32">{skill.padEnd(maxLength)}</span>
                                                <span className="text-yellow-400">{bar}</span>
                                                <span className="text-green-400">{level}%</span>
                                            </div>
                                        );
                                    })}
                                    <div className="text-slate-500 text-xs mt-2">Note: These percentages are completely made up. But I'm good at them! 😎</div>
                                </div>
                            )
                        });
                    } else if (args[0] === '--level' || args[0] === '-l') {
                        const maxLength = Math.max(...SKILLS.map(s => s.length));
                        newLines.push({
                            type: 'output',
                            content: (
                                <div className="font-mono text-sm space-y-1">
                                    <div className="text-green-400 mb-2">Skills with Proficiency Levels:</div>
                                    {SKILLS.map((skill, idx) => {
                                        const level = skillLevels[skill] || 70;
                                        const levelText = level >= 90 ? 'Expert' : level >= 75 ? 'Advanced' : level >= 60 ? 'Intermediate' : 'Beginner';
                                        const levelColor = level >= 90 ? 'text-green-400' : level >= 75 ? 'text-yellow-400' : level >= 60 ? 'text-cyan-400' : 'text-slate-400';
                                        return (
                                            <div key={idx} className="flex items-center gap-2">
                                                <span className="text-cyan-400 w-40">{skill.padEnd(maxLength)}</span>
                                                <span className={`${levelColor} font-bold`}>{levelText}</span>
                                                <span className="text-slate-500">({level}%)</span>
                                            </div>
                                        );
                                    })}
                                    <div className="text-slate-500 text-xs mt-2">Use 'skills --graph' for a visual bar representation</div>
                                </div>
                            )
                        });
                    } else {
                        newLines.push({
                            type: 'output',
                            content: (
                                <div className="font-mono text-sm">
                                    <div className="text-green-400 mb-2">Available Skills:</div>
                                    <div className="text-cyan-400">{SKILLS.join(', ')}</div>
                                    <div className="text-slate-500 text-xs mt-2">Use 'skills --graph' for a visual representation</div>
                                    <div className="text-slate-500 text-xs">Use 'skills --level' to see proficiency levels</div>
                                </div>
                            )
                        });
                    }
                    break;

                case 'resume':
                    newLines.push({
                        type: 'output',
                        content: (
                            <div className="font-mono text-sm space-y-2">
                                <div className="text-green-400">═══════════════════════════════════════════════════════</div>
                                <div className="text-white font-bold text-lg">ANKIT KUMAR</div>
                                <div className="text-cyan-400">Member of Technical Staff @ Salesforce</div>
                                <div className="text-slate-400">═══════════════════════════════════════════════════════</div>
                                
                                <div className="text-yellow-400 mt-4 font-bold">EDUCATION</div>
                                <div className="text-white">IIT (BHU) Varanasi - B.Tech CSE (2019-2023)</div>
                                <div className="text-slate-400">Rank 61 - ICPC Regionals</div>
                                
                                <div className="text-yellow-400 mt-4 font-bold">EXPERIENCE</div>
                                <div className="text-white">Member of Technical Staff @ Salesforce (Aug 2025 - Present)</div>
                                <div className="text-slate-400">  • Working with cutting-edge enterprise cloud solutions</div>
                                <div className="text-white">Associate MTS @ Salesforce (June 2023 - Aug 2025)</div>
                                <div className="text-slate-400">  • Contributed to core platform development</div>
                                <div className="text-white">Full Stack Developer @ Scapia (Dec 2022 - April 2023)</div>
                                <div className="text-slate-400">  • Travel-Now-Pay-Later vertical (Spring Boot + Flutter)</div>
                                
                                <div className="text-yellow-400 mt-4 font-bold">SKILLS</div>
                                <div className="text-cyan-400">C++, JavaScript, HTML, Spring Boot, Flutter, AWS, Material UI</div>
                                
                                <div className="text-yellow-400 mt-4 font-bold">CONTACT</div>
                                <div className="text-white">Email: cgankitsharma@gmail.com</div>
                                <div className="text-white">LinkedIn: linkedin.com/in/cgankitsharma</div>
                                <div className="text-white">GitHub: github.com/AnonySharma</div>
                                
                                <div className="text-green-400 mt-4">═══════════════════════════════════════════════════════</div>
                                <div className="text-slate-500 text-xs">Type 'download resume' or click the download button for PDF version</div>
                            </div>
                        )
                    });
                    break;

                case 'history':
                    if (commandHistory.length === 0) {
                        newLines.push({ type: 'output', content: <span className="text-slate-500">No commands in history yet.</span> });
                    } else {
                        newLines.push({
                            type: 'output',
                            content: (
                                <div className="font-mono text-sm space-y-1">
                                    <div className="text-green-400 font-bold mb-2">Command History ({commandHistory.length} commands):</div>
                                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                        {commandHistory.map((cmd, idx) => (
                                            <div key={idx} className="flex items-start gap-3 text-slate-300">
                                                <span className="text-slate-600 text-xs w-8 flex-shrink-0">{idx + 1}</span>
                                                <span className="flex-1">{cmd}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-slate-500 text-xs mt-2">Use ↑/↓ arrow keys to navigate history</div>
                                </div>
                            )
                        });
                    }
                    break;

                case 'tree':
                    const buildTree = (node: FSNode, prefix: string = '', isLast: boolean = true, depth: number = 0, nodeName: string = '~'): string[] => {
                        if (depth > 5) return []; // Limit depth
                        const lines: string[] = [];
                        const connector = isLast ? '└── ' : '├── ';
                        lines.push(prefix + connector + nodeName);
                        
                        if (node.type === 'dir' && node.children) {
                            const children = Object.entries(node.children);
                            children.forEach(([childName, childNode], index) => {
                                const isLastChild = index === children.length - 1;
                                const newPrefix = prefix + (isLast ? '    ' : '│   ');
                                lines.push(...buildTree(childNode, newPrefix, isLastChild, depth + 1, childName));
                            });
                        }
                        return lines;
                    };
                    
                    const rootNode = fileSystem['~'];
                    if (rootNode) {
                        const treeLines = buildTree(rootNode);
                        newLines.push({
                            type: 'output',
                            content: (
                                <pre className="font-mono text-sm text-green-400 whitespace-pre overflow-x-auto">
                                    {treeLines.join('\n')}
                                </pre>
                            )
                        });
                    } else {
                        newLines.push({ type: 'output', content: <span className="text-red-400">tree: cannot access filesystem</span> });
                    }
                    break;

                case 'clear':
                    setLines([]);
                    return;

                case 'exit':
                    onClose();
                    return;

                // --- Easter Eggs ---
                case 'devmode':
                case 'developer':
                    // Check if unlock subcommand
                    if (args[0] === 'unlock' && args[1] === 'achievements') {
                        localStorage.setItem('achievements_unlocked', 'true');
                        newLines.push({
                            type: 'output',
                            content: (
                                <div className="font-mono text-sm space-y-2">
                                    <div className="text-green-400 font-bold">✓ Achievements panel unlocked!</div>
                                    <div className="text-slate-400 text-xs">The achievements button is now visible in the bottom-left corner.</div>
                                    <div className="text-slate-400 text-xs">This will persist across future visits.</div>
                                </div>
                            )
                        });
                        break;
                    }
                    
                    // Default devmode status display
                    const easterEggs = [
                        { key: 'konami_unlocked', name: 'Konami Code' },
                        { key: 'logo_clicked_10', name: 'Logo Clicker (10x)' },
                        { key: 'sudo_sandwich', name: 'Sudo Sandwich' },
                        { key: 'hack_attempted', name: 'Hack Command' },
                        { key: 'fortune_used', name: 'Fortune' },
                        { key: 'coffee_used', name: 'Coffee/Brew' },
                        { key: 'joke_used', name: 'Joke' },
                        { key: 'answer_42', name: 'Answer 42' },
                        { key: 'whois_used', name: 'Whois' },
                        { key: 'docker_used', name: 'Docker' },
                        { key: 'snake_played', name: 'Snake Game' },
                        { key: 'party_started', name: 'Party' },
                        { key: 'fire_used', name: 'Fire' },
                        { key: 'typing_test', name: 'Typing Test' },
                        { key: 'cowsay_used', name: 'Cowsay' },
                        { key: 'bsod_triggered', name: 'BSOD' }
                    ];
                    const found = easterEggs.filter(egg => !!stats[egg.key]);
                    newLines.push({
                        type: 'output',
                        content: (
                            <DevModeStatus 
                                found={found}
                                easterEggs={easterEggs}
                            />
                        )
                    });
                    break;

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
                    trackEvent('bsod_triggered', true);
                    setBsodTriggered(true);
                    return;

                case 'sudo':
                    if (args.join(' ').includes('rm -rf /')) {
                        trackEvent('bsod_triggered', true);
                        setBsodTriggered(true);
                        return;
                    } else if (args.join(' ').includes('make-me-a-sandwich')) {
                        trackEvent('sudo_sandwich', true);
                        newLines.push({ type: 'output', content: <span className="text-green-400">Okay. 🥪</span> });
                    } else {
                        newLines.push({ type: 'output', content: <span className="text-red-400 font-bold">Permission denied: You are not in the sudoers file. This incident will be reported.</span> });
                    }
                    break;

                case 'matrix':
                    trackEvent('matrix_activated', true);
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
                        trackEvent('bsod_triggered', true);
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
                    trackEvent('hack_attempted', true);
                    setActiveComponent(<HackProcess onExit={() => setActiveComponent(null)} scrollToBottom={scrollToBottom} />);
                    break;

                case 'game':
                    trackEvent('snake_played', true);
                    setActiveComponent(<SnakeGame onExit={(score) => {
                        setActiveComponent(null);
                        setLines(prev => [...prev, { type: 'output', content: <span className="text-green-400">Game Over! Score: {score}</span> }]);
                    }} />);
                    break;

                case 'party':
                    trackEvent('party_started', true);
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
                    trackEvent('coffee_used', true);
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
                    trackEvent('answer_42', true);
                    newLines.push({ type: 'output', content: <span className="text-green-400">The Answer to the Ultimate Question of Life, the Universe, and Everything.</span> });
                    break;

                case 'whois':
                    trackEvent('whois_used', true);
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
