import React, { useState, useEffect, useRef } from 'react';

export const PingProcess: React.FC<{ args: string[], onExit: (output: string[]) => void, scrollToBottom: () => void }> = ({ args, onExit, scrollToBottom }) => {
    const host = args[0] || 'google.com';
    const [lines, setLines] = useState<string[]>([]);
    const linesRef = useRef<string[]>([]); 
    
    useEffect(() => {
        const initLine = `PING ${host} (142.250.193.78): 56 data bytes`;
        setLines([initLine]);
        linesRef.current = [initLine];
        scrollToBottom();

        let count = 0;
        const maxCount = 4; 

        const interval = setInterval(() => {
            count++;
            const time = (Math.random() * 20 + 10).toFixed(1);
            const newLine = `64 bytes from 142.250.193.78: icmp_seq=${count-1} ttl=116 time=${time} ms`;
            
            setLines(prev => {
                const next = [...prev, newLine];
                linesRef.current = next;
                return next;
            });
            setTimeout(scrollToBottom, 10);
            
            if (count >= maxCount) {
                setTimeout(() => {
                    const stats = [
                        `\n--- ${host} ping statistics ---`,
                        `${maxCount} packets transmitted, ${maxCount} packets received, 0.0% packet loss`
                    ];
                    setLines(prev => {
                        const next = [...prev, ...stats];
                        linesRef.current = next;
                        return next;
                    });
                    setTimeout(scrollToBottom, 10);
                    setTimeout(() => onExit(linesRef.current), 500);
                }, 500);
                clearInterval(interval);
            }
        }, 800);

        const handleKeyDown = (e: KeyboardEvent) => {
             if ((e.ctrlKey && e.key === 'c') || (e.metaKey && e.key === 'c')) {
                if (window.getSelection()?.toString()) return;
                clearInterval(interval);
                linesRef.current.push('^C');
                onExit(linesRef.current);
             }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            clearInterval(interval);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [host, onExit, scrollToBottom]);

    return (
        <div className="font-mono text-sm">
            {lines.map((line, i) => <div key={i}>{line}</div>)}
        </div>
    );
};

