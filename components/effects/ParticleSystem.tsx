import React, { useRef, useEffect } from 'react';

interface Point {
  x: number;
  y: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

const ParticleSystem: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  // Initialize as null to indicate no interaction yet
  const mouseRef = useRef<Point | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      let clientX: number, clientY: number;
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }
      mouseRef.current = { x: clientX, y: clientY };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleMouseMove, { passive: false });
    window.addEventListener('touchstart', handleMouseMove, { passive: false });

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      const particleCount = 100;
      particlesRef.current = Array.from({ length: particleCount }, () => createParticle(canvas.width, canvas.height));
    };

    const createParticle = (w: number, h: number, x?: number, y?: number): Particle => ({
      x: x ?? Math.random() * w,
      y: y ?? Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? 'rgba(99, 102, 241, 1)' : 'rgba(236, 72, 153, 1)', // Start fully opaque
      life: Math.random() * 100 + 100,
      maxLife: 200,
    });

    initParticles();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current.forEach((p, i) => {
        // Aging
        p.life--;
        
        // Respawn if dead or out of bounds
        if (p.life <= 0 || p.x < -50 || p.x > canvas.width + 50 || p.y < -50 || p.y > canvas.height + 50) {
          particlesRef.current[i] = createParticle(canvas.width, canvas.height);
          return;
        }

        // Global cursor attraction (all particles try to touch cursor)
        if (mouseRef.current) {
          const rect = canvas.getBoundingClientRect();
          const relMouseX = mouseRef.current.x - rect.left;
          const relMouseY = mouseRef.current.y - rect.top;

          const dx = relMouseX - p.x;
          const dy = relMouseY - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Stronger attraction when closer, weaker when far
          const force = Math.max(0, (1000 - distance) / 1000); 
          const attractionStrength = 0.15 * force; 
          
          p.vx += (dx / (distance || 1)) * attractionStrength;
          p.vy += (dy / (distance || 1)) * attractionStrength;
        } else {
          // Wander randomly if no interaction
          // Small random force to keep them alive and moving naturally
          p.vx += (Math.random() - 0.5) * 0.02;
          p.vy += (Math.random() - 0.5) * 0.02;
        }

        // Damping / Friction (slightly less friction to allow speed build up)
        p.vx *= 0.96;
        p.vy *= 0.96;

        // Movement
        p.x += p.vx;
        p.y += p.vy;

        // Draw particle
        const opacity = Math.min(1, p.life / 50); // Fade out near end of life
        ctx.beginPath();
        // Fatten up: Increased size range
        ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('1)', `${opacity})`);
        ctx.fill();

        // Connections
        particlesRef.current.slice(i + 1).forEach(other => {
          const dx2 = other.x - p.x;
          const dy2 = other.y - p.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist2 < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            // Opacity based on distance and particle life
            const connectionOpacity = (1 - dist2 / 150) * opacity * 0.5;
            ctx.strokeStyle = `rgba(148, 163, 184, ${connectionOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchstart', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
};

export default ParticleSystem;

