import React, { useState, useEffect } from 'react';

export const CryptoMiner: React.FC<{ onExit: () => void, scrollToBottom: () => void }> = ({ onExit, scrollToBottom }) => {
    const [logs, setLogs] = useState<string[]>([]);
    
    useEffect(() => {
        scrollToBottom();
        const interval = setInterval(() => {
            const hash = Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2);
            const rate = (Math.random() * 10 + 40).toFixed(2);
            const time = new Date().toLocaleTimeString();
            
            setLogs(prev => {
                const newLogs = [...prev, `[${time}] [MINER] Hashing block... ${hash.substring(0,12)}... (${rate} MH/s)`];
                if (newLogs.length > 12) newLogs.shift();
                return newLogs;
            });
            scrollToBottom();

            // Randomly find a block
            if (Math.random() > 0.95) {
                setLogs(prev => [...prev, `[${time}] [SUCCESS] BLOCK FOUND! Reward: 6.25 BTC (fake)`]);
            }
        }, 200);

        const handleKeyDown = (e: KeyboardEvent) => {
             if ((e.ctrlKey && e.key === 'c') || (e.metaKey && e.key === 'c')) {
                if (window.getSelection()?.toString()) return;
                clearInterval(interval);
                onExit();
             }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            clearInterval(interval);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onExit, scrollToBottom]);

    return (
        <div className="font-mono text-sm text-yellow-400">
            {logs.map((log, i) => (
                <div key={i} className={log.includes('SUCCESS') ? 'text-green-400 font-bold' : ''}>{log}</div>
            ))}
            <div className="text-slate-500 mt-2">Press Ctrl+C to stop mining (and stay poor).</div>
        </div>
    );
};

