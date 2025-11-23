
import React, { useState, useEffect, useRef } from 'react';
import { Monitor } from 'lucide-react';
import { PROFILE_CONFIG, getTitleWithCompany } from '../../../config';
import { SKILLS } from '../../../constants';

export const SysInfoOutput = () => {
  const [repoCount, setRepoCount] = useState<string>('Loading...');
  const [stars, setStars] = useState<string>('Loading...');
  const [followers, setFollowers] = useState<string>('Loading...');

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const response = await fetch(`https://api.github.com/users/${PROFILE_CONFIG.social.github.username}`);
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setRepoCount(data.public_repos.toString());
            setFollowers(data.followers.toString());
            
            // To get total stars, we'd need to fetch all repos, but that's heavy.
            // Let's just use a hardcoded base + some random logic or leave it as a static estimate for now 
            // or try to fetch repos if user has few.
            // For now, let's just show public_gists as "snippets" or something similar if stars is too hard.
            // Actually, let's try to fetch repos for stars.
            const reposRes = await fetch(`https://api.github.com/users/${PROFILE_CONFIG.social.github.username}/repos?per_page=100`);
            if (reposRes.ok) {
                const repos = await reposRes.json();
                const starCount = repos.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0);
                setStars(starCount.toString());
            } else {
                setStars('N/A');
            }

        } catch (e) {
            setRepoCount('Error');
            setStars('Error');
            setFollowers('Error');
        }
    };
    fetchStats();
  }, []);

  return (
  <div className="font-mono text-sm space-y-1 mb-2">
    <div className="flex items-center gap-2 text-slate-400 border-b border-slate-700 pb-1 mb-2">
        <Monitor size={14} /> <span>SYSTEM DIAGNOSTICS (LIVE)</span>
    </div>
    <div>OS: <span className="text-white">{PROFILE_CONFIG.terminal.osName} {PROFILE_CONFIG.terminal.osVersion}</span> (x86_64)</div>
    <div>Kernel: <span className="text-blue-400">{PROFILE_CONFIG.terminal.kernel}</span></div>
    <div>Uptime: <span className="text-green-400">42 days, 7 hours, 12 mins</span></div>
    <div>Shell: <span className="text-yellow-400">{PROFILE_CONFIG.terminal.shell}</span></div>
    <div className="flex gap-2">
        CPU: <span className="text-white">Neural Quantum Processor (128-core) @ 4.20GHz</span>
        <span className="text-slate-500">[Temp: 45°C]</span>
    </div>
    <div>
        Memory: <span className="text-white">64GB / 128GB</span> 
        <span className="text-green-400 ml-2">[||||||||||----------] 50%</span>
    </div>
    <div className="mt-2 border-t border-slate-800 pt-2">
        <div className="text-slate-400 mb-1">GITHUB METRICS:</div>
        <div>Public Repos: <span className="text-cyan-400">{repoCount}</span></div>
        <div>Total Stars: <span className="text-yellow-400">{stars}</span></div>
        <div>Followers: <span className="text-purple-400">{followers}</span></div>
    </div>
    <div className="flex gap-2 items-center mt-2">
        Network: <span className="text-green-400">Connected (10Gbps uplink)</span> 
        <span className="text-slate-500 text-xs">IP: 127.0.0.1 (Localhost)</span>
    </div>
  </div>
);
};

export const NeofetchOutput = () => (
    <div className="flex gap-6 font-mono text-sm mb-2 text-slate-300 flex-col sm:flex-row items-start">
        <div className="text-primary font-bold select-none leading-none">
<pre className="whitespace-pre font-mono text-primary">
{`    ___    __ __
   /   |  / //_/
  / /| | / , <   
 / ___ |/ /| |  
/_/  |_/_/ |_|  `}
</pre>
        </div>
        <div className="space-y-1">
            <div><span className="text-primary font-bold">{PROFILE_CONFIG.terminal.username}</span>@<span className="text-primary font-bold">{PROFILE_CONFIG.terminal.hostname}</span></div>
            <div className="text-slate-500">-----------------</div>
            <div><span className="text-yellow-400 font-bold">OS</span>: {PROFILE_CONFIG.terminal.osName} {PROFILE_CONFIG.terminal.osVersion}</div>
            <div><span className="text-yellow-400 font-bold">Host</span>: Web Browser (Chrome V8)</div>
            <div><span className="text-yellow-400 font-bold">Kernel</span>: 5.15.0-generic</div>
            <div><span className="text-yellow-400 font-bold">Uptime</span>: 42 days, 7 hrs, 12 mins</div>
            <div><span className="text-yellow-400 font-bold">Shell</span>: zsh 5.8 (portfolio-theme)</div>
            <div><span className="text-yellow-400 font-bold">Resolution</span>: 1920x1080</div>
            <div><span className="text-yellow-400 font-bold">CPU</span>: Silicon Brain (1) @ 100%</div>
            <div><span className="text-yellow-400 font-bold">Memory</span>: 1337MiB / 8192MiB</div>
            <div className="mt-2 flex gap-1">
                <span className="w-3 h-3 bg-black"></span>
                <span className="w-3 h-3 bg-red-500"></span>
                <span className="w-3 h-3 bg-green-500"></span>
                <span className="w-3 h-3 bg-yellow-500"></span>
                <span className="w-3 h-3 bg-blue-500"></span>
                <span className="w-3 h-3 bg-purple-500"></span>
                <span className="w-3 h-3 bg-cyan-500"></span>
                <span className="w-3 h-3 bg-white"></span>
            </div>
        </div>
    </div>
);

export const PsOutput = () => {
    const processes = [
        { pid: 1, user: 'root', cpu: 0.1, mem: 0.2, cmd: 'init' },
        { pid: 420, user: PROFILE_CONFIG.terminal.username, cpu: 12.4, mem: 4.5, cmd: `${PROFILE_CONFIG.terminal.hostname}-kernel` },
        { pid: 1337, user: 'visitor', cpu: 0.0, mem: 0.1, cmd: 'shell' },
        { pid: 666, user: 'ai', cpu: 99.9, mem: 32.0, cmd: 'world_domination_script.sh' },
        { pid: 8080, user: 'node', cpu: 2.3, mem: 5.6, cmd: 'npm start' },
        { pid: 3000, user: 'music', cpu: 5.1, mem: 2.2, cmd: 'audio-daemon' },
    ];

    return (
        <div className="font-mono text-sm mb-2 w-full overflow-x-auto">
            <div className="text-slate-500 border-b border-slate-700 mb-1 pb-1 flex min-w-[500px]">
                <span className="w-16 shrink-0">PID</span> 
                <span className="w-20 shrink-0">USER</span> 
                <span className="w-16 shrink-0">CPU%</span> 
                <span className="w-16 shrink-0">MEM%</span> 
                <span className="shrink-0">COMMAND</span>
            </div>
            {processes.map((p) => (
                <div key={p.pid} className={`flex min-w-[500px] ${p.user === 'root' ? 'text-red-400' : p.user === PROFILE_CONFIG.terminal.username ? 'text-blue-400' : 'text-slate-300'}`}>
                    <span className="w-16 shrink-0">{p.pid}</span>
                    <span className="w-20 shrink-0">{p.user}</span>
                    <span className="w-16 shrink-0">{p.cpu}</span>
                    <span className="w-16 shrink-0">{p.mem}</span>
                    <span className="shrink-0">{p.cmd}</span>
                </div>
            ))}
        </div>
    );
};

interface ProcessStat {
    pid: number;
    user: string;
    pri: number;
    ni: number;
    virt: string;
    res: string;
    shr: string;
    s: string;
    cpu: string;
    mem: number;
    time: string;
    command: string;
}

export const TopProcess: React.FC<{ onExit: (finalSnapshot: React.ReactNode) => void, scrollToBottom: () => void }> = ({ onExit, scrollToBottom }) => {
    const [stats, setStats] = useState<ProcessStat[]>([]);
    const [header, setHeader] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollToBottom();
        const update = () => {
            const now = new Date().toLocaleTimeString();
            setHeader(`top - ${now} up 42 days,  1 user,  load average: 0.42, 0.50, 0.10`);
            
            setStats([
                { pid: 666, user: 'ai', pri: 20, ni: 0, virt: '10.2g', res: '4.1g', shr: '102m', s: 'S', cpu: (Math.random() * 5 + 95).toFixed(1), mem: 32.0, time: '1337:00', command: 'world_domination' },
                { pid: 420, user: PROFILE_CONFIG.terminal.username, pri: 20, ni: 0, virt: '802m', res: '204m', shr: '32m', s: 'R', cpu: (Math.random() * 10 + 5).toFixed(1), mem: 4.5, time: '42:00.00', command: `${PROFILE_CONFIG.terminal.hostname}-dev` },
                { pid: 1, user: 'root', pri: 20, ni: 0, virt: '164m', res: '12m', shr: '4m', s: 'S', cpu: (0.0).toFixed(1), mem: 0.1, time: '1:23.45', command: 'init' },
                { pid: 1337, user: 'visitor', pri: 20, ni: 0, virt: '24m', res: '4m', shr: '2m', s: 'S', cpu: (0.0).toFixed(1), mem: 0.1, time: '0:00.12', command: 'bash' },
                { pid: 88, user: 'daemon', pri: 20, ni: 0, virt: '42m', res: '8m', shr: '2m', s: 'S', cpu: (0.3).toFixed(1), mem: 0.4, time: '0:10.00', command: 'kworker/u2:1' },
            ]);
        };

        update();
        const interval = setInterval(update, 1000);

        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey && e.key === 'c') || (e.metaKey && e.key === 'c') || e.key === 'q') {
                if (window.getSelection()?.toString()) return;
                clearInterval(interval);
                onExit(containerRef.current ? 
                    <div dangerouslySetInnerHTML={{__html: containerRef.current.innerHTML}} /> : 
                    <div className="text-slate-500">Session terminated.</div>
                );
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            clearInterval(interval);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onExit, scrollToBottom]);

    return (
        <div ref={containerRef} className="font-mono text-sm text-slate-300 whitespace-pre overflow-hidden">
            <div className="mb-2">{header}</div>
            <div className="mb-2">Tasks: 128 total,   1 running, 127 sleeping,   0 stopped,   0 zombie</div>
            <div className="mb-4">%Cpu(s):  4.2 us,  1.0 sy,  0.0 ni, 94.8 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st</div>
            
            <div className="bg-slate-800 text-black px-1 flex mb-1 font-bold">
                <span className="w-12">PID</span>
                <span className="w-16">USER</span>
                <span className="w-10">PR</span>
                <span className="w-10">NI</span>
                <span className="w-16">VIRT</span>
                <span className="w-16">RES</span>
                <span className="w-16">SHR</span>
                <span className="w-8">S</span>
                <span className="w-16">%CPU</span>
                <span className="w-16">%MEM</span>
                <span className="w-20">TIME+</span>
                <span>COMMAND</span>
            </div>
            
            {stats.map((p) => (
                <div key={p.pid} className={`flex px-1 ${p.command === 'world_domination' ? 'text-red-400 animate-pulse' : ''}`}>
                    <span className="w-12">{p.pid}</span>
                    <span className="w-16">{p.user}</span>
                    <span className="w-10">{p.pri}</span>
                    <span className="w-10">{p.ni}</span>
                    <span className="w-16">{p.virt}</span>
                    <span className="w-16">{p.res}</span>
                    <span className="w-16">{p.shr}</span>
                    <span className="w-8">{p.s}</span>
                    <span className="w-16 text-green-400">{p.cpu}</span>
                    <span className="w-16">{p.mem}</span>
                    <span className="w-20">{p.time}</span>
                    <span>{p.command}</span>
                </div>
            ))}
            <div className="mt-4 text-black bg-green-400 inline-block px-1">Press 'q' or Ctrl+C to exit</div>
        </div>
    );
};

export const DockerPsOutput = () => (
    <div className="font-mono text-xs sm:text-sm mb-2 overflow-x-auto">
        <div className="text-slate-500 min-w-[800px] border-b border-slate-700 mb-1 pb-1 grid grid-cols-[120px_150px_200px_150px_150px_150px_1fr]">
            <span>CONTAINER ID</span>
            <span>IMAGE</span>
            <span>COMMAND</span>
            <span>CREATED</span>
            <span>STATUS</span>
            <span>PORTS</span>
            <span>NAMES</span>
        </div>
        <div className="text-slate-300 min-w-[800px] grid grid-cols-[120px_150px_200px_150px_150px_150px_1fr]">
            <span className="text-yellow-400">a1b2c3d4e5f6</span>
            <span className="text-blue-400">portfolio:v2</span>
            <span className="truncate">"/bin/sh -c 'npm sta…"</span>
            <span>42 minutes ago</span>
            <span className="text-green-400">Up 42 minutes</span>
            <span>{'0.0.0.0:3000->3000/tcp'}</span>
            <span>{PROFILE_CONFIG.terminal.username}-{PROFILE_CONFIG.terminal.hostname}</span>
        </div>
        <div className="text-slate-300 min-w-[800px] grid grid-cols-[120px_150px_200px_150px_150px_150px_1fr] opacity-70">
            <span className="text-yellow-400">f9e8d7c6b5a4</span>
            <span className="text-blue-400">mongo:latest</span>
            <span className="truncate">"docker-entrypoint.s…"</span>
            <span>5 hours ago</span>
            <span className="text-green-400">Up 5 hours</span>
            <span>27017/tcp</span>
            <span>portfolio-db</span>
        </div>
    </div>
);

export const DockerImagesOutput = () => (
    <div className="font-mono text-xs sm:text-sm mb-2 overflow-x-auto">
        <div className="text-slate-500 min-w-[600px] border-b border-slate-700 mb-1 pb-1 grid grid-cols-[200px_100px_150px_150px_1fr]">
            <span>REPOSITORY</span>
            <span>TAG</span>
            <span>IMAGE ID</span>
            <span>CREATED</span>
            <span>SIZE</span>
        </div>
        <div className="text-slate-300 min-w-[600px] grid grid-cols-[200px_100px_150px_150px_1fr]">
            <span className="text-blue-400">{PROFILE_CONFIG.terminal.username}/brain</span>
            <span>latest</span>
            <span className="text-yellow-400">8f3a2b1c4d5e</span>
            <span>24 years ago</span>
            <span>1337 PB</span>
        </div>
        <div className="text-slate-300 min-w-[600px] grid grid-cols-[200px_100px_150px_150px_1fr]">
            <span className="text-blue-400">portfolio</span>
            <span>v2</span>
            <span className="text-yellow-400">a1b2c3d4e5f6</span>
            <span>2 days ago</span>
            <span>420 MB</span>
        </div>
        <div className="text-slate-300 min-w-[600px] grid grid-cols-[200px_100px_150px_150px_1fr]">
            <span className="text-blue-400">{PROFILE_CONFIG.personal.company.toLowerCase()}</span>
            <span>production</span>
            <span className="text-yellow-400">b2c3d4e5f6a1</span>
            <span>1 week ago</span>
            <span>2.5 GB</span>
        </div>
    </div>
);

export const DockerRunOutput: React.FC<{ image: string }> = ({ image }) => {
    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => {
        const steps = [
            `Unable to find image '${image}:latest' locally`,
            `latest: Pulling from library/${image}`,
            `a3b2c1d4: Pulling fs layer`,
            `e5f6g7h8: Download complete`,
            `i9j0k1l2: Download complete`,
            `Status: Downloaded newer image for ${image}:latest`,
            `Error: Insufficient permissions. You are not a superuser.`,
            `Try 'sudo docker run ${image}' if you dare.`
        ];

        let delay = 0;
        steps.forEach((step, i) => {
            setTimeout(() => {
                setLines(prev => [...prev, step]);
            }, delay);
            delay += 400 + Math.random() * 400;
        });
    }, [image]);

    return (
        <div className="font-mono text-sm text-slate-300 space-y-1">
            {lines.map((line, i) => (
                <div key={i} className={line.includes('Error') ? 'text-red-400' : ''}>{line}</div>
            ))}
        </div>
    );
};

// Skills Output Component
export const SkillsOutput: React.FC<{ args: string[], skills: string[] }> = ({ args, skills }) => {
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
        const maxLength = Math.max(...skills.map(s => s.length));
        return (
            <div className="font-mono text-sm space-y-1">
                <div className="text-green-400 mb-2">Skills Proficiency Graph:</div>
                {skills.map((skill, idx) => {
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
        );
    } else if (args[0] === '--level' || args[0] === '-l') {
        const maxLength = Math.max(...skills.map(s => s.length));
        return (
            <div className="font-mono text-sm space-y-1">
                <div className="text-green-400 mb-2">Skills with Proficiency Levels:</div>
                {skills.map((skill, idx) => {
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
        );
    } else {
        return (
            <div className="font-mono text-sm">
                <div className="text-green-400 mb-2">Available Skills:</div>
                <div className="text-cyan-400">{skills.join(', ')}</div>
                <div className="text-slate-500 text-xs mt-2">Use 'skills --graph' for a visual representation</div>
                <div className="text-slate-500 text-xs">Use 'skills --level' to see proficiency levels</div>
            </div>
        );
    }
};

// Resume Output Component
export const ResumeOutput: React.FC = () => {
    return (
        <div className="font-mono text-sm space-y-2">
            <div className="text-green-400">═══════════════════════════════════════════════════════</div>
            <div className="text-white font-bold text-lg">{PROFILE_CONFIG.personal.fullName.toUpperCase()}</div>
            <div className="text-cyan-400">{getTitleWithCompany()}</div>
            <div className="text-slate-400">═══════════════════════════════════════════════════════</div>
            
            <div className="text-yellow-400 mt-4 font-bold">EDUCATION</div>
            <div className="text-white">{PROFILE_CONFIG.education.institution} - {PROFILE_CONFIG.education.degree} ({PROFILE_CONFIG.education.period})</div>
            {PROFILE_CONFIG.education.achievements && PROFILE_CONFIG.education.achievements.length > 0 ? (
              <div className="text-slate-400">{PROFILE_CONFIG.education.achievements[0]}</div>
            ) : null}
            
            <div className="text-yellow-400 mt-4 font-bold">EXPERIENCE</div>
            <div className="text-white">{getTitleWithCompany()} ({PROFILE_CONFIG.currentRole.period})</div>
            <div className="text-slate-400">  • {PROFILE_CONFIG.currentRole.location}</div>
            
            <div className="text-yellow-400 mt-4 font-bold">SKILLS</div>
            <div className="text-cyan-400">{SKILLS.slice(0, 7).join(', ')}</div>
            
            <div className="text-yellow-400 mt-4 font-bold">CONTACT</div>
            <div className="text-white">Email: {PROFILE_CONFIG.social.email}</div>
            <div className="text-white">LinkedIn: linkedin.com/in/{PROFILE_CONFIG.social.linkedin.username}</div>
            <div className="text-white">GitHub: github.com/{PROFILE_CONFIG.social.github.username}</div>
            
            <div className="text-green-400 mt-4">═══════════════════════════════════════════════════════</div>
            <div className="text-slate-500 text-xs">Type 'download resume' or click the download button for PDF version</div>
        </div>
    );
};

// History Output Component
export const HistoryOutput: React.FC<{ commandHistory: string[] }> = ({ commandHistory }) => {
    if (commandHistory.length === 0) {
        return <span className="text-slate-500">No commands in history yet.</span>;
    }
    
    return (
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
    );
};

// Tree Output Component
export const TreeOutput: React.FC<{ fileSystem: any }> = ({ fileSystem }) => {
    const buildTree = (node: any, prefix: string = '', isLast: boolean = true, depth: number = 0, nodeName: string = '~'): string[] => {
        if (depth > 5) return [];
        const lines: string[] = [];
        const connector = isLast ? '└── ' : '├── ';
        lines.push(prefix + connector + nodeName);
        
        if (node.type === 'dir' && node.children) {
            const children = Object.entries(node.children);
            children.forEach(([childName, childNode]: [string, any], index) => {
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
        return (
            <pre className="font-mono text-sm text-green-400 whitespace-pre overflow-x-auto">
                {treeLines.join('\n')}
            </pre>
        );
    } else {
        return <span className="text-red-400">tree: cannot access filesystem</span>;
    }
};

// Help Output Component
export const HelpOutput: React.FC<{ commands: Array<{ name: string; description: string; category?: string; aliases?: string[] }> }> = ({ commands }) => {
    const uniqueCommands = commands.filter((cmd, index, self) => 
        index === self.findIndex(c => c.name === cmd.name)
    );
    
    // Group commands by category
    const commandsByCategory = uniqueCommands.reduce((acc, cmd) => {
        const category = cmd.category || 'other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(cmd);
        return acc;
    }, {} as Record<string, typeof uniqueCommands>);
    
    // Category display names
    const categoryNames: Record<string, string> = {
        'file': '📁 File System',
        'system': '⚙️  System',
        'info': 'ℹ️  Information',
        'network': '🌐 Network',
        'terminal': '💻 Terminal',
        'fun': '🎮 Fun & Easter Eggs',
        'other': '📋 Other'
    };
    
    // Category order
    const categoryOrder = ['file', 'system', 'info', 'network', 'terminal', 'fun', 'other'];
    
    return (
        <div className="opacity-80 max-w-xl font-mono text-sm space-y-4">
            {categoryOrder.map((category) => {
                const categoryCommands = commandsByCategory[category];
                if (!categoryCommands || categoryCommands.length === 0) return null;
                
                return (
                    <div key={category} className="space-y-1">
                        <div className="text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2 border-b border-slate-700 pb-1">
                            {categoryNames[category] || category}
                        </div>
                        {categoryCommands.sort((a, b) => a.name.localeCompare(b.name)).map((cmd) => (
                            <div key={cmd.name} className="flex items-start gap-3 ml-2">
                                <div className="w-32 flex-shrink-0">
                                    <span className="text-yellow-400 font-bold">{cmd.name}</span>
                                    {cmd.aliases && cmd.aliases.length > 0 && (
                                        <span className="text-slate-500 text-xs ml-1">
                                            ({cmd.aliases.join(', ')})
                                        </span>
                                    )}
                                </div>
                                <span className="text-slate-300 flex-1">{cmd.description}</span>
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

// Whoami Output Component
export const WhoamiOutput: React.FC = () => {
    const whoamiResponses = [
        "visitor",
        "visitor",
        "visitor",
        "visitor",
        "visitor",
        "visitor",
        "visitor",
        "visitor",
        "I don't know, who are YOU?",
        "A figment of my simulation.",
        <span key="error" className="text-red-400">System.User.NullReferenceException</span>,
        "Batman 🦇",
        "The one who knocks.",
        "Just another brick in the wall."
    ];
    const randomResponse = whoamiResponses[Math.floor(Math.random() * whoamiResponses.length)];
    return <>{randomResponse}</>;
};

// Date Output Component
export const DateOutput: React.FC = () => {
    return <span className="text-slate-300">{new Date().toString()}</span>;
};

// Who Output Component
export const WhoOutput: React.FC = () => {
    return <span className="text-slate-300">visitor  pts/0  {new Date().toLocaleTimeString()} ({navigator.userAgent.includes('Mac') ? 'Mac' : 'PC'})</span>;
};

// Reboot Output Component
export const RebootOutput: React.FC = () => {
    return <span className="text-yellow-400">System reboot initiated...</span>;
};

// Screensaver Output Component
export const ScreensaverOutput: React.FC = () => {
    return <span className="text-green-400">Initializing Sleep Mode...</span>;
};

// DevMode Unlock Output Component
export const DevModeUnlockOutput: React.FC = () => {
    return (
        <div className="font-mono text-sm space-y-2">
            <div className="text-green-400 font-bold">✓ Achievements panel unlocked!</div>
            <div className="text-slate-400 text-xs">The achievements button is now visible in the bottom-left corner.</div>
            <div className="text-slate-400 text-xs">This will persist across future visits.</div>
        </div>
    );
};

// Docker Usage Output Component
export const DockerUsageOutput: React.FC = () => {
    return <span className="text-slate-400">Usage: docker [ps | images | run &lt;image&gt;]</span>;
};

// Docker Error Output Component
export const DockerErrorOutput: React.FC<{ command: string }> = ({ command }) => {
    return <span className="text-red-400">docker: '{command}' is not a docker command.</span>;
};

// Type Game Score Output Component
export const TypeGameScoreOutput: React.FC<{ score: string }> = ({ score }) => {
    return <span className="text-green-400">{score}</span>;
};

// Game Over Score Output Component
export const GameOverScoreOutput: React.FC<{ score: number }> = ({ score }) => {
    return <span className="text-green-400">Game Over! Score: {score}</span>;
};
