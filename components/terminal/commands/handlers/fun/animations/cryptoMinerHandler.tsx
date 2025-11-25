import React from 'react';
import { TerminalLine } from '../../../../TerminalTypes';
import { CryptoMiner } from '../../../outputs/fun/animations/CryptoMiner';

export interface CryptoMinerHandlerContext {
    setActiveComponent: React.Dispatch<React.SetStateAction<React.ReactNode | null>>;
    scrollToBottom: () => void;
}

export const createCryptoMinerHandler = (context: CryptoMinerHandlerContext) => {
    const { setActiveComponent, scrollToBottom } = context;

    return {
        miner: (args: string[], newLines: TerminalLine[]) => {
            setActiveComponent(<CryptoMiner onExit={() => setActiveComponent(null)} scrollToBottom={scrollToBottom} />);
        },
    };
};

