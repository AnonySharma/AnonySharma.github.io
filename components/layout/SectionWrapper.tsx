import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useSpring, animated, config } from '@react-spring/web';

interface SectionWrapperProps {
  id?: string;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'dark' | 'gradient';
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ 
  id, 
  children, 
  className = '', 
  variant = 'default' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger when 10% of the section is visible
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, we can stop observing to keep it visible (no toggle off)
          // or keep observing to toggle. Usually for "simple", triggering once is better.
          // But if they scroll back up, maybe we want it to stay.
          // Let's stick to simple boolean state.
          if (sectionRef.current) observer.unobserve(sectionRef.current);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Simple, elegant entrance animation
  const spring = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { 
      opacity: isVisible ? 1 : 0, 
      transform: isVisible ? 'translateY(0px)' : 'translateY(30px)' 
    },
    config: config.molasses, // Slow, smooth, classy
    delay: 100,
  });

  const getBackgroundClass = () => {
    // We want the global background to show through, so we use transparency.
    switch (variant) {
      case 'dark':
        return 'bg-slate-950/80 backdrop-blur-sm'; // Darker but still transparent
      case 'gradient':
        return 'bg-gradient-to-b from-slate-900/50 to-slate-950/80 backdrop-blur-sm';
      default:
        // Default allows maximum visibility of the global background
        // while ensuring text is readable.
        return 'bg-transparent'; 
    }
  };

  return (
    <animated.section
      ref={sectionRef}
      id={id}
      style={spring}
      className={`relative min-h-screen flex flex-col justify-center py-24 ${getBackgroundClass()} ${className} overflow-hidden`}
    >
      <div className="container mx-auto px-4 relative z-10">
        {children}
      </div>
    </animated.section>
  );
};

export default SectionWrapper;
