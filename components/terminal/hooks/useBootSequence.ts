
import { useEffect, useRef } from 'react';
import { TerminalLine } from '../TerminalTypes';
import React from 'react';

export const useBootSequence = (
  phase: 'static' | 'boot' | 'login' | 'shell',
  setPhase: (p: 'static' | 'boot' | 'login' | 'shell') => void,
  setLines: React.Dispatch<React.SetStateAction<TerminalLine[]>>,
  scrollToBottom: () => void
) => {
  const hasBooted = useRef(false);
    
  // --- Initial Glitch / Static Phase ---
  useEffect(() => {
    if (phase === 'static') {
        hasBooted.current = false;
        const timer = setTimeout(() => {
            setPhase('boot');
        }, 1200); 
        return () => clearTimeout(timer);
    }
  }, [phase, setPhase]);

  // --- Boot Sequence ---
  useEffect(() => {
    if (phase !== 'boot') return;
    if (hasBooted.current) return;
    hasBooted.current = true;

    const bootMessages = [
      { text: "Linux version 5.15.0-76-generic (ankit@portfolio) (gcc version 11.3.0 (Ubuntu 11.3.0-1ubuntu1~22.04.1)) #1 SMP PREEMPT Mon Aug 21 12:00:00 UTC 2025", delay: 50 },
      { text: "Command line: BOOT_IMAGE=/boot/vmlinuz-5.15.0-76-generic root=UUID=1337-CODE ro quiet splash vt.handoff=7", delay: 50 },
      { text: "KERNEL supported cpus:", delay: 20 },
      { text: "  Intel GenuineIntel", delay: 20 },
      { text: "  AMD AuthenticAMD", delay: 20 },
      { text: "  Centaur CentaurHauls", delay: 20 },
      { text: "x86/fpu: Supporting XSAVE feature 0x001: 'x87 floating point registers'", delay: 30 },
      { text: "x86/fpu: Supporting XSAVE feature 0x002: 'SSE registers'", delay: 30 },
      { text: "x86/fpu: Supporting XSAVE feature 0x004: 'AVX registers'", delay: 30 },
      { text: "x86/fpu: Enabled xstate features 0x2e7, context size is 2440 bytes, using 'compacted' format.", delay: 50 },
      { text: "BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable", delay: 20 },
      { text: "BIOS-e820: [mem 0x000000000009fc00-0x000000000009ffff] reserved", delay: 20 },
      { text: "NX (Execute Disable) protection: active", delay: 40 },
      { text: "SMBIOS 2.8 present.", delay: 30 },
      { text: "DMI: AnkitPortfolio/VirtualMachine, BIOS 1.0 08/21/2025", delay: 50 },
      { text: "tsc: Fast TSC calibration failed", delay: 100 },
      { text: "tsc: Detected 3000.000 MHz processor", delay: 50 },
      { text: "Calibrating delay loop (skipped), value calculated using timer frequency.. 6000.00 BogoMIPS (lpj=3000000)", delay: 80 },
      { text: "pid_max: default: 32768 minimum: 301", delay: 20 },
      { text: "Mount-cache hash table entries: 256 (order: 0, 2048 bytes, linear)", delay: 30 },
      { text: "Mountpoint-cache hash table entries: 256 (order: 0, 2048 bytes, linear)", delay: 30 },
      { text: "Initializing cgroup subsys cpu", delay: 40 },
      { text: "Initializing cgroup subsys memory", delay: 40 },
      { text: "Initializing cgroup subsys devices", delay: 40 },
      { text: "Freeing SMP alternatives memory: 36K", delay: 60 },
      { text: "ASLR: ON", delay: 20 },
      { text: "Write protecting the kernel read-only data: 26624k", delay: 50 },
      { text: "Freeing unused kernel image (initmem) memory: 2048K", delay: 100 },
      { text: "Write protecting the kernel read-only data: 26624k", delay: 50 },
      { text: "x86/mm: Checked W+X mappings: passed, no W+X pages found.", delay: 50 },
      { text: "rodata_test: all tests were successful", delay: 50 },
      { text: "Run /init as init process", delay: 150 },
      { text: "systemd[1]: Detected virtualization 'portfolio-vm'.", delay: 100 },
      { text: "systemd[1]: Detected architecture x86-64.", delay: 50 },
      { text: "systemd[1]: Starting AnkitOS v2.4 Initialization Service...", delay: 200 },
      { text: React.createElement(React.Fragment, null, React.createElement("span", { className: "text-green-400" }, "[  OK  ]"), " Started Dispatch Password Requests to Console Directory Watch."), delay: 100 },
      { text: React.createElement(React.Fragment, null, React.createElement("span", { className: "text-green-400" }, "[  OK  ]"), " Reached target Local Encrypted Volumes."), delay: 50 },
      { text: React.createElement(React.Fragment, null, React.createElement("span", { className: "text-green-400" }, "[  OK  ]"), " Started Load Kernel Module: Creativity."), delay: 150 },
      { text: React.createElement(React.Fragment, null, React.createElement("span", { className: "text-green-400" }, "[  OK  ]"), " Started Load Kernel Module: Coffee."), delay: 150 },
      { text: React.createElement(React.Fragment, null, React.createElement("span", { className: "text-green-400" }, "[  OK  ]"), " Started Load Kernel Module: ProblemSolving."), delay: 150 },
      { text: React.createElement(React.Fragment, null, React.createElement("span", { className: "text-green-400" }, "[  OK  ]"), " Reached target Network."), delay: 50 },
      { text: React.createElement(React.Fragment, null, React.createElement("span", { className: "text-green-400" }, "[  OK  ]"), " Reached target Remote File Systems."), delay: 50 },
      { text: "Starting Network Manager...", delay: 200 },
      { text: React.createElement(React.Fragment, null, React.createElement("span", { className: "text-green-400" }, "[  OK  ]"), " Started Network Manager."), delay: 100 },
      { text: React.createElement(React.Fragment, null, React.createElement("span", { className: "text-green-400" }, "[  OK  ]"), " Reached target Multi-User System."), delay: 50 },
      { text: React.createElement(React.Fragment, null, React.createElement("span", { className: "text-green-400" }, "[  OK  ]"), " Reached target Graphical Interface."), delay: 500 },
      { text: "Welcome to AnkitOS v2.4", delay: 200 },
    ];

    const runBootSequence = async () => {
      let currentTime = 0.0;
      for (const msg of bootMessages) {
        await new Promise(r => setTimeout(r, msg.delay));
        // Add random slight increment to timestamp for realism
        currentTime += (Math.random() * 0.05) + 0.01; 
        const timestamp = currentTime.toFixed(6);

        setLines(prev => [...prev, { 
            type: 'boot', 
            content: msg.text,
            timestamp: timestamp
        }]);
        scrollToBottom();
      }
      
      await new Promise(r => setTimeout(r, 300));
      setPhase('login');
    };

    runBootSequence();
  }, [phase, setLines, setPhase, scrollToBottom]);
};
