
import React, { useState, useEffect, useRef } from 'react';
import { Monitor } from 'lucide-react';

export const SysInfoOutput = () => (
  <div className="font-mono text-sm space-y-1 mb-2">
    <div className="flex items-center gap-2 text-slate-400 border-b border-slate-700 pb-1 mb-2">
        <Monitor size={14} /> <span>SYSTEM DIAGNOSTICS</span>
    </div>
    <div>OS: <span className="text-white">AnkitOS v2.4.0 LTS</span> (x86_64)</div>
    <div>Kernel: <span className="text-blue-400">5.15.0-76-generic</span></div>
    <div>Uptime: <span className="text-green-400">42 days, 7 hours, 12 mins</span></div>
    <div>Shell: <span className="text-yellow-400">zsh 5.8.1</span></div>
    <div className="flex gap-2">
        CPU: <span className="text-white">Neural Quantum Processor (128-core) @ 4.20GHz</span>
        <span className="text-slate-500">[Temp: 45°C]</span>
    </div>
    <div>
        Memory: <span className="text-white">64GB / 128GB</span> 
        <span className="text-green-400 ml-2">[||||||||||----------] 50%</span>
    </div>
    <div className="flex gap-2 items-center">
        Network: <span className="text-green-400">Connected (10Gbps uplink)</span> 
        <span className="text-slate-500 text-xs">IP: 192.168.1.42</span>
    </div>
  </div>
);

export const NeofetchOutput = () => (
    <div className="flex gap-6 font-mono text-sm mb-2 text-slate-300 flex-col sm:flex-row items-start">
        <div className="text-primary font-bold select-none leading-none">
<pre className="whitespace-pre font-mono text-primary">
{`    ___    __ __
   /   |  / //_/
  / /| | / , <   
 / ___ |/ /| |  
/_/  |_/_/ |_|  `}
</pre>
        </div>
        <div className="space-y-1">
            <div><span className="text-primary font-bold">ankit</span>@<span className="text-primary font-bold">portfolio</span></div>
            <div className="text-slate-500">-----------------</div>
            <div><span className="text-yellow-400 font-bold">OS</span>: AnkitOS v2.4 LTS</div>
            <div><span className="text-yellow-400 font-bold">Host</span>: Web Browser (Chrome V8)</div>
            <div><span className="text-yellow-400 font-bold">Kernel</span>: 5.15.0-generic</div>
            <div><span className="text-yellow-400 font-bold">Uptime</span>: 42 days, 7 hrs, 12 mins</div>
            <div><span className="text-yellow-400 font-bold">Shell</span>: zsh 5.8 (portfolio-theme)</div>
            <div><span className="text-yellow-400 font-bold">Resolution</span>: 1920x1080</div>
            <div><span className="text-yellow-400 font-bold">CPU</span>: Silicon Brain (1) @ 100%</div>
            <div><span className="text-yellow-400 font-bold">Memory</span>: 1337MiB / 8192MiB</div>
            <div className="mt-2 flex gap-1">
                <span className="w-3 h-3 bg-black"></span>
                <span className="w-3 h-3 bg-red-500"></span>
                <span className="w-3 h-3 bg-green-500"></span>
                <span className="w-3 h-3 bg-yellow-500"></span>
                <span className="w-3 h-3 bg-blue-500"></span>
                <span className="w-3 h-3 bg-purple-500"></span>
                <span className="w-3 h-3 bg-cyan-500"></span>
                <span className="w-3 h-3 bg-white"></span>
            </div>
        </div>
    </div>
);

export const PsOutput = () => {
    const processes = [
        { pid: 1, user: 'root', cpu: 0.1, mem: 0.2, cmd: 'init' },
        { pid: 420, user: 'ankit', cpu: 12.4, mem: 4.5, cmd: 'portfolio-kernel' },
        { pid: 1337, user: 'visitor', cpu: 0.0, mem: 0.1, cmd: 'shell' },
        { pid: 666, user: 'ai', cpu: 99.9, mem: 32.0, cmd: 'world_domination_script.sh' },
        { pid: 8080, user: 'node', cpu: 2.3, mem: 5.6, cmd: 'npm start' },
        { pid: 3000, user: 'music', cpu: 5.1, mem: 2.2, cmd: 'audio-daemon' },
    ];

    return (
        <div className="font-mono text-sm mb-2 w-full overflow-x-auto">
            <div className="text-slate-500 border-b border-slate-700 mb-1 pb-1 flex min-w-[500px]">
                <span className="w-16 shrink-0">PID</span> 
                <span className="w-20 shrink-0">USER</span> 
                <span className="w-16 shrink-0">CPU%</span> 
                <span className="w-16 shrink-0">MEM%</span> 
                <span className="shrink-0">COMMAND</span>
            </div>
            {processes.map((p) => (
                <div key={p.pid} className={`flex min-w-[500px] ${p.user === 'root' ? 'text-red-400' : p.user === 'ankit' ? 'text-blue-400' : 'text-slate-300'}`}>
                    <span className="w-16 shrink-0">{p.pid}</span>
                    <span className="w-20 shrink-0">{p.user}</span>
                    <span className="w-16 shrink-0">{p.cpu}</span>
                    <span className="w-16 shrink-0">{p.mem}</span>
                    <span className="shrink-0">{p.cmd}</span>
                </div>
            ))}
        </div>
    );
};

export const TopProcess: React.FC<{ onExit: (finalSnapshot: React.ReactNode) => void, scrollToBottom: () => void }> = ({ onExit, scrollToBottom }) => {
    const [stats, setStats] = useState<any[]>([]);
    const [header, setHeader] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollToBottom();
        const update = () => {
            const now = new Date().toLocaleTimeString();
            setHeader(`top - ${now} up 42 days,  1 user,  load average: 0.42, 0.50, 0.10`);
            
            setStats([
                { pid: 666, user: 'ai', pri: 20, ni: 0, virt: '10.2g', res: '4.1g', shr: '102m', s: 'S', cpu: (Math.random() * 5 + 95).toFixed(1), mem: 32.0, time: '1337:00', command: 'world_domination' },
                { pid: 420, user: 'ankit', pri: 20, ni: 0, virt: '802m', res: '204m', shr: '32m', s: 'R', cpu: (Math.random() * 10 + 5).toFixed(1), mem: 4.5, time: '42:00.00', command: 'portfolio-dev' },
                { pid: 1, user: 'root', pri: 20, ni: 0, virt: '164m', res: '12m', shr: '4m', s: 'S', cpu: 0.0, mem: 0.1, time: '1:23.45', command: 'init' },
                { pid: 1337, user: 'visitor', pri: 20, ni: 0, virt: '24m', res: '4m', shr: '2m', s: 'S', cpu: 0.0, mem: 0.1, time: '0:00.12', command: 'bash' },
                { pid: 88, user: 'daemon', pri: 20, ni: 0, virt: '42m', res: '8m', shr: '2m', s: 'S', cpu: 0.3, mem: 0.4, time: '0:10.00', command: 'kworker/u2:1' },
            ]);
        };

        update();
        const interval = setInterval(update, 1000);

        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey && e.key === 'c') || (e.metaKey && e.key === 'c') || e.key === 'q') {
                if (window.getSelection()?.toString()) return;
                clearInterval(interval);
                onExit(containerRef.current ? 
                    <div dangerouslySetInnerHTML={{__html: containerRef.current.innerHTML}} /> : 
                    <div className="text-slate-500">Session terminated.</div>
                );
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            clearInterval(interval);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onExit, scrollToBottom]);

    return (
        <div ref={containerRef} className="font-mono text-sm text-slate-300 whitespace-pre overflow-hidden">
            <div className="mb-2">{header}</div>
            <div className="mb-2">Tasks: 128 total,   1 running, 127 sleeping,   0 stopped,   0 zombie</div>
            <div className="mb-4">%Cpu(s):  4.2 us,  1.0 sy,  0.0 ni, 94.8 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st</div>
            
            <div className="bg-slate-800 text-black px-1 flex mb-1 font-bold">
                <span className="w-12">PID</span>
                <span className="w-16">USER</span>
                <span className="w-10">PR</span>
                <span className="w-10">NI</span>
                <span className="w-16">VIRT</span>
                <span className="w-16">RES</span>
                <span className="w-16">SHR</span>
                <span className="w-8">S</span>
                <span className="w-16">%CPU</span>
                <span className="w-16">%MEM</span>
                <span className="w-20">TIME+</span>
                <span>COMMAND</span>
            </div>
            
            {stats.map((p) => (
                <div key={p.pid} className={`flex px-1 ${p.command === 'world_domination' ? 'text-red-400 animate-pulse' : ''}`}>
                    <span className="w-12">{p.pid}</span>
                    <span className="w-16">{p.user}</span>
                    <span className="w-10">{p.pri}</span>
                    <span className="w-10">{p.ni}</span>
                    <span className="w-16">{p.virt}</span>
                    <span className="w-16">{p.res}</span>
                    <span className="w-16">{p.shr}</span>
                    <span className="w-8">{p.s}</span>
                    <span className="w-16 text-green-400">{p.cpu}</span>
                    <span className="w-16">{p.mem}</span>
                    <span className="w-20">{p.time}</span>
                    <span>{p.command}</span>
                </div>
            ))}
            <div className="mt-4 text-black bg-green-400 inline-block px-1">Press 'q' or Ctrl+C to exit</div>
        </div>
    );
};

export const DockerPsOutput = () => (
    <div className="font-mono text-xs sm:text-sm mb-2 overflow-x-auto">
        <div className="text-slate-500 min-w-[800px] border-b border-slate-700 mb-1 pb-1 grid grid-cols-[120px_150px_200px_150px_150px_150px_1fr]">
            <span>CONTAINER ID</span>
            <span>IMAGE</span>
            <span>COMMAND</span>
            <span>CREATED</span>
            <span>STATUS</span>
            <span>PORTS</span>
            <span>NAMES</span>
        </div>
        <div className="text-slate-300 min-w-[800px] grid grid-cols-[120px_150px_200px_150px_150px_150px_1fr]">
            <span className="text-yellow-400">a1b2c3d4e5f6</span>
            <span className="text-blue-400">portfolio:v2</span>
            <span className="truncate">"/bin/sh -c 'npm sta…"</span>
            <span>42 minutes ago</span>
            <span className="text-green-400">Up 42 minutes</span>
            <span>{'0.0.0.0:3000->3000/tcp'}</span>
            <span>ankit-portfolio</span>
        </div>
        <div className="text-slate-300 min-w-[800px] grid grid-cols-[120px_150px_200px_150px_150px_150px_1fr] opacity-70">
            <span className="text-yellow-400">f9e8d7c6b5a4</span>
            <span className="text-blue-400">mongo:latest</span>
            <span className="truncate">"docker-entrypoint.s…"</span>
            <span>5 hours ago</span>
            <span className="text-green-400">Up 5 hours</span>
            <span>27017/tcp</span>
            <span>portfolio-db</span>
        </div>
    </div>
);

export const DockerImagesOutput = () => (
    <div className="font-mono text-xs sm:text-sm mb-2 overflow-x-auto">
        <div className="text-slate-500 min-w-[600px] border-b border-slate-700 mb-1 pb-1 grid grid-cols-[200px_100px_150px_150px_1fr]">
            <span>REPOSITORY</span>
            <span>TAG</span>
            <span>IMAGE ID</span>
            <span>CREATED</span>
            <span>SIZE</span>
        </div>
        <div className="text-slate-300 min-w-[600px] grid grid-cols-[200px_100px_150px_150px_1fr]">
            <span className="text-blue-400">ankit/brain</span>
            <span>latest</span>
            <span className="text-yellow-400">8f3a2b1c4d5e</span>
            <span>24 years ago</span>
            <span>1337 PB</span>
        </div>
        <div className="text-slate-300 min-w-[600px] grid grid-cols-[200px_100px_150px_150px_1fr]">
            <span className="text-blue-400">portfolio</span>
            <span>v2</span>
            <span className="text-yellow-400">a1b2c3d4e5f6</span>
            <span>2 days ago</span>
            <span>420 MB</span>
        </div>
        <div className="text-slate-300 min-w-[600px] grid grid-cols-[200px_100px_150px_150px_1fr]">
            <span className="text-blue-400">salesforce/crm</span>
            <span>production</span>
            <span className="text-yellow-400">b2c3d4e5f6a1</span>
            <span>1 week ago</span>
            <span>2.5 GB</span>
        </div>
    </div>
);

export const DockerRunOutput: React.FC<{ image: string }> = ({ image }) => {
    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => {
        const steps = [
            `Unable to find image '${image}:latest' locally`,
            `latest: Pulling from library/${image}`,
            `a3b2c1d4: Pulling fs layer`,
            `e5f6g7h8: Download complete`,
            `i9j0k1l2: Download complete`,
            `Status: Downloaded newer image for ${image}:latest`,
            `Error: Insufficient permissions. You are not a superuser.`,
            `Try 'sudo docker run ${image}' if you dare.`
        ];

        let delay = 0;
        steps.forEach((step, i) => {
            setTimeout(() => {
                setLines(prev => [...prev, step]);
            }, delay);
            delay += 400 + Math.random() * 400;
        });
    }, [image]);

    return (
        <div className="font-mono text-sm text-slate-300 space-y-1">
            {lines.map((line, i) => (
                <div key={i} className={line.includes('Error') ? 'text-red-400' : ''}>{line}</div>
            ))}
        </div>
    );
};
