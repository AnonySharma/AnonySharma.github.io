import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Stars } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import { MathUtils } from 'three';

const StarField = (props: any) => {
  const ref = useRef<any>(null);
  const [sphere] = useState(() => {
    // Generate 5000 points (x, y, z) = 15000 values
    const positions = random.inSphere(new Float32Array(5000 * 3), { radius: 1.5 });
    
    // Validate and sanitize positions to prevent NaN values
    for (let i = 0; i < positions.length; i++) {
      if (isNaN(positions[i]) || !isFinite(positions[i])) {
        positions[i] = 0;
      }
    }
    
    return positions;
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#f272c8"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const ScrollCamera = () => {
  const { camera } = useThree();
  const scrollRef = useRef(0);
  
  useFrame((state, delta) => {
    // Smooth dampening for scroll
    const targetScroll = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);
    scrollRef.current = MathUtils.damp(scrollRef.current, targetScroll, 2, delta);
    
    // Smoother camera movement
    camera.rotation.z = scrollRef.current * 0.2;
    camera.position.y = -scrollRef.current * 1.5;
  });
  return null;
};

const GlobalBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-slate-950">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ScrollCamera />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
        <StarField />
        <ambientLight intensity={0.5} />
      </Canvas>
      {/* Overlay gradient for readability - made much lighter to show stars */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/20 pointer-events-none" />
    </div>
  );
};

// We need to install maath for the random sphere generation
// npm install maath

export default GlobalBackground;

