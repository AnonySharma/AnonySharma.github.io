
import React, { useState, useEffect } from 'react';
import { TerminalLine, FSNode } from '../TerminalTypes';
import { SysInfoOutput, NeofetchOutput, PsOutput, TopProcess, DockerPsOutput, DockerImagesOutput, DockerRunOutput, SkillsOutput, ResumeOutput, HistoryOutput, TreeOutput, HelpOutput, WhoamiOutput, DateOutput, WhoOutput, RebootOutput, ScreensaverOutput, DevModeUnlockOutput, DockerUsageOutput, DockerErrorOutput, TypeGameScoreOutput, GameOverScoreOutput } from '../commands/SystemCommands';
import { PingProcess } from '../commands/NetworkCommands';
import { CowsayOutput, MatrixProcess, SteamLocomotive, CryptoMiner, TypeGame, SingPlayer, FortuneOutput, FireEffect, CoffeeOutput, HackProcess, SnakeGame, PartyParrot, JokeOutput, Answer42Output, WhoisOutput, EasterEggsOutput, StonksOutput, WeatherOutput, CoinflipOutput, YeetOutput, IncognitoOnOutput, IncognitoOffOutput, TouchGrassOutput, TouchErrorOutput, SudoSandwichOutput, SudoPermissionDeniedOutput, VimOutput, OpenSuccessOutput, SystemPanic } from '../commands/FunCommands';
import { LsOutput, CatBinaryError, CatFileOutput } from '../commands/FileCommands';
import { SKILLS } from '../../../constants';
import { useAchievements } from '../../../contexts/AchievementContext';
import { DevModeStatus } from '../ui/DevModeStatus';

// Centralized Commands Configuration
interface CommandInfo {
    name: string;
    description: string;
    aliases?: string[]; // For commands like 'developer' -> 'devmode', 'brew' -> 'coffee'
    category?: 'fun' | 'system' | 'file' | 'info' | 'network' | 'terminal'; // For filtering easter eggs
}

export const COMMANDS: CommandInfo[] = [
    // File System
    { name: 'ls', description: 'List directory contents', category: 'file' },
    { name: 'cd', description: 'Change directory', category: 'file' },
    { name: 'cat', description: 'Print file content', category: 'file' },
    { name: 'open', description: 'Open file/link', category: 'file' },
    { name: 'pwd', description: 'Print working directory', category: 'file' },
    { name: 'tree', description: 'Display directory tree structure', category: 'file' },
    
    // System Info
    { name: 'sysinfo', description: 'Display system info', category: 'system' },
    { name: 'neofetch', description: 'Display OS logo & info', category: 'system' },
    { name: 'ps', description: 'List running processes', category: 'system' },
    { name: 'top', description: 'Monitor system resources', category: 'system' },
    { name: 'date', description: 'Show current date/time', category: 'system' },
    { name: 'who', description: 'Show logged in users', category: 'system' },
    { name: 'whoami', description: 'Display current user', category: 'info' },
    { name: 'reboot', description: 'Reboot the system', category: 'system' },
    
    // Network
    { name: 'ping', description: 'Check network status', category: 'network' },
    
    // Docker
    { name: 'docker', description: 'Container management (Simulated)', category: 'system' },
    
    // Terminal Control
    { name: 'clear', description: 'Clear terminal screen', category: 'terminal' },
    { name: 'exit', description: 'Exit terminal', category: 'terminal' },
    { name: 'history', description: 'Show command history', category: 'terminal' },
    
    // Skills & Resume
    { name: 'skills', description: 'Show skills (--graph, --level)', category: 'info' },
    { name: 'resume', description: 'Display resume in terminal', category: 'info' },
    
    // Developer Tools
    { name: 'devmode', description: 'Show developer mode status (unlock achievements)', aliases: ['developer'], category: 'system' },
    { name: 'eastereggs', description: 'List all easter eggs', category: 'fun' },
    
    // Fun Commands
    { name: 'sing', description: 'Auditory output protocol', category: 'fun' },
    { name: 'matrix', description: 'Enter the Matrix', category: 'fun' },
    { name: 'type', description: 'Test WPM speed', category: 'fun' },
    { name: 'fire', description: 'Burn the terminal', category: 'fun' },
    { name: 'game', description: 'Play Snake', category: 'fun' },
    { name: 'hack', description: 'Simulate a hack', category: 'fun' },
    { name: 'coffee', description: 'Brew some coffee', aliases: ['brew'], category: 'fun' },
    { name: 'joke', description: 'Tell a joke', category: 'fun' },
    { name: '42', description: 'The answer to everything', category: 'fun' },
    { name: 'whois', description: 'Lookup user information', category: 'fun' },
    { name: 'fortune', description: 'Get a fortune cookie', category: 'fun' },
    { name: 'cowsay', description: 'Make a cow say something', category: 'fun' },
    { name: 'sl', description: 'Steam locomotive', category: 'fun' },
    { name: 'miner', description: 'Mine cryptocurrency (fake)', category: 'fun' },
    { name: 'party', description: 'Start the party', category: 'fun' },
    { name: 'weather', description: 'Check server room weather', category: 'fun' },
    { name: 'coinflip', description: 'Flip a coin', category: 'fun' },
    { name: 'screensaver', description: 'Activate screensaver', category: 'fun' },
    
    // System Commands
    { name: 'sudo', description: 'Execute as superuser', category: 'fun' },
    { name: 'rm', description: 'Remove files (protected)', category: 'fun' },
    { name: 'vim', description: 'Open vim editor (simulated)', aliases: ['vi', 'nano', 'emacs'], category: 'fun' },
    
    // New Commands
    { name: 'touch', description: 'Touch command (try: touch grass)', category: 'fun' },
    { name: 'yeet', description: 'Yeet the terminal away', category: 'fun' },
    { name: 'stonks', description: 'Check crypto portfolio', category: 'fun' },
    { name: 'incognito', description: 'Toggle dark mode', category: 'fun' },
    
    // Help
    { name: 'help', description: 'Show this help message', category: 'system' },
    { name: 'bsod', description: 'Trigger blue screen of death', category: 'fun' },
];

// Get all command names including aliases for tab completion
export const getAllCommandNames = (): string[] => {
    const names: string[] = [];
    COMMANDS.forEach(cmd => {
        names.push(cmd.name);
        if (cmd.aliases) {
            names.push(...cmd.aliases);
        }
    });
    return names;
};

// Get command description by name (checks aliases too)
export const getCommandDescription = (commandName: string): string | undefined => {
    const cmd = COMMANDS.find(c => 
        c.name === commandName || 
        (c.aliases && c.aliases.includes(commandName))
    );
    return cmd?.description;
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

    // --- Command Handlers Map ---
    type CommandHandler = (args: string[], newLines: TerminalLine[]) => 'exit' | 'clear' | void;
    
    const handlers: Record<string, CommandHandler> = {
        help: (args, newLines) => {
            newLines.push({ type: 'output', content: <HelpOutput commands={COMMANDS} /> });
        },
        
        sysinfo: (args, newLines) => {
                    newLines.push({ type: 'output', content: <SysInfoOutput /> });
        },

        neofetch: (args, newLines) => {
                    newLines.push({ type: 'output', content: <NeofetchOutput /> });
        },
        
        eastereggs: (args, newLines) => {
            newLines.push({ type: 'output', content: <EasterEggsOutput commands={COMMANDS} /> });
        },
        
        cowsay: (args, newLines) => {
            trackEvent('cowsay_used', true);
                    newLines.push({ type: 'output', content: <CowsayOutput args={args} /> });
        },

        fortune: (args, newLines) => {
            trackEvent('fortune_used', true);
                    newLines.push({ type: 'output', content: <FortuneOutput /> });
        },

        ps: (args, newLines) => {
                    newLines.push({ type: 'output', content: <PsOutput /> });
        },

        ping: (args, newLines) => {
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
        },

        top: (args, newLines) => {
                    setActiveComponent(
                        <TopProcess
                            onExit={(finalSnapshot) => {
                                setActiveComponent(null);
                                setLines(prev => [...prev, { type: 'output', content: finalSnapshot }]);
                            }}
                            scrollToBottom={scrollToBottom}
                        />
                    );
        },

        type: (args, newLines) => {
            trackEvent('typing_test', true);
                    setActiveComponent(<TypeGame onExit={(score) => {
                        setActiveComponent(null);
                        if (score) {
                    setLines(prev => [...prev, { type: 'output', content: <TypeGameScoreOutput score={score} /> }]);
                        }
                    }} />);
        },

        fire: (args, newLines) => {
            trackEvent('fire_used', true);
                    setActiveComponent(<FireEffect onExit={() => setActiveComponent(null)} scrollToBottom={scrollToBottom} />);
        },

        docker: (args, newLines) => {
            trackEvent('docker_used', true);
                    if (args.length === 0) {
                newLines.push({ type: 'output', content: <DockerUsageOutput /> });
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
                        newLines.push({ type: 'output', content: <DockerErrorOutput command={args[0]} /> });
                        }
                    }
        },

        ls: (args, newLines) => {
            const showHidden = args.includes('-a') || args.includes('--all');
                    const node = getNodeAt(currentPath);
                    if (node && node.type === 'dir') {
                const children = Object.entries(node.children)
                    .filter(([name]) => showHidden || !name.startsWith('.'));
                newLines.push({ type: 'output', content: <LsOutput children={children} /> });
            }
        },
        
        reboot: (args, newLines) => {
            newLines.push({ type: 'output', content: <RebootOutput /> });
            setTimeout(() => {
                localStorage.removeItem('terminal_booted');
                window.location.reload();
            }, 1000);
        },
        
        date: (args, newLines) => {
            newLines.push({ type: 'output', content: <DateOutput /> });
        },
        
        who: (args, newLines) => {
            newLines.push({ type: 'output', content: <WhoOutput /> });
        },
        
        cd: (args, newLines) => {
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

        cat: (args, newLines) => {
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

        open: (args, newLines) => {
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

        pwd: (args, newLines) => {
                    newLines.push({ type: 'output', content: currentPath.join('/').replace('~', '/home/visitor') });
        },
        
        whoami: (args, newLines) => {
            newLines.push({ type: 'output', content: <WhoamiOutput /> });
        },
        
        skills: (args, newLines) => {
            newLines.push({ type: 'output', content: <SkillsOutput args={args} skills={SKILLS} /> });
        },
        
        resume: (args, newLines) => {
            newLines.push({ type: 'output', content: <ResumeOutput /> });
        },
        
        history: (args, newLines) => {
            newLines.push({ type: 'output', content: <HistoryOutput commandHistory={commandHistory} /> });
        },
        
        tree: (args, newLines) => {
            newLines.push({ type: 'output', content: <TreeOutput fileSystem={fileSystem} /> });
        },
        
        clear: (args, newLines) => {
                    setLines([]);
            return 'clear' as const;
        },

        exit: (args, newLines) => {
                    onClose();
            return 'exit' as const;
        },
        
        devmode: (args, newLines) => {
            if (args[0] === 'unlock' && args[1] === 'achievements') {
                localStorage.setItem('achievements_unlocked', 'true');
                newLines.push({ type: 'output', content: <DevModeUnlockOutput /> });
                    return;
            }
            
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
                { key: 'bsod_triggered', name: 'BSOD' },
                { key: 'screensaver_active', name: 'Screensaver' }
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
        },
        
        developer: (args, newLines) => {
            handlers.devmode(args, newLines);
        },
        
        screensaver: (args, newLines) => {
            setTimeout(() => {
                window.dispatchEvent(new Event('force_screensaver'));
            }, 100);
            newLines.push({ type: 'output', content: <ScreensaverOutput /> });
        },
        
        bsod: (args, newLines) => {
            trackEvent('bsod_triggered', true);
                    setBsodTriggered(true);
            return 'exit' as const;
        },

        sudo: (args, newLines) => {
                    if (args.join(' ').includes('rm -rf /')) {
                trackEvent('bsod_triggered', true);
                setActiveComponent(<SystemPanic onReset={() => setBsodTriggered(true)} />);
                    } else if (args.join(' ').includes('make-me-a-sandwich')) {
                trackEvent('sudo_sandwich', true);
                newLines.push({ type: 'output', content: <SudoSandwichOutput /> });
                    } else {
                newLines.push({ type: 'output', content: <SudoPermissionDeniedOutput /> });
                    }
        },

        matrix: (args, newLines) => {
            trackEvent('matrix_activated', true);
                    setActiveComponent(<MatrixProcess setMatrixMode={setMatrixMode} onExit={() => setActiveComponent(null)} />);
        },

        sl: (args, newLines) => {
                    setActiveComponent(<SteamLocomotive onExit={() => setActiveComponent(null)} scrollToBottom={scrollToBottom} />);
        },

        miner: (args, newLines) => {
                    setActiveComponent(<CryptoMiner onExit={() => setActiveComponent(null)} scrollToBottom={scrollToBottom} />);
        },

        rm: (args, newLines) => {
                    if (args.includes('-rf') && (args.includes('/') || args.includes('*'))) {
                trackEvent('bsod_triggered', true);
                setActiveComponent(<SystemPanic onReset={() => setBsodTriggered(true)} />);
                    } else {
                        newLines.push({ type: 'output', content: <span className="text-red-400">rm: Permission denied. Protected system.</span> });
                    }
        },
        
        vim: (args, newLines) => {
            newLines.push({ type: 'output', content: <VimOutput /> });
        },
        
        vi: (args, newLines) => {
            handlers.vim(args, newLines);
        },
        
        emacs: (args, newLines) => {
            handlers.vim(args, newLines);
        },
        
        nano: (args, newLines) => {
            handlers.vim(args, newLines);
        },
        
        weather: (args, newLines) => {
            newLines.push({ type: 'output', content: <WeatherOutput /> });
        },
        
        coinflip: (args, newLines) => {
            newLines.push({ type: 'output', content: <CoinflipOutput /> });
        },
        
        hack: (args, newLines) => {
            trackEvent('hack_attempted', true);
                    setActiveComponent(<HackProcess onExit={() => setActiveComponent(null)} scrollToBottom={scrollToBottom} />);
        },

        game: (args, newLines) => {
            trackEvent('snake_played', true);
                    setActiveComponent(<SnakeGame onExit={(score) => {
                        setActiveComponent(null);
                setLines(prev => [...prev, { type: 'output', content: <GameOverScoreOutput score={score} /> }]);
                    }} />);
        },

        party: (args, newLines) => {
            trackEvent('party_started', true);
                    setActiveComponent(<PartyParrot onExit={() => setActiveComponent(null)} />);
        },

        sing: (args, newLines) => {
                    newLines.push({
                        type: 'component',
                        content: <SingPlayer onFinish={() => { }} />
                    });
        },

        coffee: (args, newLines) => {
            trackEvent('coffee_used', true);
                    newLines.push({ type: 'output', content: <CoffeeOutput /> });
        },
        
        brew: (args, newLines) => {
            handlers.coffee(args, newLines);
        },
        
        joke: (args, newLines) => {
            trackEvent('joke_used', true);
            newLines.push({ type: 'output', content: <JokeOutput /> });
        },
        
        '42': (args, newLines) => {
            trackEvent('answer_42', true);
            newLines.push({ type: 'output', content: <Answer42Output /> });
        },
        
        whois: (args, newLines) => {
            trackEvent('whois_used', true);
            newLines.push({ type: 'output', content: <WhoisOutput args={args} /> });
        },
        
        stonks: (args, newLines) => {
            newLines.push({ type: 'output', content: <StonksOutput /> });
        },
        
        yeet: (args, newLines) => {
            const terminalElement = document.getElementById('terminal-container');
            if (terminalElement) {
                terminalElement.classList.add('yeet-animation');
                setTimeout(() => {
                    terminalElement.classList.remove('yeet-animation');
                    setLines([]);
                }, 1000);
            }
            newLines.push({ type: 'output', content: <YeetOutput /> });
        },
        
        incognito: (args, newLines) => {
            const termEl = document.getElementById('terminal-container');
            if (termEl) {
                termEl.classList.toggle('incognito-mode');
                if (termEl.classList.contains('incognito-mode')) {
                    newLines.push({ type: 'output', content: <IncognitoOnOutput /> });
                } else {
                    newLines.push({ type: 'output', content: <IncognitoOffOutput /> });
                }
            }
        },
        
        touch: (args, newLines) => {
            if (args.join(' ') === 'grass') {
                newLines.push({ type: 'output', content: <TouchGrassOutput /> });
                setTimeout(() => {
                    window.open('https://www.google.com/maps/search/parks+near+me', '_blank');
                }, 1500);
                    } else {
                newLines.push({ type: 'output', content: <TouchErrorOutput /> });
            }
        },
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
