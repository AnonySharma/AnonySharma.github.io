import { useState, useCallback, useRef } from 'react';
import { useAchievements } from '../../../contexts/AchievementContext';

export const useGravity = (strength: number = 20) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const { trackEvent, stats } = useAchievements();
  const lastTrackedTimeRef = useRef(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const deltaX = (mouseX - centerX) / (rect.width / 2);
    const deltaY = (mouseY - centerY) / (rect.height / 2);

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

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return {
    ref,
    style: {
      transform: `translate(${position.x}px, ${position.y}px)`,
      transition: 'transform 0.1s ease-out'
    },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave
  };
};

