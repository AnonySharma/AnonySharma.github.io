import React from 'react';
import { TerminalLine } from '../../../../TerminalTypes';
import { SnakeGame } from '../../../outputs/fun/games/SnakeGame';
import { GameOverScoreOutput } from '../../../outputs/fun/games/gameOutputs';

export interface SnakeHandlerContext {
    setActiveComponent: React.Dispatch<React.SetStateAction<React.ReactNode | null>>;
    setLines: React.Dispatch<React.SetStateAction<TerminalLine[]>>;
    trackEvent: (key: string, value?: any) => void;
}

export const createSnakeHandler = (context: SnakeHandlerContext) => {
    const { setActiveComponent, setLines, trackEvent } = context;

    return {
        game: (args: string[], newLines: TerminalLine[]) => {
            trackEvent('snake_played', true);
            setActiveComponent(<SnakeGame onExit={(score) => {
                setActiveComponent(null);
                setLines(prev => [...prev, { type: 'output', content: <GameOverScoreOutput score={score} /> }]);
            }} />);
        },
    };
};

