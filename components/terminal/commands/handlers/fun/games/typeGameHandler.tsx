import React from 'react';
import { TerminalLine } from '../../../../TerminalTypes';
import { TypeGame } from '../../../outputs/fun/games/TypeGame';
import { TypeGameScoreOutput } from '../../../outputs/fun/games/gameOutputs';

export interface TypeGameHandlerContext {
    setActiveComponent: React.Dispatch<React.SetStateAction<React.ReactNode | null>>;
    setLines: React.Dispatch<React.SetStateAction<TerminalLine[]>>;
    trackEvent: (key: string, value?: any) => void;
}

export const createTypeGameHandler = (context: TypeGameHandlerContext) => {
    const { setActiveComponent, setLines, trackEvent } = context;

    return {
        type: (args: string[], newLines: TerminalLine[]) => {
            trackEvent('typing_test', true);
            setActiveComponent(<TypeGame onExit={(score) => {
                setActiveComponent(null);
                if (score) {
                    setLines(prev => [...prev, { type: 'output', content: <TypeGameScoreOutput score={score} /> }]);
                }
            }} />);
        },
    };
};

