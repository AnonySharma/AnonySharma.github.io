import React, { useState, useEffect } from 'react';

export const HackProcess: React.FC<{ onExit: () => void, scrollToBottom: () => void }> = ({ onExit, scrollToBottom }) => {
    const [logs, setLogs] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const [stage, setStage] = useState(0);

    useEffect(() => {
        scrollToBottom();
    }, [logs]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        
        // Stage 0: Brute Force
        if (stage === 0) {
            interval = setInterval(() => {
                setProgress(p => {
                    if (p >= 30) {
                        setStage(1);
                        setLogs(prev => [...prev, "[SUCCESS] Firewall bypassed on port 443"]);
                        return 30;
                    }
                    return p + 1;
                });
                const randHex = Math.random().toString(16).substring(2, 8).toUpperCase();
                if (Math.random() > 0.7) {
                     setLogs(prev => [...prev, `[BRUTE] Trying 0x${randHex}... [FAIL]`]);
                }
            }, 100);
        }
        
        // Stage 1: SQL Injection
        if (stage === 1) {
             interval = setInterval(() => {
                setProgress(p => {
                    if (p >= 70) {
                        setStage(2);
                        setLogs(prev => [...prev, "[SUCCESS] SQL Injection payload accepted. Dumping tables..."]);
                        return 70;
                    }
                    return p + 2;
                });
                if (Math.random() > 0.6) {
                     setLogs(prev => [...prev, `[INJECT] SELECT * FROM USERS WHERE ADMIN=1...`]);
                }
            }, 150);
        }

        // Stage 2: Matrix Decryption
        if (stage === 2) {
             interval = setInterval(() => {
                setProgress(p => {
                    if (p >= 100) {
                        setStage(3);
                        setLogs(prev => [...prev, "[ROOT] ACCESS GRANTED. Welcome, Admin."]);
                        setTimeout(onExit, 2000);
                        return 100;
                    }
                    return p + 1;
                });
                setLogs(prev => [...prev, `[DECRYPT] ${Math.random().toString(36).substring(2)}`]);
            }, 50);
        }

        return () => clearInterval(interval);
    }, [stage, onExit]);

    return (
        <div className="font-mono text-sm max-w-xl border border-green-500/30 p-4 bg-black/50 rounded my-2">
            <div className="text-green-400 font-bold mb-2 animate-pulse">
                HACKING TARGET: 127.0.0.1
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-4 bg-slate-800 mb-4 relative overflow-hidden rounded border border-slate-600">
                <div 
                    className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-100"
                    style={{ width: `${progress}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-bold mix-blend-difference">
                    {progress}%
                </div>
            </div>

            <div className="h-40 overflow-y-auto custom-scrollbar space-y-1 text-xs sm:text-sm">
                {logs.map((log, i) => (
                    <div key={i} className={`${log.includes('SUCCESS') || log.includes('ROOT') ? 'text-green-400 font-bold' : log.includes('FAIL') ? 'text-red-400' : 'text-green-800'}`}>
                        {log}
                    </div>
                ))}
            </div>
        </div>
    );
};

