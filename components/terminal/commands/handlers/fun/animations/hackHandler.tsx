import React from 'react';
import { TerminalLine } from '../../../../TerminalTypes';
import { HackProcess } from '../../../outputs/fun/animations/HackProcess';

export interface HackHandlerContext {
    setActiveComponent: React.Dispatch<React.SetStateAction<React.ReactNode | null>>;
    scrollToBottom: () => void;
    trackEvent: (key: string, value?: any) => void;
}

export const createHackHandler = (context: HackHandlerContext) => {
    const { setActiveComponent, scrollToBottom, trackEvent } = context;

    return {
        hack: (args: string[], newLines: TerminalLine[]) => {
            trackEvent('hack_attempted', true);
            setActiveComponent(<HackProcess onExit={() => setActiveComponent(null)} scrollToBottom={scrollToBottom} />);
        },
    };
};

