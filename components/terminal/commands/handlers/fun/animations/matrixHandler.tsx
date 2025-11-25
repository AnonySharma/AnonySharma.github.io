import React from 'react';
import { TerminalLine } from '../../../../TerminalTypes';
import { MatrixProcess } from '../../../outputs/fun/animations/MatrixProcess';

export interface MatrixHandlerContext {
    setActiveComponent: React.Dispatch<React.SetStateAction<React.ReactNode | null>>;
    setMatrixMode: React.Dispatch<React.SetStateAction<boolean>>;
    trackEvent: (key: string, value?: any) => void;
}

export const createMatrixHandler = (context: MatrixHandlerContext) => {
    const { setActiveComponent, setMatrixMode, trackEvent } = context;

    return {
        matrix: (args: string[], newLines: TerminalLine[]) => {
            trackEvent('matrix_activated', true);
            setActiveComponent(<MatrixProcess setMatrixMode={setMatrixMode} onExit={() => setActiveComponent(null)} />);
        },
    };
};

