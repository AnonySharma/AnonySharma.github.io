import React from 'react';
import { Code2, Cpu, Layout, Terminal } from 'lucide-react';
import { use3DCard } from '../hooks/use3DCard';
import SectionWrapper from '../layout/SectionWrapper';
import { animated } from '@react-spring/web';

const SkillCard: React.FC<{ 
  icon: React.ReactNode, 
  title: string, 
  skills: string[], 
  iconColorClass: string,
  hoverBgClass: string
}> = ({ icon, title, skills, iconColorClass, hoverBgClass }) => {
  const card3D = use3DCard({ intensity: 12, enableGlow: true });

  return (
    <div 
      ref={card3D.ref}
      style={card3D.style}
      onMouseMove={card3D.onMouseMove}
      onMouseLeave={card3D.onMouseLeave}
      onMouseEnter={card3D.onMouseEnter}
      className={`relative bg-slate-800/80 p-8 rounded-2xl border border-slate-700/50 backdrop-blur-sm transition-all group overflow-hidden`}
    >
      {/* Glow effect */}
      <animated.div 
        className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
        style={card3D.glowStyle as any}
      />
      
      <div className={`relative z-10 w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-6 group-hover:${hoverBgClass} transition-colors`}>
        <span className={iconColorClass}>{icon}</span>
      </div>
      <h3 className="relative z-10 text-xl font-bold text-white mb-4">{title}</h3>
      <div className="relative z-10 flex flex-wrap gap-2">
        {skills.map(skill => (
          <span key={skill} className="px-3 py-1 bg-slate-900/80 text-slate-300 text-sm rounded-full border border-slate-700/50 backdrop-blur-sm">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

const Skills: React.FC = () => {
  return (
    <SectionWrapper id="skills" variant="dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Technical Skills</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            From competitive programming to enterprise application development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Languages & Core */}
          <SkillCard 
            icon={<Code2 />}
            title="Languages"
            skills={['C++', 'JavaScript', 'HTML']}
            iconColorClass="text-primary"
            hoverBgClass="bg-primary/20"
          />

          {/* Frameworks & Tools */}
          <SkillCard 
            icon={<Layout />}
            title="Full Stack & Cloud"
            skills={['Spring Boot', 'Flutter', 'React', 'AWS', 'Material UI']}
            iconColorClass="text-cyan-500"
            hoverBgClass="bg-cyan-500/20"
          />

          {/* Concepts */}
          <SkillCard 
            icon={<Terminal />}
            title="Core Concepts"
            skills={['Data Structures', 'Algorithms', 'Problem Solving', 'Loan Underwriting']}
            iconColorClass="text-secondary"
            hoverBgClass="bg-secondary/20"
          />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Skills;