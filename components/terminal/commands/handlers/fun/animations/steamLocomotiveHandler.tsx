import React from 'react';
import { TerminalLine } from '../../../../TerminalTypes';
import { SteamLocomotive } from '../../../outputs/fun/animations/SteamLocomotive';

export interface SteamLocomotiveHandlerContext {
    setActiveComponent: React.Dispatch<React.SetStateAction<React.ReactNode | null>>;
    scrollToBottom: () => void;
}

export const createSteamLocomotiveHandler = (context: SteamLocomotiveHandlerContext) => {
    const { setActiveComponent, scrollToBottom } = context;

    return {
        sl: (args: string[], newLines: TerminalLine[]) => {
            setActiveComponent(<SteamLocomotive onExit={() => setActiveComponent(null)} scrollToBottom={scrollToBottom} />);
        },
    };
};

