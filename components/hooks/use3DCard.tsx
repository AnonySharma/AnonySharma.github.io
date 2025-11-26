import { useRef, useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

interface Use3DCardOptions {
  intensity?: number;
  perspective?: number;
  enableGlow?: boolean;
}

export const use3DCard = (options: Use3DCardOptions = {}) => {
  const { intensity = 15, perspective = 1000, enableGlow = true } = options;
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const newMouseX = e.clientX - centerX;
    const newMouseY = e.clientY - centerY;

    setMouseX(newMouseX);
    setMouseY(newMouseY);

    const rotateXValue = -(newMouseY / rect.height) * intensity;
    const rotateYValue = (newMouseX / rect.width) * intensity;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setMouseX(0);
    setMouseY(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const spring = useSpring({
    rotateX,
    rotateY,
    scale: isHovered ? 1.02 : 1,
    config: { tension: 300, friction: 20 },
  });

  const glowSpring = useSpring({
    opacity: isHovered && enableGlow ? 0.6 : 0,
    x: mouseX * 0.1,
    y: mouseY * 0.1,
    config: { tension: 200, friction: 30 },
  });

  return {
    ref: cardRef,
    style: {
      transform: `perspective(${perspective}px) rotateX(${spring.rotateX}deg) rotateY(${spring.rotateY}deg) scale(${spring.scale})`,
      transformStyle: 'preserve-3d' as const,
    },
    glowStyle: {
      opacity: glowSpring.opacity,
      transform: `translate(${glowSpring.x}px, ${glowSpring.y}px)`,
    },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onMouseEnter: handleMouseEnter,
    isHovered,
  };
};

