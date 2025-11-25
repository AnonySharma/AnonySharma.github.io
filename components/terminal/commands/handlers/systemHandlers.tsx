import React from 'react';
import { TerminalLine } from '../../TerminalTypes';
import { SysInfoOutput, NeofetchOutput, PsOutput, TopProcess, DockerPsOutput, DockerImagesOutput, DockerRunOutput, DockerUsageOutput, DockerErrorOutput, DateOutput, WhoOutput, RebootOutput } from '../outputs/systemOutputs';

export interface SystemHandlersContext {
    setActiveComponent: React.Dispatch<React.SetStateAction<React.ReactNode | null>>;
    setLines: React.Dispatch<React.SetStateAction<TerminalLine[]>>;
    scrollToBottom: () => void;
    trackEvent: (key: string, value?: any) => void;
}

export const createSystemHandlers = (context: SystemHandlersContext) => {
    const { setActiveComponent, setLines, scrollToBottom, trackEvent } = context;

    return {
        sysinfo: (args: string[], newLines: TerminalLine[]) => {
            newLines.push({ type: 'output', content: <SysInfoOutput /> });
        },

        neofetch: (args: string[], newLines: TerminalLine[]) => {
            newLines.push({ type: 'output', content: <NeofetchOutput /> });
        },

        ps: (args: string[], newLines: TerminalLine[]) => {
            newLines.push({ type: 'output', content: <PsOutput /> });
        },

        top: (args: string[], newLines: TerminalLine[]) => {
            setActiveComponent(
                <TopProcess
                    onExit={(finalSnapshot) => {
                        setActiveComponent(null);
                        setLines(prev => [...prev, { type: 'output', content: finalSnapshot }]);
                    }}
                    scrollToBottom={scrollToBottom}
                />
            );
        },

        docker: (args: string[], newLines: TerminalLine[]) => {
            trackEvent('docker_used', true);
            if (args.length === 0) {
                newLines.push({ type: 'output', content: <DockerUsageOutput /> });
            } else {
                switch (args[0]) {
                    case 'ps':
                        newLines.push({ type: 'output', content: <DockerPsOutput /> });
                        break;
                    case 'images':
                        newLines.push({ type: 'output', content: <DockerImagesOutput /> });
                        break;
                    case 'run':
                        const img = args[1] || 'unknown';
                        newLines.push({ type: 'output', content: <DockerRunOutput image={img} /> });
                        break;
                    default:
                        newLines.push({ type: 'output', content: <DockerErrorOutput command={args[0]} /> });
                }
            }
        },

        date: (args: string[], newLines: TerminalLine[]) => {
            newLines.push({ type: 'output', content: <DateOutput /> });
        },

        who: (args: string[], newLines: TerminalLine[]) => {
            newLines.push({ type: 'output', content: <WhoOutput /> });
        },

        reboot: (args: string[], newLines: TerminalLine[]) => {
            newLines.push({ type: 'output', content: <RebootOutput /> });
            setTimeout(() => {
                localStorage.removeItem('terminal_booted');
                window.location.reload();
            }, 1000);
        },
    };
};

