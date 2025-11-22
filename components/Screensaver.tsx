import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAchievements } from '../contexts/AchievementContext';

const DVDLogo: React.FC<{ color: string }> = ({ color }) => (
  <div className="relative" style={{ width: '120px', height: '60px' }}>
    {/* Base image */}
    <img 
      src="/assets/images/dvd-logo.png" 
      alt="DVD Logo" 
      width="120" 
      height="60" 
      style={{ 
        filter: `drop-shadow(0 0 4px ${color})` 
      }}
    />
    {/* Color overlay using mix-blend-mode */}
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundColor: color,
        mixBlendMode: 'multiply', // or 'screen' depending on the PNG being black/white or transparent
        opacity: 0.8
      }}
    />
  </div>
);

export const Screensaver: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [velocity, setVelocity] = useState({ x: 2, y: 2 });
  const [color, setColor] = useState('#4ade80'); // green-400
  const requestRef = useRef<number>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const { trackEvent } = useAchievements();

  const colors = ['#ef4444', '#3b82f6', '#eab308', '#a855f7', '#ec4899', '#14b8a6'];

  const startTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsActive(true);
      trackEvent('screensaver_active', true);
    }, 60000); // 60 seconds
  }, [trackEvent]);

  const handleActivity = useCallback(() => {
    if (isActive) {
      setIsActive(false);
    }
    startTimer();
  }, [isActive, startTimer]);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    
    // Add listeners
    events.forEach(e => window.addEventListener(e, handleActivity));
    
    // Listen for manual trigger
    const handleForce = () => {
        setIsActive(true);
        trackEvent('screensaver_active', true);
    };
    window.addEventListener('force_screensaver', handleForce);

    // Start initial timer
    startTimer();

    return () => {
      events.forEach(e => window.removeEventListener(e, handleActivity));
      window.removeEventListener('force_screensaver', handleForce);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [handleActivity, startTimer, trackEvent]);

  // Animation loop
  const animate = useCallback(() => {
    if (!isActive) return;

    setPosition(prev => {
      let nextX = prev.x + velocity.x;
      let nextY = prev.y + velocity.y;
      let nextVelX = velocity.x;
      let nextVelY = velocity.y;
      let nextColor = color;
      let bounced = false;

      const logoWidth = 120;
      const logoHeight = 60;
      const maxX = window.innerWidth - logoWidth;
      const maxY = window.innerHeight - logoHeight;

      if (nextX <= 0 || nextX >= maxX) {
        nextVelX = -nextVelX;
        bounced = true;
        // Clamp position to avoid getting stuck
        nextX = nextX <= 0 ? 0 : maxX;
      }
      if (nextY <= 0 || nextY >= maxY) {
        nextVelY = -nextVelY;
        bounced = true;
        // Clamp position
        nextY = nextY <= 0 ? 0 : maxY;
      }

      if (bounced) {
        // Check for corner hit (approximate, with small tolerance)
        // A corner hit is when BOTH X and Y bounce in the same frame
        if ((nextX <= 0 || nextX >= maxX) && (nextY <= 0 || nextY >= maxY)) {
            trackEvent('corner_hit', true);
        }

        // Ensure we pick a DIFFERENT color
        let newColor = colors[Math.floor(Math.random() * colors.length)];
        while (newColor === color && colors.length > 1) {
            newColor = colors[Math.floor(Math.random() * colors.length)];
        }
        nextColor = newColor;
        setColor(nextColor);
      }

      setVelocity({ x: nextVelX, y: nextVelY });
      return { x: nextX, y: nextY };
    });

    requestRef.current = requestAnimationFrame(animate);
  }, [isActive, velocity, color]);

  useEffect(() => {
    if (isActive) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isActive, animate]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black cursor-none overflow-hidden">
      <div 
        className="absolute select-none pointer-events-none will-change-transform"
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        <DVDLogo color={color} />
      </div>
      <div className="absolute bottom-10 w-full text-center text-slate-700 text-sm animate-pulse font-mono">
        Press any key to wake up
      </div>
    </div>
  );
};
