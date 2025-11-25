// Command type definitions for the terminal command system

export type CommandCategory = 'fun' | 'system' | 'file' | 'info' | 'network' | 'terminal';

export interface CommandInfo {
    name: string;
    description: string;
    aliases?: string[]; // For commands like 'developer' -> 'devmode', 'brew' -> 'coffee'
    category?: CommandCategory; // For filtering easter eggs
}

