
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TerminalLine } from './terminal/TerminalTypes';
import { useFileSystem } from './terminal/FileSystem';
import { SystemPanic } from './terminal/commands/FunCommands';
import { TopBar } from './terminal/ui/TopBar';
import { Prompt } from './terminal/ui/Prompt';
import { useMatrixEffect } from './terminal/hooks/useMatrixEffect';
import { useBootSequence } from './terminal/hooks/useBootSequence';
import { useCommandLogic } from './terminal/hooks/useCommandLogic';
import { useSound } from '../contexts/SoundContext';

interface TerminalProps {
  onClose: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
}

const Terminal: React.FC<TerminalProps> = ({ onClose, onMinimize, isMinimized = false }) => {
  const { playBoot, playType, playClick } = useSound();
  // Phases: static (glitch) -> boot (logs) -> login (prompt) -> shell (interactive)
  const [phase, setPhase] = useState<'static' | 'boot' | 'login' | 'shell'>(() => {
    // Check if terminal was previously booted (not closed)
    const wasBooted = localStorage.getItem('terminal_booted') === 'true';
    return wasBooted ? 'shell' : 'static';
  });
  
  const [isMinimizing, setIsMinimizing] = useState(false);
  const [isMaximizing, setIsMaximizing] = useState(false);
  const prevMinimizedRef = React.useRef(isMinimized);
  
  const [lines, setLines] = useState<TerminalLine[]>(() => {
    // Don't restore lines from localStorage - they contain React elements that can't be serialized
    // Just show welcome message if terminal was previously booted
    if (localStorage.getItem('terminal_booted') === 'true') {
      return [
        { type: 'system', content: <div className="opacity-70 mt-2 mb-2">Access Granted. Welcome to <span className="text-blue-400 font-bold">AnkitOS v2.4</span>. Type <span className="text-yellow-400 font-bold">help</span> for list of executables.</div> }
      ];
    }
    return [];
  });
  const [input, setInput] = useState('');
  const [cursorPos, setCursorPos] = useState(0);
  const [isMaximized, setIsMaximized] = useState(false);
  const [matrixMode, setMatrixMode] = useState(false);
  const [bsodTriggered, setBsodTriggered] = useState(false);
  
  const [activeComponent, setActiveComponent] = useState<React.ReactNode | null>(null);
  const [currentPath, setCurrentPath] = useState<string[]>(['~', 'portfolio']);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fileSystem = useFileSystem();

  const scrollToBottom = useCallback(() => {
      // Use requestAnimationFrame to ensure the DOM has updated before scrolling
      requestAnimationFrame(() => {
          if (scrollRef.current) {
              scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }
      });
  }, []);

  // Handle Maximize Toggle with Fullscreen
  const handleMaximizeToggle = (maximized: boolean) => {
    setIsMaximized(maximized);
    if (maximized) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.log(`Error attempting to enable fullscreen mode: ${e.message} (${e.name})`);
      });
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((e) => {
           console.log(`Error attempting to exit fullscreen mode: ${e.message} (${e.name})`);
        });
      }
    }
  };

  // Sync state with native fullscreen changes (e.g. Escape key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsMaximized(false);
      } else {
        setIsMaximized(true);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Custom Hooks
  useMatrixEffect(canvasRef, matrixMode, isMaximized);
  
  // Check if terminal should boot (only if not previously booted)
  const shouldBoot = !localStorage.getItem('terminal_booted') || localStorage.getItem('terminal_booted') !== 'true';
  
  useEffect(() => {
    if (phase === 'static' && !isMinimized) {
        playBoot();
    }
  }, [phase, isMinimized, playBoot]);

  useBootSequence(phase, setPhase, setLines, scrollToBottom, shouldBoot);
  
  // Mark as booted when reaching shell phase
  useEffect(() => {
    if (phase === 'shell') {
      localStorage.setItem('terminal_booted', 'true');
    }
  }, [phase]);
  
  // Don't save lines to localStorage - they contain React elements that can't be serialized
  // The terminal state is preserved by the 'terminal_booted' flag
  
  // Handle animation states
  useEffect(() => {
    if (!prevMinimizedRef.current && isMinimized) {
      // Just minimized
      setIsMinimizing(true);
      setTimeout(() => {
        setIsMinimizing(false);
      }, 400);
    } else if (prevMinimizedRef.current && !isMinimized) {
      // Just maximized
      setIsMaximizing(true);
      setTimeout(() => {
        setIsMaximizing(false);
      }, 400);
    }
    prevMinimizedRef.current = isMinimized;
  }, [isMinimized]);
  
  // Handle close - reset boot state
  const handleClose = () => {
    localStorage.removeItem('terminal_booted');
    // Exit fullscreen if closed
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    onClose();
  };
  
  const { 
    handleCommand, 
    handleTabCompletion, 
    handleHistoryUp, 
    handleHistoryDown 
  } = useCommandLogic({
    lines, setLines,
    currentPath, setCurrentPath,
    activeComponent, setActiveComponent,
    setMatrixMode, setBsodTriggered,
    setInput, setCursorPos,
    onClose: handleClose, // Use modified handleClose
    scrollToBottom,
    fileSystem
  });

  // Handle login actions (Enter/Esc or button clicks)
  const handleLoginEnter = () => {
    setPhase('shell');
    // Clear logs and set the welcome message
    setLines([
        { type: 'system', content: <div className="opacity-70 mt-2 mb-2">Access Granted. Welcome to <span className="text-blue-400 font-bold">AnkitOS v2.4</span>. Type <span className="text-yellow-400 font-bold">help</span> for list of executables.</div> }
    ]);
    setCursorPos(0);
  };

  const handleLoginAbort = () => {
    handleClose();
  };

  // --- Global Key Listener for Login Phase ---
  useEffect(() => {
      if (phase !== 'login') return;

      const handleGlobalKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'Enter') {
              handleLoginEnter();
          } else if (e.key === 'Escape') {
              handleLoginAbort();
          }
      };

      window.addEventListener('keydown', handleGlobalKeyDown);
      return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [phase, onClose]);


  // --- Interaction ---
  useEffect(() => {
    if (phase === 'shell' || phase === 'boot') {
        scrollToBottom();
    }
  }, [lines, phase, input, activeComponent, scrollToBottom]);

  const focusInput = () => {
    // Only focus if no text is selected
    if (phase === 'shell' && !activeComponent && !window.getSelection()?.toString()) {
      inputRef.current?.focus();
    }
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLInputElement>) => {
      setCursorPos(e.currentTarget.selectionStart || 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        playType();
    } else if (e.key === 'Enter') {
        playClick();
    }

    // Ctrl+C: Cancel/Interrupt (Signal)
    if (e.key === 'c' && e.ctrlKey && !e.metaKey) {
         e.preventDefault();
         setLines(prev => [...prev, { type: 'input', content: input + '^C' }]);
         setInput('');
         setCursorPos(0);
         return;
    }

    // Cmd+C: Copy (Native browser behavior)
    if (e.key === 'c' && e.metaKey) {
        // Allow default copy behavior
        return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand(input);
      setInput('');
      setCursorPos(0);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleTabCompletion(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleHistoryUp();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleHistoryDown();
    }
  };

  // Handle command submission (for mobile submit button)
  const handleSubmitCommand = () => {
    if (input.trim()) {
      handleCommand(input);
      setInput('');
      setCursorPos(0);
    }
  };

  // Styles
  const bgColor = matrixMode ? 'bg-black' : 'bg-[#1a1b26]';
  const textColor = matrixMode ? 'text-green-500' : 'text-[#a9b1d6]';

  // --- Static / Glitch Screen Render ---
  if (phase === 'static' && !isMinimized) {
      return (
          <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
              }}></div>
              <div className="relative text-white font-mono text-4xl font-bold animate-pulse tracking-widest glitch-text">
                  SYSTEM BOOT
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent h-[20px] w-full animate-[scan_2s_linear_infinite]"></div>
          </div>
      );
  }

  // Minimized state - show small restore button with animation
  if (isMinimized && !isMinimizing) {
    return (
      <div className="fixed bottom-6 right-6 z-[100] minimize-button-appear">
        <button
          onClick={onMinimize}
          className="bg-[#1a1b26] border border-[#414868] rounded-lg px-4 py-2 text-sm text-[#a9b1d6] hover:bg-[#24283b] transition-all duration-200 flex items-center gap-2 shadow-xl hover:scale-110 active:scale-95 minimize-button-pulse"
          title="Restore Terminal"
        >
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="font-semibold">Terminal</span>
        </button>
      </div>
    );
  }

  // Determine animation class
  const animationClass = isMinimizing 
    ? 'terminal-minimizing' 
    : isMaximizing 
      ? 'terminal-maximizing' 
      : isMinimized 
        ? 'hidden' 
        : '';

  return (
    <div 
      className={`fixed z-[100] ${bgColor} ${textColor} font-mono p-4 sm:p-8 overflow-hidden flex flex-col ${animationClass} ${isMaximized ? 'inset-0' : 'inset-0'}`}
      onClick={(e) => {
        // Only focus input if click is directly on the terminal container or void space
        // and NOT if the user is selecting text
        if (window.getSelection()?.toString()) return;
        
        focusInput();
      }}
      style={{ 
          fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
          textShadow: matrixMode ? '0 0 8px rgba(34, 197, 94, 0.8)' : 'none',
          transformOrigin: isMinimizing || isMaximizing ? 'bottom right' : 'center center',
          willChange: (isMinimizing || isMaximizing) ? 'transform, opacity' : 'auto'
      }}
    >
      {bsodTriggered && <SystemPanic onReset={() => {
          setBsodTriggered(false);
          setPhase('static');
          setLines([]);
      }} />}

      {matrixMode && (
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[1]" />
      )}

      <div className="absolute inset-0 pointer-events-none z-[110] opacity-10" style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2))",
          backgroundSize: "100% 4px"
      }}></div>

      <TopBar 
        onClose={handleClose} 
        onMinimize={onMinimize}
        isMaximized={isMaximized} 
        setIsMaximized={handleMaximizeToggle} 
        phase={phase} 
        path={currentPath} 
      />

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar mt-6 pb-4 relative z-10"
      >
        {/* Boot Sequence & Output */}
        {lines.map((line, i) => {
            if (line.type === 'boot') {
                return (
                    <div key={i} className={`flex items-center gap-2 text-xs sm:text-sm mb-1 font-mono ${matrixMode ? 'text-green-800' : 'text-slate-400'}`}>
                        <span className="min-w-[100px] text-right opacity-50 select-none shrink-0">[{line.timestamp}]</span>
                        <span>{line.content}</span>
                    </div>
                );
            } else if (line.type === 'system') {
                return (
                    <div key={i} className="mb-2 ml-1 font-mono">
                        {line.content}
                    </div>
                );
             } else if (line.type === 'input') {
                return (
                    <div key={i} className="mt-2">
                        <Prompt command={line.content as string} path={currentPath} matrixMode={matrixMode} />
                    </div>
                )
            } else {
                return (
                    <div key={i} className="mb-2 ml-2 pl-4 border-l-2 border-slate-800/50 font-mono text-sm sm:text-base hover:border-slate-700 transition-colors">
                        {line.content}
                    </div>
                )
            }
        })}

        {/* Login Prompt */}
        {phase === 'login' && (
            <div className="mt-12 flex flex-col items-center justify-center h-32">
                <div className="text-green-400 font-bold text-xl mb-4">SYSTEM READY</div>
                <div className="text-slate-400 mb-2 text-center">
                  PRESS <span className="bg-slate-700 text-white px-1 rounded text-xs">ENTER</span> TO INITIALIZE SHELL
                </div>
                <div className="text-slate-600 text-xs mb-6 text-center">
                  PRESS <span className="bg-slate-800 px-1 rounded">ESC</span> TO ABORT
                </div>
                {/* Mobile-friendly buttons */}
                <div className="flex flex-col sm:hidden gap-3 w-full max-w-xs px-4">
                  <button
                    onClick={handleLoginEnter}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors active:scale-95"
                  >
                    INITIALIZE SHELL
                  </button>
                  <button
                    onClick={handleLoginAbort}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors active:scale-95 text-sm"
                  >
                    ABORT
                  </button>
                </div>
                {/* Desktop hint - hidden on mobile */}
                <div className="hidden sm:block text-slate-600 text-xs mt-4">
                  (Use keyboard on desktop)
                </div>
            </div>
        )}

        {/* Active Shell Prompt OR Active Blocking Component */}
        {phase === 'shell' && (
          <div className="mt-2">
            {activeComponent ? (
                <div className="mb-2">{activeComponent}</div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0">
                    <Prompt path={currentPath} matrixMode={matrixMode} />
                </div>
                <div className="relative flex-1 ml-2">
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        setCursorPos(e.target.selectionStart || 0);
                    }}
                    onSelect={handleSelect}
                    onClick={handleSelect}
                    onKeyUp={handleSelect}
                    onKeyDown={handleKeyDown}
                    className={`w-full bg-transparent border-none outline-none ${matrixMode ? 'text-green-500' : 'text-slate-200'} caret-transparent font-mono text-sm sm:text-base`}
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    inputMode="text"
                />
                {/* Custom Block Cursor Overlay */}
                <div className={`absolute pointer-events-none left-0 top-0 h-full flex items-center whitespace-pre font-mono text-sm sm:text-base ${matrixMode ? 'text-green-500' : 'text-slate-200'}`}>
                     <span className="opacity-0">{input.substring(0, cursorPos)}</span>
                     <span className={`block w-[1ch] h-[1.2em] -mb-[0.15em] ${matrixMode ? 'bg-green-500' : 'bg-slate-400'} animate-pulse opacity-70`}></span>
                </div>
                </div>
                {/* Mobile submit button */}
                <button
                  onClick={handleSubmitCommand}
                  disabled={!input.trim()}
                  className="sm:hidden bg-primary hover:bg-indigo-600 disabled:bg-slate-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded transition-colors active:scale-95"
                  title="Submit command"
                >
                  →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;
