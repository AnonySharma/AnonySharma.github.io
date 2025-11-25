import React from 'react';
import { TerminalLine } from '../../../../TerminalTypes';
import { FireEffect } from '../../../outputs/fun/animations/FireEffect';

export interface FireHandlerContext {
    setActiveComponent: React.Dispatch<React.SetStateAction<React.ReactNode | null>>;
    scrollToBottom: () => void;
    trackEvent: (key: string, value?: any) => void;
}

export const createFireHandler = (context: FireHandlerContext) => {
    const { setActiveComponent, scrollToBottom, trackEvent } = context;

    return {
        fire: (args: string[], newLines: TerminalLine[]) => {
            trackEvent('fire_used', true);
            setActiveComponent(<FireEffect onExit={() => setActiveComponent(null)} scrollToBottom={scrollToBottom} />);
        },
    };
};

