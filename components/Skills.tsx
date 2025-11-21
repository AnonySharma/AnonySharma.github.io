import React from 'react';
import { SKILLS } from '../constants';
import { Code2, Cpu, Layout, Terminal } from 'lucide-react';

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
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-primary/50 transition-all group">
            <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <Code2 className="text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Languages</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-slate-900 text-slate-300 text-sm rounded-full border border-slate-700">C++</span>
              <span className="px-3 py-1 bg-slate-900 text-slate-300 text-sm rounded-full border border-slate-700">JavaScript</span>
              <span className="px-3 py-1 bg-slate-900 text-slate-300 text-sm rounded-full border border-slate-700">HTML</span>
            </div>
          </div>

          {/* Frameworks & Tools */}
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-cyan-500/50 transition-all group">
            <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors">
              <Layout className="text-cyan-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Full Stack & Cloud</h3>
            <div className="flex flex-wrap gap-2">
               <span className="px-3 py-1 bg-slate-900 text-slate-300 text-sm rounded-full border border-slate-700">Spring Boot</span>
               <span className="px-3 py-1 bg-slate-900 text-slate-300 text-sm rounded-full border border-slate-700">Flutter</span>
               <span className="px-3 py-1 bg-slate-900 text-slate-300 text-sm rounded-full border border-slate-700">React</span>
               <span className="px-3 py-1 bg-slate-900 text-slate-300 text-sm rounded-full border border-slate-700">AWS</span>
               <span className="px-3 py-1 bg-slate-900 text-slate-300 text-sm rounded-full border border-slate-700">Material UI</span>
            </div>
          </div>

          {/* Concepts */}
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-secondary/50 transition-all group">
            <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
              <Terminal className="text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Core Concepts</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-slate-900 text-slate-300 text-sm rounded-full border border-slate-700">Data Structures</span>
              <span className="px-3 py-1 bg-slate-900 text-slate-300 text-sm rounded-full border border-slate-700">Algorithms</span>
              <span className="px-3 py-1 bg-slate-900 text-slate-300 text-sm rounded-full border border-slate-700">Problem Solving</span>
              <span className="px-3 py-1 bg-slate-900 text-slate-300 text-sm rounded-full border border-slate-700">Loan Underwriting</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;