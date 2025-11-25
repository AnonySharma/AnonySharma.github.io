import React from 'react';
import { PROFILE_CONFIG } from '../../../../../config';

export const GitStatusOutput: React.FC = () => {
    const statuses = [
        "On branch main\nYour branch is up to date with 'origin/main'.\n\nChanges not staged for commit:\n  (use \"git add <file>...\" to update what will be committed)\n  modified:   motivation.txt\n  deleted:    sleep.schedule\n\nUntracked files:\n  (use \"git add <file>...\" to include in what will be committed)\n    coffee.cup\n    TODO.md\n\nno changes added to commit (use \"git add\" and/or \"git commit -a\")",
        "On branch main\nYour branch is ahead of 'origin/main' by 42 commits.\n\nnothing to commit, working tree clean\n(But your TODO list is a mess)",
        "On branch feature/infinite-scroll\nYour branch and 'origin/feature/infinite-scroll' have diverged,\nand have 69 and 420 different commits each, respectively.\n  (use \"git rebase\" to reconcile)\n\nChanges staged for commit:\n  modified:   README.md\n  modified:   sanity.js"
    ];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    return (
        <div className="font-mono text-sm text-slate-300 whitespace-pre-line">
            {status}
        </div>
    );
};

export const GitCommitOutput: React.FC<{ args: string[] }> = ({ args }) => {
    const funnyMessages = [
        "Fixed bug (I think)",
        "WIP: It works on my machine",
        "Commit message goes here",
        "Please work",
        "Fixed typo in comment",
        "Removed debug code (maybe)",
        "Update stuff",
        "asdf",
        "Fix fix fix",
        "Merge branch 'fix-bug-that-i-introduced'",
        "Initial commit (after 3 months of development)",
        "Refactor everything",
        "It's 3am, this should work",
        "Quick fix (famous last words)",
        "Removed console.log statements",
        "Added feature that nobody asked for",
        "Fixed the thing that was broken",
        "Update dependencies (hope nothing breaks)",
        "Code cleanup (made it worse)",
        "Fixed merge conflicts (by deleting everything)"
    ];
    
    const hasMessage = args.includes('-m') && args[args.indexOf('-m') + 1];
    const message = hasMessage ? args[args.indexOf('-m') + 1] : funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
    
    return (
        <div className="font-mono text-sm">
            <div className="text-green-400">[main {Math.random().toString(36).substring(2, 9)}] {message}</div>
            <div className="text-slate-500 text-xs mt-1">
                {Math.floor(Math.random() * 5) + 1} file(s) changed, {Math.floor(Math.random() * 100) + 10} insertion(s)(+), {Math.floor(Math.random() * 20)} deletion(s)(-)
            </div>
        </div>
    );
};

export const GitPushOutput: React.FC = () => {
    const outcomes = [
        {
            text: "Everything up-to-date\n(Your local changes are still there, you just forgot to commit)",
            color: "text-yellow-400"
        },
        {
            text: `Enumerating objects: 42, done.\nCounting objects: 100% (42/42), done.\nDelta compression using up to 8 threads\nCompressing objects: 100% (21/21), done.\nWriting objects: 100% (21/21), 1.23 MiB | 1.23 MiB/s, done.\nTotal 21 (delta 15), reused 0 (delta 0)\nTo github.com:${PROFILE_CONFIG.social.github.username}/repo.git\n   abc1234..def5678  main -> main`,
            color: "text-green-400"
        },
        {
            text: `To github.com:${PROFILE_CONFIG.social.github.username}/repo.git\n ! [rejected]        main -> main (fetch first)\nerror: failed to push some refs to 'origin/main'\nhint: Updates were rejected because the remote contains work that you do\nhint: not have locally. This is usually caused by another repository pushing\nhint: to the same ref. You may want to first integrate the remote changes\nhint: (e.g., 'git pull ...') before pushing again.\n(Classic git moment)`,
            color: "text-red-400"
        }
    ];
    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    return (
        <div className={`font-mono text-sm whitespace-pre-line ${outcome.color}`}>
            {outcome.text}
        </div>
    );
};

export const GitBlameOutput: React.FC<{ args: string[] }> = ({ args }) => {
    const file = args[0] || 'code.js';
    const blamees = [
        "Past me (2023-01-15)",
        "The intern (we don't talk about it)",
        "Copy-paste from Stack Overflow",
        "GitHub Copilot",
        "Me, but I was tired",
        "The previous developer (they're gone now)",
        "ChatGPT (it seemed like a good idea)",
        "Me, 3 coffees ago",
        "The person who wrote 'TODO: fix this'",
        "Someone who clearly didn't understand the codebase"
    ];
    const blamee = blamees[Math.floor(Math.random() * blamees.length)];
    
    return (
        <div className="font-mono text-sm">
            <div className="text-slate-400">Blame for {file}:</div>
            <div className="text-red-400 mt-2">
                {Math.random().toString(36).substring(2, 9)} ({blamee} {Math.floor(Math.random() * 1000) + 100} days ago) Line 1-{Math.floor(Math.random() * 50) + 10}:<br />
                <span className="text-slate-300">  // This code is cursed</span>
            </div>
        </div>
    );
};

export const GitLogOutput: React.FC = () => {
    const author = PROFILE_CONFIG.social.github.username;
    const commits = [
        { hash: "a1b2c3d", msg: "Fixed the thing", author: author, days: 1 },
        { hash: "e4f5g6h", msg: "WIP: Still broken", author: author, days: 2 },
        { hash: "i7j8k9l", msg: "Added feature", author: author, days: 3 },
        { hash: "m1n2o3p", msg: "Quick fix", author: author, days: 5 },
        { hash: "q4r5s6t", msg: "Initial commit", author: author, days: 100 }
    ];
    
    return (
        <div className="font-mono text-sm text-slate-300">
            {commits.map((commit, i) => (
                <div key={i} className="mb-2">
                    <span className="text-yellow-400">{commit.hash.substring(0, 7)}</span>
                    <span className="text-slate-500 ml-2">({commit.days} day{commit.days !== 1 ? 's' : ''} ago)</span>
                    <span className="text-green-400 ml-2">{commit.msg}</span>
                    <span className="text-slate-600 ml-2">&lt;{commit.author}@github.com&gt;</span>
                </div>
            ))}
        </div>
    );
};

export const GitMergeOutput: React.FC = () => {
    return (
        <div className="font-mono text-sm">
            <div className="text-yellow-400">Auto-merging important-file.js</div>
            <div className="text-red-400 mt-2">CONFLICT (content): Merge conflict in important-file.js</div>
            <div className="text-slate-400 mt-2">
                Automatic merge failed; fix conflicts and then commit the result.<br />
                <span className="text-slate-600">(Good luck! 🍀)</span>
            </div>
        </div>
    );
};

export const GitRebaseOutput: React.FC = () => {
    return (
        <div className="font-mono text-sm">
            <div className="text-yellow-400">First, rewinding head to replay your work on top of it...</div>
            <div className="text-red-400 mt-2">Applying: Your commit message</div>
            <div className="text-red-400">CONFLICT (modify/delete): file.js deleted in HEAD and modified in Your commit message.</div>
            <div className="text-slate-400 mt-2">
                Could not apply Your commit message... {Math.floor(Math.random() * 10) + 1} conflict(s)<br />
                <span className="text-slate-600">(This is why people use merge instead 😅)</span>
            </div>
        </div>
    );
};

