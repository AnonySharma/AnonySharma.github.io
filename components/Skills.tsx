import React from 'react';
import { SKILLS } from '../constants';
import { Code2, Cpu, Layout, Terminal } from 'lucide-react';
import { useGravity } from './terminal/hooks/useGravity';

const SkillCard: React.FC<{ 
  icon: React.ReactNode, 
  title: string, 
  skills: string[], 
  colorClass: string,
  iconColorClass: string,
  hoverBgClass: string
}> = ({ icon, title, skills, colorClass, iconColorClass, hoverBgClass }) => {
  const gravity = useGravity(10);

  return (
    <div 
      ref={gravity.ref}
      style={gravity.style}
      onMouseMove={gravity.onMouseMove}
      onMouseLeave={gravity.onMouseLeave}
      className={`bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:${colorClass} transition-all group`}
    >
      <div className={`w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-6 group-hover:${hoverBgClass} transition-colors`}>
        <span className={iconColorClass}>{icon}</span>
      </div>
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map(skill => (
          <span key={skill} className="px-3 py-1 bg-slate-900 text-slate-300 text-sm rounded-full border border-slate-700">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-20 bg-slate-900/50">
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
            colorClass="border-primary/50"
            iconColorClass="text-primary"
            hoverBgClass="bg-primary/20"
          />

          {/* Frameworks & Tools */}
          <SkillCard 
            icon={<Layout />}
            title="Full Stack & Cloud"
            skills={['Spring Boot', 'Flutter', 'React', 'AWS', 'Material UI']}
            colorClass="border-cyan-500/50"
            iconColorClass="text-cyan-500"
            hoverBgClass="bg-cyan-500/20"
          />

          {/* Concepts */}
          <SkillCard 
            icon={<Terminal />}
            title="Core Concepts"
            skills={['Data Structures', 'Algorithms', 'Problem Solving', 'Loan Underwriting']}
            colorClass="border-secondary/50"
            iconColorClass="text-secondary"
            hoverBgClass="bg-secondary/20"
          />
        </div>
      </div>
    </section>
  );
};

export default Skills;