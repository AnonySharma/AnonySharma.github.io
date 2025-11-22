import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Home, RefreshCw, Terminal, Keyboard, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAchievements } from '../contexts/AchievementContext';

const excuses = [
  "It worked on my machine.",
  "I must have deleted that file by accident.",
  "A solar flare flipped a bit on the server.",
  "The div centered itself into another dimension.",
  "I haven't deployed this feature yet.",
  "It's not a bug, it's an undocumented feature.",
  "CSS is hard, okay?",
  "The API is ghosting me.",
  "Stack Overflow was down, so I couldn't build this page.",
  "I'm pretty sure this page exists in the multiverse.",
  "Premature optimization is the root of all missing pages.",
  "The page is in a different timezone.",
  "I was told to 'just make it work', so I didn't.",
  "The database ate my homework.",
  "It's a feature, not a bug (of the 404 page).",
  "The page is taking a coffee break.",
  "Blame it on the full moon.",
  "The page went to get milk and never came back."
];

const NotFound: React.FC = () => {
  const [excuse, setExcuse] = useState(() => excuses[Math.floor(Math.random() * excuses.length)]);
  const [glitchActive, setGlitchActive] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const excuseRef = useRef<HTMLDivElement>(null);
  const { unlockAchievement } = useAchievements();

  // Track 404 visit for achievement
  useEffect(() => {
    localStorage.setItem('visited_404', 'true');
  }, []);

  const handleNewExcuse = useCallback(() => {
    setExcuse((currentExcuse) => {
      let newExcuse = excuses[Math.floor(Math.random() * excuses.length)];
      while (newExcuse === currentExcuse && excuses.length > 1) {
        newExcuse = excuses[Math.floor(Math.random() * excuses.length)];
      }
      
      // Trigger animation
      if (excuseRef.current) {
        excuseRef.current.style.animation = 'none';
        setTimeout(() => {
          if (excuseRef.current) {
            excuseRef.current.style.animation = 'fadeIn 0.3s ease-in';
          }
        }, 10);
      }
      
      return newExcuse;
    });
  }, []);

  useEffect(() => {
    // Random glitch effect
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(glitchInterval);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    let konamiCode = '';
    const konamiSequence = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightKeyBKeyA';
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // R key for new excuse (only if no modifier keys - allow Cmd/Ctrl+R for refresh)
      if ((e.key === 'r' || e.key === 'R') && 
          !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey &&
          document.activeElement?.tagName !== 'INPUT' && 
          document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        handleNewExcuse();
      }
      
      // Konami code easter egg
      konamiCode += e.code;
      if (konamiCode.length > konamiSequence.length) {
        konamiCode = konamiCode.slice(-konamiSequence.length);
      }
      if (konamiCode === konamiSequence) {
        setShowEasterEgg(true);
        localStorage.setItem('konami_unlocked', 'true');
        localStorage.setItem('developer_mode', 'true');
        unlockAchievement('konami_master');
        unlockAchievement('developer_mode');
        setTimeout(() => setShowEasterEgg(false), 5000);
        konamiCode = '';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNewExcuse]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#050505] text-slate-300 font-mono flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-red-500/30">
      {/* Animated Background Grid */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.04]"
        style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px',
          animation: 'gridMove 20s linear infinite'
        }}
      ></div>

      {/* Glitch Overlay */}
      {glitchActive && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute inset-0 bg-red-500/10 animate-pulse" style={{ 
            clipPath: 'inset(0 0 0 0)',
            animation: 'glitch 0.15s infinite'
          }}></div>
        </div>
      )}

      {/* Easter Egg - Developer Mode */}
      {showEasterEgg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="text-center max-w-md mx-auto p-8 bg-slate-900 border-2 border-primary rounded-xl animate-in zoom-in-95 fade-in">
            <Sparkles size={64} className="text-yellow-400 mx-auto mb-4 animate-pulse" />
            <p className="text-3xl font-bold text-yellow-400 mb-2">🎮 KONAMI CODE ACTIVATED!</p>
            <p className="text-xl text-primary mb-4">Developer Mode Unlocked! 🍪</p>
            <div className="text-left text-slate-300 space-y-2 mt-6 font-mono text-sm">
              <div className="text-green-400">✓ Secret features enabled</div>
              <div className="text-green-400">✓ Achievement system activated</div>
              <div className="text-green-400">✓ All easter eggs unlocked</div>
              <div className="text-green-400">✓ Developer console access granted</div>
              <div className="text-green-400">✓ Hidden commands available</div>
              <div className="text-slate-500 mt-4">Type 'help' in terminal for new commands</div>
              <div className="text-slate-500">Try: 'devmode', 'eastereggs', 'sudo make-me-a-sandwich'</div>
            </div>
            <p className="text-slate-400 mt-6 text-sm">You found the secret! Here's a cookie: 🍪</p>
            <p className="text-xs text-slate-500 mt-2">Developer mode persists across sessions</p>
          </div>
        </div>
      )}

      {/* Floating Particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {useMemo(() => {
          const particles = [];
          for (let i = 0; i < 20; i++) {
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const duration = 5 + Math.random() * 10;
            const delay = Math.random() * 5;
            particles.push(
              <div
                key={i}
                className="absolute w-1 h-1 bg-primary/20 rounded-full"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  animation: `float ${duration}s ease-in-out infinite`,
                  animationDelay: `${delay}s`
                }}
              />
            );
          }
          return particles;
        }, [])}
      </div>

      <div className="z-10 text-center max-w-3xl w-full">
        {/* 404 Block with Enhanced Glitch Effect */}
        <div className="mb-6 sm:mb-8 relative inline-block group">
          <div className="relative">
            {/* Animated glow background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[200px] sm:w-[240px] md:w-[320px] h-[200px] sm:h-[240px] md:h-[320px] bg-gradient-to-r from-red-500/30 via-purple-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
            </div>
            
            {/* Shadow layers for depth and glow */}
            <span className="absolute inset-0 text-[100px] sm:text-[120px] md:text-[160px] font-black leading-none text-red-500/40 blur-3xl select-none tracking-tighter animate-pulse">
              404
            </span>
            <span className="absolute inset-0 text-[100px] sm:text-[120px] md:text-[160px] font-black leading-none text-blue-500/30 blur-2xl select-none tracking-tighter translate-x-2 -translate-y-1">
              404
            </span>
            <span className="absolute inset-0 text-[100px] sm:text-[120px] md:text-[160px] font-black leading-none text-purple-500/30 blur-xl select-none tracking-tighter -translate-x-1 translate-y-1">
              404
            </span>
            
            {/* Main 404 text with gradient */}
            <span className="relative text-[100px] sm:text-[120px] md:text-[160px] font-black leading-none select-none block tracking-tighter bg-gradient-to-br from-slate-800 via-slate-900 to-black bg-clip-text text-transparent group-hover:from-slate-700 group-hover:via-slate-800 group-hover:to-slate-900 transition-all duration-300">
              404
            </span>
            
            {/* SEGFAULT overlay with better styling */}
            <div 
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex items-center justify-center pointer-events-none transition-all duration-200 ${glitchActive ? 'opacity-100 scale-110' : 'opacity-0 scale-100'}`}
            >
              <span 
                className="text-xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-red-600 tracking-widest uppercase"
                style={{
                  textShadow: glitchActive 
                    ? '0 0 10px rgba(239, 68, 68, 0.8), 0 0 20px rgba(239, 68, 68, 0.6), 2px 0 0 #00ffff, -2px 0 0 #ff00ff' 
                    : 'none',
                  filter: glitchActive ? 'blur(0.5px)' : 'none',
                  transform: glitchActive ? 'translate(2px, -1px)' : 'translate(0, 0)'
                }}
              >
                SEGFAULT
              </span>
            </div>
            
            {/* Subtle border glow effect */}
            <div className={`absolute inset-0 rounded-lg border-2 ${glitchActive ? 'border-red-500/50' : 'border-transparent'} transition-all duration-200 blur-sm`}></div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl md:text-3xl text-white font-bold mb-3 sm:mb-4 animate-fadeIn">
          You've ventured into the void.
        </h2>
        
        {/* Subtitle */}
        <p className="text-slate-400 sm:text-slate-500 text-sm sm:text-lg mb-6 sm:mb-10 max-w-lg mx-auto leading-relaxed">
          The page you're looking for doesn't exist. <br className="hidden sm:block"/>
          But here's a generated excuse for your project manager:
        </p>

        {/* Enhanced Terminal Window */}
        <div className="bg-[#0a0a0a] rounded-xl border border-[#333] p-4 sm:p-6 shadow-2xl text-left font-mono text-xs sm:text-sm md:text-base mb-6 sm:mb-10 relative group mx-auto max-w-2xl backdrop-blur-sm bg-opacity-90 hover:border-[#444] transition-all duration-300">
          {/* Terminal Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#222]">
            <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
            </div>
            <div className="text-xs text-slate-600 group-hover:text-slate-500 transition-colors">
              terminal - zsh
            </div>
          </div>

          {/* Terminal Content */}
          <div className="space-y-3 sm:space-y-4">
            {/* Git blame command */}
            <div className="animate-fadeIn">
              <div>
                <span className="text-green-400">➜</span>{' '}
                <span className="text-cyan-400">~</span>{' '}
                <span className="text-yellow-200">git blame</span>{' '}
                <span className="text-slate-500">./this-page.tsx</span>
              </div>
              <div className="text-red-400 pl-4 mt-1">
                fatal: ambiguous argument 'this-page.tsx': unknown revision or path not in the working tree.
              </div>
            </div>
            
            {/* Cat command */}
            <div className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              <div>
                <span className="text-green-400">➜</span>{' '}
                <span className="text-cyan-400">~</span>{' '}
                <span className="text-yellow-200">cat</span>{' '}
                <span className="text-slate-500">/var/log/excuses.txt</span>
              </div>
              <div 
                ref={excuseRef}
                className="text-white pl-4 border-l-2 border-primary/30 ml-1 py-2 italic bg-slate-900/30 rounded-r mt-1"
                style={{ animation: 'fadeIn 0.3s ease-in' }}
              >
                "{excuse}"
              </div>
            </div>

            {/* Additional terminal commands */}
            <div className="animate-fadeIn opacity-60" style={{ animationDelay: '0.2s' }}>
              <div>
                <span className="text-green-400">➜</span>{' '}
                <span className="text-cyan-400">~</span>{' '}
                <span className="text-yellow-200">ls -la</span>{' '}
                <span className="text-slate-500">/pages/</span>
              </div>
              <div className="text-slate-500 pl-4 mt-1 text-xs">
                total 0<br/>
                drwxr-xr-x  2 root root  4096 Jan  1 00:00 .<br/>
                drwxr-xr-x  1 root root  4096 Jan  1 00:00 ..<br/>
                <span className="text-red-400">-rw-r--r--  1 root root     0 Jan  1 00:00 this-page.tsx (missing)</span>
              </div>
            </div>

            {/* Cursor */}
            <div className="flex items-center animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <span className="text-green-400">➜</span>{' '}
              <span className="text-cyan-400">~</span>{' '}
              <span className="w-2.5 h-5 bg-slate-400 ml-2 animate-pulse"></span>
            </div>
          </div>

          {/* Refresh Button */}
          <button 
            onClick={handleNewExcuse}
            className="absolute top-4 right-4 p-2 text-slate-600 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200 group/btn"
            title="Generate new excuse (or press R)"
            aria-label="Generate new excuse"
          >
            <RefreshCw size={16} className="group-hover/btn:rotate-180 transition-transform duration-500" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Link
            to="/"
            className="group relative px-6 sm:px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 duration-200"
          >
            <Home size={18} className="group-hover:-translate-y-0.5 transition-transform" />
            <span>Return to Safety</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-xl"></div>
          </Link>
          
          <Link
            to="/?terminal=open"
            className="group relative px-6 sm:px-8 py-3 rounded-full bg-slate-800 border border-slate-700 text-white font-bold hover:bg-slate-700 hover:border-slate-600 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Terminal size={18} className="group-hover:rotate-12 transition-transform" />
            <span>Open Terminal</span>
          </Link>
        </div>

        {/* Keyboard Shortcut Hint */}
        <div className="mt-6 sm:mt-8 text-xs text-slate-600 flex items-center justify-center gap-2">
          <Keyboard size={14} />
          <span>Press <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-400">R</kbd> for new excuse</span>
        </div>
      </div>


    </div>
  );
};

export default NotFound;