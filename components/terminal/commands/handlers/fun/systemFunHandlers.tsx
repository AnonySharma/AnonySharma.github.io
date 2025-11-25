import React from 'react';
import { TerminalLine } from '../../../TerminalTypes';
import { SudoSandwichOutput, SudoPermissionDeniedOutput, VimOutput, TouchGrassOutput, TouchErrorOutput, YeetOutput, IncognitoOnOutput, IncognitoOffOutput } from '../../outputs/fun/systemFunOutputs';
import { SystemPanic } from '../../outputs/fun/easterEggOutputs';

export interface SystemFunHandlersContext {
    setActiveComponent: React.Dispatch<React.SetStateAction<React.ReactNode | null>>;
    setBsodTriggered: React.Dispatch<React.SetStateAction<boolean>>;
    setLines: React.Dispatch<React.SetStateAction<TerminalLine[]>>;
    trackEvent: (key: string, value?: any) => void;
}

export const createSystemFunHandlers = (context: SystemFunHandlersContext) => {
    const { setActiveComponent, setBsodTriggered, setLines, trackEvent } = context;

    return {
        sudo: (args: string[], newLines: TerminalLine[]) => {
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

        rm: (args: string[], newLines: TerminalLine[]) => {
            if (args.includes('-rf') && (args.includes('/') || args.includes('*'))) {
                trackEvent('bsod_triggered', true);
                setActiveComponent(<SystemPanic onReset={() => setBsodTriggered(true)} />);
            } else {
                newLines.push({ type: 'output', content: <span className="text-red-400">rm: Permission denied. Protected system.</span> });
            }
        },

        vim: (args: string[], newLines: TerminalLine[]) => {
            newLines.push({ type: 'output', content: <VimOutput /> });
        },

        vi: (args: string[], newLines: TerminalLine[]) => {
            newLines.push({ type: 'output', content: <VimOutput /> });
        },

        emacs: (args: string[], newLines: TerminalLine[]) => {
            newLines.push({ type: 'output', content: <VimOutput /> });
        },

        nano: (args: string[], newLines: TerminalLine[]) => {
            newLines.push({ type: 'output', content: <VimOutput /> });
        },

        touch: (args: string[], newLines: TerminalLine[]) => {
            if (args.join(' ') === 'grass') {
                newLines.push({ type: 'output', content: <TouchGrassOutput /> });
                setTimeout(() => {
                    window.open('https://www.google.com/maps/search/parks+near+me', '_blank');
                }, 1500);
            } else {
                newLines.push({ type: 'output', content: <TouchErrorOutput /> });
            }
        },

        yeet: (args: string[], newLines: TerminalLine[]) => {
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

        incognito: (args: string[], newLines: TerminalLine[]) => {
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
    };
};

