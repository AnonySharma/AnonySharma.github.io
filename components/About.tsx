import React, { useEffect, useState } from 'react';
import { Terminal, Coffee, Code2, Cpu } from 'lucide-react';
import { useAchievements } from '../contexts/AchievementContext';
import { PROFILE_CONFIG } from '../config';

const About: React.FC = () => {
  const { stats } = useAchievements();
  const [showGlasses, setShowGlasses] = useState(false);

  useEffect(() => {
    if (stats.konami_unlocked) {
      setShowGlasses(true);
    }
  }, [stats.konami_unlocked]);

  return (
    <section id="about" className="py-20 bg-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Image Column */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary to-secondary rounded-full opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-slate-800 shadow-2xl">
                <img 
                  src={PROFILE_CONFIG.personal.avatarUrl} 
                  alt={PROFILE_CONFIG.personal.fullName} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Thug Life Glasses Overlay */}
                <div 
                    className={`absolute top-[35%] left-1/2 -translate-x-1/2 w-32 pointer-events-none transition-all duration-500 ${showGlasses ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-20'}`}
                >
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Deal_with_it_glasses.svg/1200px-Deal_with_it_glasses.svg.png" 
                        alt="Thug Life"
                        className="w-full drop-shadow-lg"
                    />
                </div>
              </div>
              
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-slate-900 p-3 rounded-xl border border-slate-700 shadow-xl flex items-center gap-2 animate-bounce">
                <Terminal className="text-green-400" size={20} />
                <span className="text-slate-200 font-mono text-xs">
                  System.out.println("Hello World");
                </span>
              </div>
            </div>
          </div>
          
          {/* Content Column */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              About Me
            </h2>
            
            <div className="space-y-6 text-slate-400 text-lg leading-relaxed whitespace-pre-line">
              {PROFILE_CONFIG.personal.bio.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 hover:border-primary/50 transition-colors group">
                <Cpu className="text-primary mb-2 group-hover:rotate-180 transition-transform duration-700" />
                <h3 className="text-white font-bold">Problem Solver</h3>
                <p className="text-sm text-slate-500">Data Structures & Algos</p>
              </div>
              <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 hover:border-secondary/50 transition-colors group">
                <Code2 className="text-secondary mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-bold">Full Stack</h3>
                <p className="text-sm text-slate-500">React, Node, Spring</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;