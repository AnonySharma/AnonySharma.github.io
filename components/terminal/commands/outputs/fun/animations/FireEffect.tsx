import React, { useState, useEffect } from 'react';

export const FireEffect: React.FC<{ onExit: () => void, scrollToBottom: () => void }> = ({ onExit, scrollToBottom }) => {
    const [frame, setFrame] = useState(0);
    const [fireLines, setFireLines] = useState<string[]>([]);
    
    useEffect(() => {
        scrollToBottom();
        const width = 40;
        const height = 10;
        const chars = " ,;+ltgti!lI";
        
        // Initialize grid
        let grid = Array(height).fill(0).map(() => Array(width).fill(0));

        const interval = setInterval(() => {
            // Bottom row random intensity
            for (let x = 0; x < width; x++) {
                grid[height - 1][x] = Math.floor(Math.random() * chars.length);
            }

            // Calculate fire propagation
            for (let y = 0; y < height - 1; y++) {
                for (let x = 0; x < width; x++) {
                    const decay = Math.floor(Math.random() * 2);
                    const below = grid[y + 1][x];
                    const newVal = Math.max(0, below - decay);
                    grid[y][x] = newVal;
                }
            }

            // Convert to string
            const lines = grid.map(row => row.map(val => {
                const char = chars[val] || ' ';
                // Coloring based on intensity
                return val > 8 ? `<span class="text-white">${char}</span>` : 
                       val > 5 ? `<span class="text-yellow-400">${char}</span>` : 
                       val > 2 ? `<span class="text-orange-500">${char}</span>` : 
                       `<span class="text-red-900">${char}</span>`;
            }).join(''));

            setFireLines(lines);
            setFrame(f => f + 1);
        }, 100);

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
        <div className="font-mono text-xs leading-none bg-black p-4 rounded my-2 inline-block">
            {fireLines.map((line, i) => (
                <div key={i} dangerouslySetInnerHTML={{__html: line}} />
            ))}
            <div className="text-slate-500 mt-2 text-sm">Press Ctrl+C to extinguish.</div>
        </div>
    )
};

