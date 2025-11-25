import { CommandInfo } from './commandTypes';

// Centralized Commands Configuration
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
    
    // Git Easter Eggs
    { name: 'git', description: 'Git version control (with easter eggs)', category: 'fun' },
    
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

