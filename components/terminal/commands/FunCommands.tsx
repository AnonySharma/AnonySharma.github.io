
import React, { useState, useEffect, useRef } from 'react';
import { PROFILE_CONFIG, getTitleWithCompany } from '../../../config';
import { Activity } from 'lucide-react';

export const CowsayOutput: React.FC<{ args: string[] }> = ({ args }) => {
    const text = args.length > 0 ? args.join(' ') : "Moo! I'm a virtual cow living in your browser.";
    const len = text.length + 2;
    const dash = '-'.repeat(len);
    
    return (
        <pre className="text-green-400 font-mono text-xs sm:text-sm leading-none my-2">
{`
 ${'_'.repeat(len)}
< ${text} >
 ${dash}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
`}
        </pre>
    );
};

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
        <div className="text-green-400 font-mono animate-pulse my-2">
            Matrix Mode Active. Reality suspended.
            <br/>
            <span className="text-xs opacity-70 text-slate-400">Press Ctrl+C to disconnect from the Matrix.</span>
        </div>
    );
};

export const SteamLocomotive: React.FC<{ onExit: () => void, scrollToBottom: () => void }> = ({ onExit, scrollToBottom }) => {
    const [position, setPosition] = useState(100); // Percentage
    const animationRef = useRef<number>(0);

    useEffect(() => {
        scrollToBottom();
        const animate = () => {
            setPosition(prev => {
                if (prev <= -50) {
                    onExit();
                    return -50;
                }
                return prev - 0.8;
            });
            animationRef.current = requestAnimationFrame(animate);
        };
        animationRef.current = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationRef.current);
    }, [onExit, scrollToBottom]);

    const train = `
      ====        ________                ___________
  _D _|  |_______/        \\__I_I_____===__|_________|
   |(_)---  |   H\\________/ |   |        =|___ ___|      _________________
   /     |  |   H  |  |     |   |         ||_| |_||     _|                \\_____A
  |      |  |   H  |__--------------------| [___] |   =|                        |
  | ________|___H__/__|_____/[][]~\\_______|       |   -|                        |
  |/ |   |-----------I_____I [][] []  D   |=======|____|________________________|_
__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|__________________________|_
 |/-=|___|=O=====O=====O=====O   |_____/~\\___/          |_D__D__D_|  |_D__D__D_|
  \\_/      \\__/  \\__/  \\__/  \\__/      \\_/               \\_/   \\_/    \\_/   \\_/
`;

    return (
        <div className="overflow-hidden py-4">
            <pre 
                className="font-mono text-xs sm:text-sm leading-none whitespace-pre text-white"
                style={{ transform: `translateX(${position}%)` }}
            >
                {train}
            </pre>
        </div>
    );
};

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

export const SingPlayer: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [status, setStatus] = useState<'loading' | 'playing' | 'finished' | 'stopped'>('loading');
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const lyrics = [
    { text: "Never", start: 44.0, end: 44.3 },
    { text: "gonna", start: 44.3, end: 44.5 },
    { text: "give", start: 44.5, end: 44.8 },
    { text: "you", start: 44.8, end: 45.1 },
    { text: "up", start: 45.1, end: 45.5 },
    { text: "\n", start: 45.5, end: 45.7 }, 
    { text: "Never", start: 45.7, end: 46.0 },
    { text: "gonna", start: 46.0, end: 46.2 },
    { text: "let", start: 46.2, end: 46.4 },
    { text: "you", start: 46.4, end: 46.6 },
    { text: "down", start: 46.6, end: 47.8 },
  ];

  useEffect(() => {
    const audio = new Audio("/assets/sounds/rickroll.mp3");
    audioRef.current = audio;
    audio.volume = 0.6;
    
    audio.currentTime = 44.0;

    const handleCanPlay = () => {
      if (status === 'loading') {
        setStatus('playing');
        audio.play().catch(e => {
            console.error("Playback failed", e);
            setStatus('stopped');
            onFinish();
        });
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.currentTime >= 48.0) {
        audio.pause();
        setStatus('finished');
        onFinish();
      }
    };

    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    if (audio.readyState >= 3) {
        handleCanPlay();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (
            (e.metaKey && e.key === 'c') || 
            (e.ctrlKey && e.shiftKey && e.key === 'c') ||
            (e.ctrlKey && e.key === 'c')
        ) {
            if (window.getSelection()?.toString()) return;
            e.preventDefault();
            if (audioRef.current) {
                audioRef.current.pause();
            }
            setStatus('stopped');
            onFinish();
        }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeEventListener('canplaythrough', handleCanPlay);
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [status, onFinish]);

  if (status === 'loading') {
      return (
          <div className="flex items-center gap-2 text-yellow-400 animate-pulse my-2">
              <Activity size={16} className="animate-spin" />
              <span>INITIALIZING AUDIO STREAM... [BUFFERING]</span>
          </div>
      );
  }

  if (status === 'stopped') {
      return <div className="text-red-400 my-2">^C [PLAYBACK HALTED BY USER]</div>;
  }

  return (
    <div className="my-4 p-4 border-l-4 border-purple-500 bg-purple-900/10 font-mono text-lg leading-relaxed">
      <div className="text-xs text-slate-500 mb-2 uppercase tracking-widest">Now Playing: Rick Astley - Never Gonna Give You Up</div>
      <div>
        {lyrics.map((word, i) => {
            const isActive = currentTime >= word.start && currentTime < word.end;
            const isPast = currentTime >= word.end;
            
            if (word.text === "\n") return <br key={i} />;

            return (
                <span 
                    key={i} 
                    className={`inline-block mr-2 transition-all duration-100 ${
                        isActive 
                            ? 'text-green-400 scale-110 font-bold shadow-[0_0_10px_#4ade80] bg-green-400/10 rounded px-1' 
                            : isPast 
                                ? 'text-slate-500 opacity-50' 
                                : 'text-slate-700'
                    }`}
                >
                    {word.text}
                </span>
            );
        })}
      </div>
      {status === 'playing' && (
          <div className="mt-4 text-xs text-slate-500 animate-pulse">
              Press <span className="text-white font-bold">Cmd+C</span> or <span className="text-white font-bold">Ctrl+Shift+C</span> to stop
          </div>
      )}
      {status === 'finished' && (
          <div className="mt-2 text-green-500 text-sm">End of preview.</div>
      )}
    </div>
  );
};

export const FortuneOutput = () => {
    const quotes = [
        "A bug in the code is worth two in the documentation.",
        "It works on my machine.",
        "Experience is the name everyone gives to their mistakes.",
        "Java is to JavaScript what car is to Carpet.",
        "Code never lies, comments sometimes do.",
        "First, solve the problem. Then, write the code.",
        "Simplicity is the soul of efficiency.",
        "Make it work, make it right, make it fast."
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    return <div className="text-cyan-300 italic border-l-2 border-cyan-500 pl-3 my-2">{randomQuote}</div>
};

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

export const CoffeeOutput = () => (
    <div className="my-4 font-mono text-yellow-500 text-sm">
        <pre className="leading-none mb-2">
{`
    (  )   (   )  )
     ) (   )  (  (
     ( )  (    ) )
     _____________
    <_____________> ___
    |             |/ _ \\
    |               | | |
    |               |_| |
    |             |\\___/
    \\_____________/-'
`}
        </pre>
        <div className="mt-2 text-green-400">
            <span className="animate-pulse">Status:</span> Brewing perfect code...
        </div>
        <div className="text-slate-400 text-xs mt-1">
            Caffeine Level: 9000%
        </div>
    </div>
);

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

export const SnakeGame: React.FC<{ onExit: (score: number) => void }> = ({ onExit }) => {
    const WIDTH = 20;
    const HEIGHT = 15;
    const INITIAL_SNAKE = [[5, 5]];
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [food, setFood] = useState([10, 10]);
    const [dir, setDir] = useState([1, 0]); // [x, y]
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (gameOver) return;

            setSnake(prev => {
                const newHead = [prev[0][0] + dir[0], prev[0][1] + dir[1]];
                
                // Check walls
                if (newHead[0] < 0 || newHead[0] >= WIDTH || newHead[1] < 0 || newHead[1] >= HEIGHT) {
                    setGameOver(true);
                    return prev;
                }

                // Check self collision
                for (let part of prev) {
                    if (newHead[0] === part[0] && newHead[1] === part[1]) {
                        setGameOver(true);
                        return prev;
                    }
                }

                const newSnake = [newHead, ...prev];
                
                // Check food
                if (newHead[0] === food[0] && newHead[1] === food[1]) {
                    setScore(s => s + 1);
                    // Random food
                    setFood([Math.floor(Math.random() * WIDTH), Math.floor(Math.random() * HEIGHT)]);
                } else {
                    newSnake.pop();
                }
                
                return newSnake;
            });
        }, 150);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp' && dir[1] !== 1) setDir([0, -1]);
            if (e.key === 'ArrowDown' && dir[1] !== -1) setDir([0, 1]);
            if (e.key === 'ArrowLeft' && dir[0] !== 1) setDir([-1, 0]);
            if (e.key === 'ArrowRight' && dir[0] !== -1) setDir([1, 0]);
            
            if ((e.ctrlKey && e.key === 'c') || (e.metaKey && e.key === 'c')) {
                if (window.getSelection()?.toString()) return;
                onExit(score);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            clearInterval(interval);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [dir, gameOver, food, score, onExit]);

    // Render grid
    let gridString = "";
    // Top Border
    gridString += " +" + "-".repeat(WIDTH) + "+\n";
    
    for (let y = 0; y < HEIGHT; y++) {
        gridString += " |";
        for (let x = 0; x < WIDTH; x++) {
            let isSnake = false;
            for (let s of snake) {
                if (s[0] === x && s[1] === y) {
                    isSnake = true;
                    break;
                }
            }
            if (isSnake) gridString += "O";
            else if (x === food[0] && y === food[1]) gridString += "*";
            else gridString += " ";
        }
        gridString += "|\n";
    }
    
    // Bottom Border
    gridString += " +" + "-".repeat(WIDTH) + "+";

    return (
        <div className="my-4 font-mono leading-none inline-block bg-slate-900 p-4 border border-slate-700 rounded">
            <div className="text-center mb-2 text-yellow-400 font-bold">SCORE: {score}</div>
            <pre className="text-green-400">{gridString}</pre>
            {gameOver && (
                <div className="text-red-500 font-bold mt-2 text-center">
                    GAME OVER! Press Ctrl+C to exit.
                </div>
            )}
             <div className="text-xs text-slate-500 mt-2 text-center">Use Arrow Keys to Move</div>
        </div>
    );
};

export const PartyParrot: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [frame, setFrame] = useState(0);
    const frames = [
`
      .
     / \\
    (o.o)
     |=|
    __|__
`,
`
    .
     \\ /
    ( o.o)
     |=|
    __|__
`,
`
      .
     / \\
    (o.o )
     |=|
    __|__
`,
`
   .
  \\ /
 (o.o)
  |=|
 __|__
`
    ];
    const colors = ["text-red-500", "text-yellow-500", "text-green-500", "text-blue-500", "text-purple-500"];

    useEffect(() => {
        const interval = setInterval(() => {
            setFrame(f => (f + 1) % frames.length);
        }, 100);
        
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey && e.key === 'c') || (e.metaKey && e.key === 'c')) {
                if (window.getSelection()?.toString()) return;
                onExit();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            clearInterval(interval);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [frames.length, onExit]);

    return (
        <div className="my-4">
            <pre className={`font-mono font-bold text-2xl ${colors[frame % colors.length]} transition-colors duration-100`}>
                {frames[frame % frames.length]}
            </pre>
            <div className="text-slate-500 text-xs mt-2">Party time! (Ctrl+C to stop)</div>
        </div>
    );
};

export const SystemPanic: React.FC<{ onReset: () => void }> = ({ onReset }) => {
    const [logs, setLogs] = useState<React.ReactNode[]>([]);
    
    useEffect(() => {
        const sequence = [
            { text: `root@${PROFILE_CONFIG.terminal.osName.toLowerCase()}s:~# rm -rf / --no-preserve-root`, className: "text-white font-bold" },
            { text: "rm: cannot remove '/proc/1/fd': Operation not permitted", className: "text-slate-500" },
            { text: `rm: removing directory '/home/${PROFILE_CONFIG.terminal.username}/portfolio'`, className: "text-red-500" },
            { text: `rm: removing directory '/home/${PROFILE_CONFIG.terminal.username}/projects'`, className: "text-red-500" },
            { text: "rm: removing directory '/usr/bin'", className: "text-red-500" },
            { text: "rm: removing directory '/var/log'", className: "text-red-500" },
            { text: "WARNING: CRITICAL SYSTEM FILE DELETED", className: "text-yellow-400 bg-red-900/30 inline-block px-1" },
            { text: "rm: removing directory '/etc/systemd'", className: "text-red-500" },
            { text: `ALERT: ${PROFILE_CONFIG.personal.fullName.toUpperCase()} IS GONNA GO JOBLESS...`, className: "text-red-500 font-bold text-xl animate-pulse" },
            { text: "DELETING: CAREER_PROSPECTS.DB", className: "text-red-500" },
            { text: "DELETING: HOPE.TXT", className: "text-red-500" },
            { text: "KERNEL PANIC: init not found! Try passing init= option to kernel.", className: "text-white bg-red-600 px-1 mt-2" },
            { text: "System halted.", className: "text-white" }
        ];

        let delay = 0;
        sequence.forEach((item, i) => {
            delay += Math.random() * 300 + 50;
            if (i === 0) delay = 0;
            
            setTimeout(() => {
                setLogs(prev => [...prev, <div key={i} className={`mb-1 font-mono ${item.className}`}>{item.text}</div>]);
                if (i === sequence.length - 1) {
                    setTimeout(onReset, 3000);
                }
            }, delay);
        });
    }, [onReset]);

    return (
        <div className="fixed inset-0 z-[9999] bg-black p-4 font-mono text-sm sm:text-base overflow-hidden flex flex-col justify-end pb-10">
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 opacity-20 animate-[scan_3s_linear_infinite]"></div>
            <div className="flex-1 flex flex-col justify-end">
                {logs}
            </div>
        </div>
    );
};

// Joke Output Component
export const JokeOutput: React.FC = () => {
    const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs.",
        "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
        "I told my wife she was drawing her eyebrows too high. She looked surprised.",
        "There are 10 types of people in the world: Those who understand binary, and those who don't."
    ];
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    return <span className="text-cyan-300">{randomJoke}</span>;
};

// Answer 42 Output Component
export const Answer42Output: React.FC = () => {
    return <span className="text-green-400">The Answer to the Ultimate Question of Life, the Universe, and Everything.</span>;
};

// Whois Output Component
export const WhoisOutput: React.FC<{ args: string[] }> = ({ args }) => {
    const subArg = args[0]?.toLowerCase();
    
    const firstNameLower = PROFILE_CONFIG.personal.firstName.toLowerCase();
    const companyLower = PROFILE_CONFIG.personal.company.toLowerCase();
    const institutionLower = PROFILE_CONFIG.education.institution.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    if (!subArg || subArg === firstNameLower) {
        return (
            <div className="border border-green-500 p-2 text-green-500 font-mono">
                NAME: {PROFILE_CONFIG.personal.fullName}<br />
                CLASS: S-Tier Developer<br />
                SPECIALTY: Turning Coffee into Code<br />
                STATUS: Online & Ready to Hire<br />
                <span className="text-slate-500 text-xs mt-1">Try 'whois {institutionLower}' or 'whois {companyLower}' for more.</span>
            </div>
        );
    } else if ([companyLower, 'work', 'company'].includes(subArg)) {
        return (
            <div className="text-blue-400 font-mono">
                <div className="font-bold border-b border-blue-500 mb-1">{PROFILE_CONFIG.personal.company.toUpperCase()} IDENTITY</div>
                <div>ROLE: {PROFILE_CONFIG.personal.title}</div>
                <div>TENURE: {PROFILE_CONFIG.currentRole.period}</div>
                <div>LOCATION: {PROFILE_CONFIG.currentRole.location}</div>
                <div>MISSION: Building enterprise solutions at scale.</div>
            </div>
        );
    } else if ([institutionLower, 'college', 'education', 'university'].includes(subArg)) {
        return (
            <div className="text-yellow-400 font-mono">
                <div className="font-bold border-b border-yellow-500 mb-1">ACADEMIC RECORDS</div>
                <div>INSTITUTE: {PROFILE_CONFIG.education.institution}</div>
                <div>DEGREE: {PROFILE_CONFIG.education.degree}</div>
                <div>PERIOD: {PROFILE_CONFIG.education.period}</div>
                {PROFILE_CONFIG.education.achievements && PROFILE_CONFIG.education.achievements.length > 0 && (
                    <div>ACHIEVEMENTS: {PROFILE_CONFIG.education.achievements.join(', ')}</div>
                )}
            </div>
        );
    } else if (['linkedin', 'social'].includes(subArg)) {
        return (
            <div>
                Find me on LinkedIn: <a href={PROFILE_CONFIG.social.linkedin.url} target="_blank" className="text-blue-400 underline">{PROFILE_CONFIG.social.linkedin.username}</a>
            </div>
        );
    } else {
        return <span className="text-slate-400">Unknown user or entity: {subArg}. Try '{firstNameLower}', '{companyLower}', or '{institutionLower}'.</span>;
    }
};

// Easter Eggs Output Component
export const EasterEggsOutput: React.FC<{ commands: Array<{ name: string; category?: string; aliases?: string[] }> }> = ({ commands }) => {
    const easterEggCommands = commands
        .filter(cmd => cmd.category === 'fun')
        .map(cmd => {
            if (cmd.aliases && cmd.aliases.length > 0) {
                return `${cmd.name} / ${cmd.aliases.join(' / ')}`;
            }
            return cmd.name;
        });
    
    const specialCommands = ['sysinfo', 'neofetch', 'top', 'ping', 'rm -rf /'];
    const allEasterEggs = [...easterEggCommands, ...specialCommands].sort();
    
    return (
        <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm font-mono text-purple-400">
            {allEasterEggs.map((cmd, idx) => (
                <div key={idx}>{cmd}</div>
            ))}
        </div>
    );
};

// Stonks Output Component
export const StonksOutput: React.FC = () => {
    const isUp = Math.random() > 0.5;
    const stonkChartUp = `
        ▲  
        |      /\\  
        |   /\\/  \\    /\\
    70$ |  /      \\  /  \\      /
        | /        \\/    \\    /
        |/                \\  /
    10$ |                  \\/
        +---------------------------->
    `;
    const stonkChartDown = `
    70$ +--\\
        |   \\      /\\
        |    \\    /  \\    /
        |     \\/\\/    \\  /
    10$ |              \\/
        |                  
        +---------------------------->
    `;
    
    if (isUp) {
        return <pre className="text-green-400 font-mono whitespace-pre">{stonkChartUp} <br/>Crypto portfolio: +10000% 🚀 (To the moon!)</pre>;
    } else {
        return <pre className="text-red-400 font-mono whitespace-pre">{stonkChartDown} <br/>Crypto portfolio: -99.9% 📉 (Buy the dip?)</pre>;
    }
};

// Weather Output Component
export const WeatherOutput: React.FC = () => {
    return <span className="text-blue-300">Current weather in Server Room: 21°C, 0% chance of sunlight, 100% chance of bugs.</span>;
};

// Coinflip Output Component
export const CoinflipOutput: React.FC = () => {
    const result = Math.random() > 0.5 ? 'HEADS' : 'TAILS';
    return <span className="font-bold text-yellow-400">{result}</span>;
};

// Yeet Output Component
export const YeetOutput: React.FC = () => {
    return <span className="text-yellow-400">YEET! 👋</span>;
};

// Incognito Output Components
export const IncognitoOnOutput: React.FC = () => {
    return <span className="text-slate-500">Going dark... (Incognito Mode Active)</span>;
};

export const IncognitoOffOutput: React.FC = () => {
    return <span className="text-green-400">Welcome back to the grid.</span>;
};

// Touch Grass Output Component
export const TouchGrassOutput: React.FC = () => {
    return <span className="text-green-500">System overheating. User needs sunlight. Opening maps...</span>;
};

// Touch Error Output Component
export const TouchErrorOutput: React.FC = () => {
    return <span className="text-pink-400">Hey! Don't touch me! 😡</span>;
};

// Sudo Sandwich Output Component
export const SudoSandwichOutput: React.FC = () => {
    return <span className="text-green-400">Okay. 🥪</span>;
};

// Sudo Permission Denied Output Component
export const SudoPermissionDeniedOutput: React.FC = () => {
    return <span className="text-red-400 font-bold">Permission denied: You are not in the sudoers file. This incident will be reported.</span>;
};

// Vim Output Component
export const VimOutput: React.FC = () => {
    return <span className="text-yellow-400">Vim/Emacs not found. To exit this thought loop, simply click the close button on the top right.</span>;
};

// Open Success Output Component
export const OpenSuccessOutput: React.FC<{ fileName: string }> = ({ fileName }) => {
    return <span className="text-green-400">Opening {fileName}...</span>;
};

// Git Easter Eggs
export const GitStatusOutput: React.FC = () => {
    const statuses = [
        "On branch main\nYour branch is up to date with 'origin/main'.\n\nChanges not staged for commit:\n  (use \"git add <file>...\" to update what will be committed)\n  modified:   motivation.txt\n  deleted:    sleep.schedule\n\nUntracked files:\n  (use \"git add <file>...\" to include in what will be committed)\n    coffee.cup\n    TODO.md\n\nno changes added to commit (use \"git add\" and/or \"git commit -a\")",
        "On branch main\nYour branch is ahead of 'origin/main' by 42 commits.\n\nnothing to commit, working tree clean\n(But your TODO list is a mess)",
        "On branch feature/infinite-scroll\nYour branch and 'origin/feature/infinite-scroll' have diverged,\nand have 69 and 420 different commits each, respectively.\n  (use \"git rebase\" to reconcile)\n\nChanges staged for commit:\n  modified:   README.md\n  modified:   sanity.js"
    ];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    return (
        <div className="font-mono text-sm text-slate-300 whitespace-pre-line">
            {status}
        </div>
    );
};

export const GitCommitOutput: React.FC<{ args: string[] }> = ({ args }) => {
    const funnyMessages = [
        "Fixed bug (I think)",
        "WIP: It works on my machine",
        "Commit message goes here",
        "Please work",
        "Fixed typo in comment",
        "Removed debug code (maybe)",
        "Update stuff",
        "asdf",
        "Fix fix fix",
        "Merge branch 'fix-bug-that-i-introduced'",
        "Initial commit (after 3 months of development)",
        "Refactor everything",
        "It's 3am, this should work",
        "Quick fix (famous last words)",
        "Removed console.log statements",
        "Added feature that nobody asked for",
        "Fixed the thing that was broken",
        "Update dependencies (hope nothing breaks)",
        "Code cleanup (made it worse)",
        "Fixed merge conflicts (by deleting everything)"
    ];
    
    const hasMessage = args.includes('-m') && args[args.indexOf('-m') + 1];
    const message = hasMessage ? args[args.indexOf('-m') + 1] : funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
    
    return (
        <div className="font-mono text-sm">
            <div className="text-green-400">[main {Math.random().toString(36).substring(2, 9)}] {message}</div>
            <div className="text-slate-500 text-xs mt-1">
                {Math.floor(Math.random() * 5) + 1} file(s) changed, {Math.floor(Math.random() * 100) + 10} insertion(s)(+), {Math.floor(Math.random() * 20)} deletion(s)(-)
            </div>
        </div>
    );
};

export const GitPushOutput: React.FC = () => {
    const outcomes = [
        {
            text: "Everything up-to-date\n(Your local changes are still there, you just forgot to commit)",
            color: "text-yellow-400"
        },
        {
            text: `Enumerating objects: 42, done.\nCounting objects: 100% (42/42), done.\nDelta compression using up to 8 threads\nCompressing objects: 100% (21/21), done.\nWriting objects: 100% (21/21), 1.23 MiB | 1.23 MiB/s, done.\nTotal 21 (delta 15), reused 0 (delta 0)\nTo github.com:${PROFILE_CONFIG.social.github.username}/repo.git\n   abc1234..def5678  main -> main`,
            color: "text-green-400"
        },
        {
            text: `To github.com:${PROFILE_CONFIG.social.github.username}/repo.git\n ! [rejected]        main -> main (fetch first)\nerror: failed to push some refs to 'origin/main'\nhint: Updates were rejected because the remote contains work that you do\nhint: not have locally. This is usually caused by another repository pushing\nhint: to the same ref. You may want to first integrate the remote changes\nhint: (e.g., 'git pull ...') before pushing again.\n(Classic git moment)`,
            color: "text-red-400"
        }
    ];
    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    return (
        <div className={`font-mono text-sm whitespace-pre-line ${outcome.color}`}>
            {outcome.text}
        </div>
    );
};

export const GitBlameOutput: React.FC<{ args: string[] }> = ({ args }) => {
    const file = args[0] || 'code.js';
    const blamees = [
        "Past me (2023-01-15)",
        "The intern (we don't talk about it)",
        "Copy-paste from Stack Overflow",
        "GitHub Copilot",
        "Me, but I was tired",
        "The previous developer (they're gone now)",
        "ChatGPT (it seemed like a good idea)",
        "Me, 3 coffees ago",
        "The person who wrote 'TODO: fix this'",
        "Someone who clearly didn't understand the codebase"
    ];
    const blamee = blamees[Math.floor(Math.random() * blamees.length)];
    
    return (
        <div className="font-mono text-sm">
            <div className="text-slate-400">Blame for {file}:</div>
            <div className="text-red-400 mt-2">
                {Math.random().toString(36).substring(2, 9)} ({blamee} {Math.floor(Math.random() * 1000) + 100} days ago) Line 1-{Math.floor(Math.random() * 50) + 10}:<br />
                <span className="text-slate-300">  // This code is cursed</span>
            </div>
        </div>
    );
};

export const GitLogOutput: React.FC = () => {
    const author = PROFILE_CONFIG.social.github.username;
    const commits = [
        { hash: "a1b2c3d", msg: "Fixed the thing", author: author, days: 1 },
        { hash: "e4f5g6h", msg: "WIP: Still broken", author: author, days: 2 },
        { hash: "i7j8k9l", msg: "Added feature", author: author, days: 3 },
        { hash: "m1n2o3p", msg: "Quick fix", author: author, days: 5 },
        { hash: "q4r5s6t", msg: "Initial commit", author: author, days: 100 }
    ];
    
    return (
        <div className="font-mono text-sm text-slate-300">
            {commits.map((commit, i) => (
                <div key={i} className="mb-2">
                    <span className="text-yellow-400">{commit.hash.substring(0, 7)}</span>
                    <span className="text-slate-500 ml-2">({commit.days} day{commit.days !== 1 ? 's' : ''} ago)</span>
                    <span className="text-green-400 ml-2">{commit.msg}</span>
                    <span className="text-slate-600 ml-2">&lt;{commit.author}@github.com&gt;</span>
                </div>
            ))}
        </div>
    );
};

export const GitMergeOutput: React.FC = () => {
    return (
        <div className="font-mono text-sm">
            <div className="text-yellow-400">Auto-merging important-file.js</div>
            <div className="text-red-400 mt-2">CONFLICT (content): Merge conflict in important-file.js</div>
            <div className="text-slate-400 mt-2">
                Automatic merge failed; fix conflicts and then commit the result.<br />
                <span className="text-slate-600">(Good luck! 🍀)</span>
            </div>
        </div>
    );
};

export const GitRebaseOutput: React.FC = () => {
    return (
        <div className="font-mono text-sm">
            <div className="text-yellow-400">First, rewinding head to replay your work on top of it...</div>
            <div className="text-red-400 mt-2">Applying: Your commit message</div>
            <div className="text-red-400">CONFLICT (modify/delete): file.js deleted in HEAD and modified in Your commit message.</div>
            <div className="text-slate-400 mt-2">
                Could not apply Your commit message... {Math.floor(Math.random() * 10) + 1} conflict(s)<br />
                <span className="text-slate-600">(This is why people use merge instead 😅)</span>
            </div>
        </div>
    );
};
