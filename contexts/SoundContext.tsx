import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';

interface SoundContextType {
  playHover: () => void;
  playClick: () => void;
  playType: () => void;
  playSuccess: () => void;
  playError: () => void;
  playBoot: () => void;
  mute: boolean;
  toggleMute: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mute, setMute] = useState(() => localStorage.getItem('sound_muted') === 'true');
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Initialize AudioContext on user interaction (browser policy)
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, []);

  const toggleMute = useCallback(() => {
    setMute(prev => {
      const next = !prev;
      localStorage.setItem('sound_muted', String(next));
      return next;
    });
  }, []);

  // Synth Functions
  const playTone = useCallback((freq: number, type: OscillatorType, duration: number, vol: number = 0.1) => {
    if (mute) return;
    initAudio();
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, [mute, initAudio]);

  const playNoise = useCallback((duration: number, vol: number = 0.1) => {
    if (mute) return;
    initAudio();
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    noise.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  }, [mute, initAudio]);

  // SFX Presets
  const playHover = useCallback(() => {
    // High pitch blip
    playTone(800, 'sine', 0.05, 0.02);
  }, [playTone]);

  const playClick = useCallback(() => {
    // Mechanical click feel
    playTone(300, 'square', 0.05, 0.05);
    playTone(400, 'sine', 0.02, 0.05);
  }, [playTone]);

  const playType = useCallback(() => {
    // Soft key click
    playTone(600 + Math.random() * 200, 'sine', 0.03, 0.03);
  }, [playTone]);

  const playSuccess = useCallback(() => {
    // Rising arpeggio
    const now = audioContextRef.current?.currentTime || 0;
    if (!mute && audioContextRef.current) {
        const ctx = audioContextRef.current;
        const gain = ctx.createGain();
        gain.connect(ctx.destination);
        
        [440, 554, 659, 880].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq;
            osc.connect(gain);
            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.2);
            
            const noteGain = ctx.createGain();
            noteGain.gain.setValueAtTime(0.1, now + i * 0.1);
            noteGain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.2);
            osc.disconnect();
            osc.connect(noteGain);
            noteGain.connect(ctx.destination);
        });
    }
  }, [mute]);

  const playError = useCallback(() => {
    // Low buzzer
    playTone(150, 'sawtooth', 0.3, 0.1);
    setTimeout(() => playTone(100, 'sawtooth', 0.3, 0.1), 150);
  }, [playTone]);

  const playBoot = useCallback(() => {
    // Power up sound
    if (mute) return;
    initAudio();
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(110, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
    
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1);
  }, [mute, initAudio]);

  return (
    <SoundContext.Provider value={{ playHover, playClick, playType, playSuccess, playError, playBoot, mute, toggleMute }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within SoundProvider');
  }
  return context;
};

