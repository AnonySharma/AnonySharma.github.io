import { useState, useCallback, useRef } from 'react';
import { useAchievements } from '../../../contexts/AchievementContext';

export const useGravity = (strength: number = 20) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const { trackEvent, stats } = useAchievements();
  const lastTrackedTimeRef = useRef(0);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (clientX - centerX) / (rect.width / 2);
    const deltaY = (clientY - centerY) / (rect.height / 2);

    setPosition({
      x: deltaX * strength,
      y: deltaY * strength
    });

    // Track gravity interaction (throttle to once per second per element)
    const now = Date.now();
    if (now - lastTrackedTimeRef.current > 1000) {
      lastTrackedTimeRef.current = now;
      const currentCount = stats.gravity_interactions || 0;
      trackEvent('gravity_interactions', currentCount + 1);
    }
  }, [strength, trackEvent, stats]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    handleMove(e.clientX, e.clientY);
  }, [handleMove]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLElement>) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, [handleMove]);

  const handleLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return {
    ref,
    style: {
      transform: `translate(${position.x}px, ${position.y}px)`,
      transition: 'transform 0.1s ease-out'
    },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleLeave,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleLeave
  };
};

