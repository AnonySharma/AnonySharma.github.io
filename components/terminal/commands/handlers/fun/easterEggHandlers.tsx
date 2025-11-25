import React from 'react';
import { TerminalLine } from '../../../TerminalTypes';
import { Answer42Output, WhoisOutput, EasterEggsOutput, StonksOutput, SystemPanic, SingPlayer, PartyParrot } from '../../outputs/fun/easterEggOutputs';
import { ScreensaverOutput } from '../../outputs/systemOutputs';
import { COMMANDS } from '../../registry/commandRegistry';

export interface EasterEggHandlersContext {
    setActiveComponent: React.Dispatch<React.SetStateAction<React.ReactNode | null>>;
    setBsodTriggered: React.Dispatch<React.SetStateAction<boolean>>;
    trackEvent: (key: string, value?: any) => void;
}

export const createEasterEggHandlers = (context: EasterEggHandlersContext) => {
    const { setActiveComponent, setBsodTriggered, trackEvent } = context;

    return {
        '42': (args: string[], newLines: TerminalLine[]) => {
            trackEvent('answer_42', true);
            newLines.push({ type: 'output', content: <Answer42Output /> });
        },

        whois: (args: string[], newLines: TerminalLine[]) => {
            trackEvent('whois_used', true);
            newLines.push({ type: 'output', content: <WhoisOutput args={args} /> });
        },

        eastereggs: (args: string[], newLines: TerminalLine[]) => {
            newLines.push({ type: 'output', content: <EasterEggsOutput commands={COMMANDS} /> });
        },

        stonks: (args: string[], newLines: TerminalLine[]) => {
            newLines.push({ type: 'output', content: <StonksOutput /> });
        },

        screensaver: (args: string[], newLines: TerminalLine[]) => {
            setTimeout(() => {
                window.dispatchEvent(new Event('force_screensaver'));
            }, 100);
            newLines.push({ type: 'output', content: <ScreensaverOutput /> });
        },

        bsod: (args: string[], newLines: TerminalLine[]) => {
            trackEvent('bsod_triggered', true);
            setBsodTriggered(true);
            return 'exit' as const;
        },

        sing: (args: string[], newLines: TerminalLine[]) => {
            newLines.push({
                type: 'component',
                content: <SingPlayer onFinish={() => { }} />
            });
        },

        party: (args: string[], newLines: TerminalLine[]) => {
            trackEvent('party_started', true);
            setActiveComponent(<PartyParrot onExit={() => setActiveComponent(null)} />);
        },
    };
};

