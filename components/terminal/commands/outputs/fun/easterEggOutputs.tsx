import React, { useState, useEffect, useRef } from 'react';
import { PROFILE_CONFIG } from '../../../../../config';
import { Activity } from 'lucide-react';
import { COMMANDS } from '../../registry/commandRegistry';

export const Answer42Output: React.FC = () => {
    return <span className="text-green-400">The Answer to the Ultimate Question of Life, the Universe, and Everything.</span>;
};

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
    
    const handleCanPlay = () => {
        // Use a ref to check initialization status to avoid dependency loop
        if (audio.paused && audio.currentTime === 0) {
            audio.currentTime = 44.0;
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

    // If already ready, trigger manually
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
  }, []); // Empty dependency array to prevent re-creation of Audio object on status change

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
                    className={`inline-block mr-2 transition-all duration-100 rounded px-1 font-bold ${
                        isActive 
                            ? 'text-green-400 shadow-[0_0_10px_#4ade80] bg-green-400/10' 
                            : isPast 
                                ? 'text-slate-500 opacity-50 bg-transparent' 
                                : 'text-slate-700 bg-transparent'
                    }`}
                >
                    {word.text}
                </span>
            );
        })}
      </div>
      {status === 'playing' && (
          <div className="mt-4 text-xs text-slate-500 w-full">
              Press <span className="text-white font-bold">Cmd+C</span> or <span className="text-white font-bold">Ctrl+Shift+C</span> to stop
          </div>
      )}
      {status === 'finished' && (
          <div className="mt-2 text-green-500 text-sm">End of preview.</div>
      )}
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

