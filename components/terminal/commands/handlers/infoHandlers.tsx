import { TerminalLine } from '../../TerminalTypes';
import { WhoamiOutput, SkillsOutput, ResumeOutput, HistoryOutput, TreeOutput, HelpOutput } from '../outputs/infoOutputs';
import { SKILLS } from '../../../../constants';
import { COMMANDS } from '../registry/commandRegistry';

export interface InfoHandlersContext {
    commandHistory: string[];
    fileSystem: any;
}

export const createInfoHandlers = (context: InfoHandlersContext) => {
    const { commandHistory, fileSystem } = context;

    return {
        whoami: (args: string[], newLines: TerminalLine[]) => {
            newLines.push({ type: 'output', content: <WhoamiOutput /> });
        },

        skills: (args: string[], newLines: TerminalLine[]) => {
            newLines.push({ type: 'output', content: <SkillsOutput args={args} skills={SKILLS} /> });
        },

        resume: (args: string[], newLines: TerminalLine[]) => {
            newLines.push({ type: 'output', content: <ResumeOutput /> });
        },

        history: (args: string[], newLines: TerminalLine[]) => {
            newLines.push({ type: 'output', content: <HistoryOutput commandHistory={commandHistory} /> });
        },

        tree: (args: string[], newLines: TerminalLine[]) => {
            newLines.push({ type: 'output', content: <TreeOutput fileSystem={fileSystem} /> });
        },

        help: (args: string[], newLines: TerminalLine[]) => {
            newLines.push({ type: 'output', content: <HelpOutput commands={COMMANDS} /> });
        },
    };
};

