import React from 'react';
import { PROFILE_CONFIG, getTitleWithCompany } from '../../../../config';
import { SKILLS } from '../../../../constants';
import { COMMANDS } from '../registry/commandRegistry';

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

