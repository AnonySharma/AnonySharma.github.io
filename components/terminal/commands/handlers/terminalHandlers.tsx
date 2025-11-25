import React from 'react';
import { TerminalLine } from '../../TerminalTypes';

export interface TerminalHandlersContext {
    setLines: React.Dispatch<React.SetStateAction<TerminalLine[]>>;
    onClose: () => void;
}

export const createTerminalHandlers = (context: TerminalHandlersContext) => {
    const { setLines, onClose } = context;

    return {
        clear: (args: string[], newLines: TerminalLine[]) => {
            setLines([]);
            return 'clear' as const;
        },

        exit: (args: string[], newLines: TerminalLine[]) => {
            onClose();
            return 'exit' as const;
        },
    };
};

