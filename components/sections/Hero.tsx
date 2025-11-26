import React, { useState, useRef } from 'react';
import { ArrowRight, Github, Linkedin, Mail, Download } from 'lucide-react';
import { useSpring, animated, useTrail } from '@react-spring/web';
import { CONTACT_INFO } from '../../constants';
import { useAchievements } from '../../contexts/AchievementContext';
import { PROFILE_CONFIG, getTitleWithCompany } from '../../config';
import ParticleSystem from '../effects/ParticleSystem';

const Hero: React.FC = () => {
  const [downloadCount, setDownloadCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [nameClickCount, setNameClickCount] = useState(0);
  const { trackEvent } = useAchievements();
  const sectionRef = useRef<HTMLElement>(null);

  // Mouse tracking for parallax handled by useSpring directly below

  const handleNameClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newCount = nameClickCount + 1;
    setNameClickCount(newCount);

    if (newCount === 3) {
      document.body.classList.add('do-barrel-roll');
      trackEvent('barrel_roll', true);
      setTimeout(() => {
        document.body.classList.remove('do-barrel-roll');
        setNameClickCount(0);
      }, 1000);
    }

    // Reset count if not clicked within 1 second
    setTimeout(() => {
      setNameClickCount(prev => {
        if (prev === newCount) return 0;
        return prev;
      });
    }, 1000);
  };

  const handleResumeDownload = () => {
    const count = downloadCount + 1;
    setDownloadCount(count);
    
    // Track for achievement
    trackEvent('resume_downloads');
    
    if (count >= 3) {
      setShowEasterEgg(true);
      setTimeout(() => setShowEasterEgg(false), 5000);
    }
    
    // Create a fake resume download
    const link = document.createElement('a');
    link.href = '#';
    link.download = count >= 3 
      ? (PROFILE_CONFIG.resume.easterEggFileName || PROFILE_CONFIG.resume.fileName)
      : PROFILE_CONFIG.resume.fileName;
    link.click();
  };

  // Animated entrance
  const titleSpring = useSpring({
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0 },
    delay: 200,
  });

  const subtitleSpring = useSpring({
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    delay: 400,
  });

  const buttons = ['View Projects', 'Download Resume', 'Contact Me'];
  const buttonTrail = useTrail(buttons.length, {
    from: { opacity: 0, x: -20 },
    to: { opacity: 1, x: 0 },
    delay: 600,
  });

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-slate-950"
    >
      {/* Interactive Particle System */}
      <ParticleSystem />

      {/* Content */}
      <div className="container mx-auto px-4 z-10 flex flex-col items-center text-center relative">
        {PROFILE_CONFIG.badges && PROFILE_CONFIG.badges.length > 0 && (
          <animated.div
            className="inline-block mb-4 px-4 py-1 rounded-full bg-slate-800/80 border border-slate-700/50 text-sm text-slate-300 backdrop-blur-sm"
            style={{
              opacity: titleSpring.opacity,
              transform: titleSpring.y.to(y => `translateY(${y}px)`),
            }}
          >
            {PROFILE_CONFIG.badges[0]}
          </animated.div>
        )}
        
        <animated.h1 
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight select-none cursor-pointer touch-manipulation"
          onClick={handleNameClick}
          onTouchEnd={handleNameClick}
          style={{
            opacity: titleSpring.opacity,
            transform: titleSpring.y.to(y => `translateY(${y}px)`),
          }}
        >
          {PROFILE_CONFIG.personal.fullName}<br />
          <span className="text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
            {getTitleWithCompany()}
          </span>
        </animated.h1>

        <animated.p 
          className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10"
          style={{
            opacity: subtitleSpring.opacity,
            transform: subtitleSpring.y.to(y => `translateY(${y}px)`),
          }}
        >
          {PROFILE_CONFIG.personal.tagline}
        </animated.p>

        <div className="flex flex-col sm:flex-row gap-4">
          {buttonTrail.map((style, index) => {
            if (index === 0) {
              return (
                <animated.a
                  key={index}
                  href="#projects"
                  className="flex items-center justify-center px-8 py-3 rounded-full bg-white text-slate-950 font-bold hover:bg-slate-200 transition-all transform hover:scale-105 shadow-lg"
                  style={style}
                >
                  View Projects
                  <ArrowRight className="ml-2 h-5 w-5" />
                </animated.a>
              );
            } else if (index === 1) {
              return (
                <animated.button
                  key={index}
                  onClick={handleResumeDownload}
                  className="flex items-center justify-center px-8 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold hover:from-indigo-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg shadow-primary/50"
                  title={downloadCount >= 3 ? "You really want my resume, don't you? 😄" : "Download Resume"}
                  style={style}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Resume
                </animated.button>
              );
            } else {
              return (
                <animated.a
                  key={index}
                  href="#contact"
                  className="flex items-center justify-center px-8 py-3 rounded-full border border-slate-600 bg-slate-900/50 text-white hover:bg-slate-800 backdrop-blur-sm transition-all"
                  style={style}
                >
                  Contact Me
                </animated.a>
              );
            }
          })}
        </div>

        {showEasterEgg && (
          <animated.div
            className="mt-4 p-4 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-lg"
            style={{
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            <p className="text-primary font-bold text-sm">
              🎉 You really want my resume, don't you? Here's a special version with memes! (Just kidding, it's the same resume)
            </p>
          </animated.div>
        )}

        <animated.div
          className="mt-12 flex gap-6 text-slate-400"
          style={{
            opacity: subtitleSpring.opacity,
            transform: subtitleSpring.y.to(y => `translateY(${y}px)`),
          }}
        >
          <a 
            href={PROFILE_CONFIG.social.github.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-white transition-all transform hover:scale-110" 
            aria-label="GitHub Profile"
            onClick={() => trackEvent('social_github_clicked', true)}
          >
            <Github size={24} />
          </a>
          <a 
            href={CONTACT_INFO.linkedin} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-blue-400 transition-all transform hover:scale-110" 
            aria-label="LinkedIn Profile"
            onClick={() => trackEvent('social_linkedin_clicked', true)}
          >
            <Linkedin size={24} />
          </a>
          <a 
            href={`mailto:${CONTACT_INFO.email}`} 
            className="hover:text-secondary transition-all transform hover:scale-110" 
            aria-label="Send Email"
            onClick={() => trackEvent('social_email_clicked', true)}
          >
            <Mail size={24} />
          </a>
        </animated.div>
      </div>
    </section>
  );
};

export default Hero;
