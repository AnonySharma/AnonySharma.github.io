import React, { useEffect } from 'react';

export const MatrixProcess: React.FC<{ setMatrixMode: (m: boolean) => void, onExit: () => void }> = ({ setMatrixMode, onExit }) => {
    useEffect(() => {
        setMatrixMode(true);
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey && e.key === 'c') || (e.metaKey && e.key === 'c')) {
                if (window.getSelection()?.toString()) return;
                setMatrixMode(false);
                onExit();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setMatrixMode, onExit]);

    return (
        <div className="text-green-400 font-mono my-2 whitespace-nowrap overflow-hidden w-full">
            <span className="animate-pulse">Matrix Mode Active. Reality suspended.</span>
            <br/>
            <span className="text-xs opacity-70 text-slate-400">Press Ctrl+C to disconnect from the Matrix.</span>
        </div>
    );
};

