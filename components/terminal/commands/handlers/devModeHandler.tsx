import { TerminalLine } from '../../TerminalTypes';
import { DevModeUnlockOutput } from '../outputs/systemOutputs';
import { DevModeStatus } from '../../ui/DevModeStatus';

export interface DevModeHandlerContext {
    stats: Record<string, any>;
}

export const createDevModeHandler = (context: DevModeHandlerContext) => {
    const { stats } = context;

    return {
        devmode: (args: string[], newLines: TerminalLine[]) => {
            if (args[0] === 'unlock' && args[1] === 'achievements') {
                localStorage.setItem('achievements_unlocked', 'true');
                newLines.push({ type: 'output', content: <DevModeUnlockOutput /> });
                return;
            }
            
            const easterEggs = [
                { key: 'konami_unlocked', name: 'Konami Code' },
                { key: 'logo_clicked_10', name: 'Logo Clicker (10x)' },
                { key: 'sudo_sandwich', name: 'Sudo Sandwich' },
                { key: 'hack_attempted', name: 'Hack Command' },
                { key: 'fortune_used', name: 'Fortune' },
                { key: 'coffee_used', name: 'Coffee/Brew' },
                { key: 'joke_used', name: 'Joke' },
                { key: 'answer_42', name: 'Answer 42' },
                { key: 'whois_used', name: 'Whois' },
                { key: 'docker_used', name: 'Docker' },
                { key: 'snake_played', name: 'Snake Game' },
                { key: 'party_started', name: 'Party' },
                { key: 'fire_used', name: 'Fire' },
                { key: 'typing_test', name: 'Typing Test' },
                { key: 'cowsay_used', name: 'Cowsay' },
                { key: 'bsod_triggered', name: 'BSOD' },
                { key: 'screensaver_active', name: 'Screensaver' }
            ];
            const found = easterEggs.filter(egg => !!stats[egg.key]);
            newLines.push({
                type: 'output',
                content: (
                    <DevModeStatus 
                        found={found}
                        easterEggs={easterEggs}
                    />
                )
            });
        },
    };
};

