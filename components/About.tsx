import React from 'react';
import { ABOUT_TEXT, EXPERIENCE } from '../constants';
import { Briefcase, GraduationCap, Award } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Bio Section */}
        <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">About Me</h2>
            <div className="prose prose-invert prose-lg mx-auto text-slate-300 leading-loose max-w-4xl">
                <p>{ABOUT_TEXT}</p>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center gap-8">
                <div className="flex items-center gap-3 px-6 py-3 bg-slate-900/50 rounded-full border border-slate-800">
                    <Award className="text-primary" />
                    <span className="text-white font-semibold">Rank 61 - ICPC Regionals</span>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-slate-900/50 rounded-full border border-slate-800">
                    <GraduationCap className="text-secondary" />
                    <span className="text-white font-semibold">IIT (BHU) Varanasi '23</span>
                </div>
            </div>
        </div>

        {/* Experience Timeline */}
        <div id="experience">
            <h3 className="text-2xl font-bold text-white mb-12 flex items-center gap-2">
                <Briefcase className="text-primary" />
                Work Experience
            </h3>
            
            <div className="relative border-l-2 border-slate-800 ml-3 space-y-12">
                {EXPERIENCE.map((exp) => (
                    <div key={exp.id} className="relative pl-8 md:pl-12">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-900 border-4 border-primary"></div>
                        
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                            <h4 className="text-xl font-bold text-white">{exp.role}</h4>
                            <span className="text-sm text-primary font-mono">{exp.period}</span>
                        </div>
                        
                        <div className="text-lg text-slate-200 font-medium mb-1">{exp.company}</div>
                        <div className="text-sm text-slate-500 mb-4 flex items-center gap-1">
                           {exp.location}
                        </div>
                        
                        <ul className="list-disc list-outside ml-4 text-slate-400 space-y-2">
                            {exp.description.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </section>
  );
};

export default About;