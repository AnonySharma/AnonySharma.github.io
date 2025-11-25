import React, { useState, useEffect } from 'react';

export const TypeGame: React.FC<{ onExit: (score?: string) => void }> = ({ onExit }) => {
    const quote = "Talk is cheap. Show me the code.";
    const [input, setInput] = useState('');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [wpm, setWpm] = useState<string | null>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey && e.key === 'c') || (e.metaKey && e.key === 'c')) {
                if (window.getSelection()?.toString()) return;
                onExit();
                return;
            }
            
            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                if (!startTime) setStartTime(Date.now());
                setInput(prev => {
                    const next = prev + e.key;
                    if (next === quote) {
                        const duration = (Date.now() - (startTime || Date.now())) / 1000 / 60;
                        const calculatedWpm = Math.round((quote.length / 5) / duration);
                        setWpm(calculatedWpm.toString());
                        setTimeout(() => onExit(`Finished with ${calculatedWpm} WPM`), 2000);
                    }
                    return next.slice(0, quote.length);
                });
            } else if (e.key === 'Backspace') {
                setInput(prev => prev.slice(0, -1));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [startTime, quote, onExit]);

    return (
        <div className="my-4 p-4 border border-slate-700 bg-slate-900/50 rounded max-w-2xl">
            <div className="text-xs text-slate-500 mb-2">TYPING SPEED TEST - Press Ctrl+C to quit</div>
            <div className="font-mono text-xl leading-relaxed break-all relative">
                {quote.split('').map((char, i) => {
                    let color = 'text-slate-600';
                    let bg = 'transparent';
                    if (i < input.length) {
                        color = input[i] === char ? 'text-green-400' : 'text-red-400';
                        if (input[i] !== char) bg = 'bg-red-900/30';
                    }
                    if (i === input.length) return <span key={i} className="bg-blue-500 text-black animate-pulse">{char === ' ' ? '\u00A0' : char}</span>;
                    return <span key={i} className={`${color} ${bg}`}>{char}</span>;
                })}
            </div>
            {wpm && (
                <div className="mt-4 text-yellow-400 font-bold text-2xl animate-bounce">
                    SCORE: {wpm} WPM
                </div>
            )}
        </div>
    );
};

