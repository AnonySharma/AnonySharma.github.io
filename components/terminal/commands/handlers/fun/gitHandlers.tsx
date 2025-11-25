import { TerminalLine } from '../../../TerminalTypes';
import { GitStatusOutput, GitCommitOutput, GitPushOutput, GitBlameOutput, GitLogOutput, GitMergeOutput, GitRebaseOutput } from '../../outputs/fun/gitOutputs';

export const createGitHandlers = () => {
    return {
        git: (args: string[], newLines: TerminalLine[]) => {
            if (!args[0]) {
                newLines.push({ 
                    type: 'output', 
                    content: (
                        <div className="font-mono text-sm">
                            <div className="text-red-400">usage: git &lt;command&gt;</div>
                            <div className="text-slate-400 mt-2">Available commands:</div>
                            <div className="text-slate-300 mt-1 ml-4">
                                <div>status&nbsp;&nbsp;&nbsp;&nbsp;Show the working tree status</div>
                                <div>commit&nbsp;&nbsp;&nbsp;Record changes to the repository</div>
                                <div>push&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Update remote refs along with associated objects</div>
                                <div>blame&nbsp;&nbsp;&nbsp;&nbsp;Show what revision and author last modified each line</div>
                                <div>log&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Show commit logs</div>
                                <div>merge&nbsp;&nbsp;&nbsp;&nbsp;Join two or more development histories together</div>
                                <div>rebase&nbsp;&nbsp;&nbsp;Reapply commits on top of another base tip</div>
                            </div>
                        </div>
                    )
                });
                return;
            }
            
            const subcommand = args[0].toLowerCase();
            switch (subcommand) {
                case 'status':
                    newLines.push({ type: 'output', content: <GitStatusOutput /> });
                    break;
                case 'commit':
                    newLines.push({ type: 'output', content: <GitCommitOutput args={args.slice(1)} /> });
                    break;
                case 'push':
                    newLines.push({ type: 'output', content: <GitPushOutput /> });
                    break;
                case 'blame':
                    newLines.push({ type: 'output', content: <GitBlameOutput args={args.slice(1)} /> });
                    break;
                case 'log':
                    newLines.push({ type: 'output', content: <GitLogOutput /> });
                    break;
                case 'merge':
                    newLines.push({ type: 'output', content: <GitMergeOutput /> });
                    break;
                case 'rebase':
                    newLines.push({ type: 'output', content: <GitRebaseOutput /> });
                    break;
                default:
                    newLines.push({ type: 'output', content: <span className="text-yellow-400">git: '{subcommand}' is not a git command. Try: status, commit, push, blame, log, merge, rebase</span> });
            }
        },
    };
};

