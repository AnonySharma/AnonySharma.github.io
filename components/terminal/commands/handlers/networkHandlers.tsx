import React from 'react';
import { TerminalLine } from '../../TerminalTypes';
import { PingProcess } from '../outputs/networkOutputs';

export interface NetworkHandlersContext {
    setActiveComponent: React.Dispatch<React.SetStateAction<React.ReactNode | null>>;
    setLines: React.Dispatch<React.SetStateAction<TerminalLine[]>>;
    scrollToBottom: () => void;
}

export const createNetworkHandlers = (context: NetworkHandlersContext) => {
    const { setActiveComponent, setLines, scrollToBottom } = context;

    return {
        ping: (args: string[], newLines: TerminalLine[]) => {
            setActiveComponent(
                <PingProcess
                    args={args}
                    onExit={(outputLines) => {
                        setActiveComponent(null);
                        setLines(prev => [...prev, ...outputLines.map(l => ({ type: 'output', content: l } as TerminalLine))]);
                    }}
                    scrollToBottom={scrollToBottom}
                />
            );
        },
    };
};

