import { TerminalLine } from '../../../TerminalTypes';
import { CowsayOutput, FortuneOutput, CoffeeOutput, JokeOutput, WeatherOutput, CoinflipOutput } from '../../outputs/fun/simpleFunOutputs';

export interface SimpleFunHandlersContext {
    trackEvent: (key: string, value?: any) => void;
}

export const createSimpleFunHandlers = (context: SimpleFunHandlersContext) => {
    const { trackEvent } = context;

    return {
        cowsay: (args: string[], newLines: TerminalLine[]) => {
            trackEvent('cowsay_used', true);
            newLines.push({ type: 'output', content: <CowsayOutput args={args} /> });
        },

        fortune: (args: string[], newLines: TerminalLine[]) => {
            trackEvent('fortune_used', true);
            newLines.push({ type: 'output', content: <FortuneOutput /> });
        },

        coffee: (args: string[], newLines: TerminalLine[]) => {
            trackEvent('coffee_used', true);
            newLines.push({ type: 'output', content: <CoffeeOutput /> });
        },

        brew: (args: string[], newLines: TerminalLine[]) => {
            // Alias for coffee - call coffee handler
            trackEvent('coffee_used', true);
            newLines.push({ type: 'output', content: <CoffeeOutput /> });
        },

        joke: (args: string[], newLines: TerminalLine[]) => {
            trackEvent('joke_used', true);
            newLines.push({ type: 'output', content: <JokeOutput /> });
        },

        weather: (args: string[], newLines: TerminalLine[]) => {
            newLines.push({ type: 'output', content: <WeatherOutput /> });
        },

        coinflip: (args: string[], newLines: TerminalLine[]) => {
            newLines.push({ type: 'output', content: <CoinflipOutput /> });
        },
    };
};

