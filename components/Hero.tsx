import React, { useState } from 'react';
import { ArrowRight, Github, Linkedin, Mail, Download, FileText } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

const Hero: React.FC = () => {
  const [downloadCount, setDownloadCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const handleResumeDownload = () => {
    const count = downloadCount + 1;
    setDownloadCount(count);
    
    // Track for achievement
    const current = parseInt(localStorage.getItem('resume_downloads') || '0');
    localStorage.setItem('resume_downloads', (current + 1).toString());
    
    if (count >= 3) {
      setShowEasterEgg(true);
      setTimeout(() => setShowEasterEgg(false), 5000);
    }
    
    // Create a fake resume download
    const link = document.createElement('a');
    link.href = '#';
    link.download = count >= 3 
      ? 'Resume_Final_Final_v2_ACTUAL_FINAL_REALLY_FINAL.pdf' 
      : 'Ankit_Kumar_Resume.pdf';
    link.click();
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 z-10 flex flex-col items-center text-center">
        <div className="inline-block mb-4 px-4 py-1 rounded-full bg-slate-800 border border-slate-700 text-sm text-slate-300">
           ICPC'21 Regionalist | Rank 61
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Ankit Kumar<br />
          <span className="text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">MTS @ Salesforce</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10">
          IIT (BHU) CSE '23 Graduate. I build scalable systems and intuitive interfaces, 
          combining competitive programming logic with creative design.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a href="#projects" className="flex items-center justify-center px-8 py-3 rounded-full bg-white text-slate-950 font-bold hover:bg-slate-200 transition-all transform hover:scale-105">
            View Projects
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
          <button
            onClick={handleResumeDownload}
            className="flex items-center justify-center px-8 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold hover:from-indigo-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg shadow-primary/50"
            title={downloadCount >= 3 ? "You really want my resume, don't you? 😄" : "Download Resume"}
          >
            <Download className="mr-2 h-5 w-5" />
            Download Resume
          </button>
          <a href="#contact" className="flex items-center justify-center px-8 py-3 rounded-full border border-slate-600 bg-slate-900/50 text-white hover:bg-slate-800 backdrop-blur-sm transition-all">
            Contact Me
          </a>
        </div>

        {showEasterEgg && (
          <div className="mt-4 p-4 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-lg animate-pulse">
            <p className="text-primary font-bold text-sm">
              🎉 You really want my resume, don't you? Here's a special version with memes! (Just kidding, it's the same resume)
            </p>
          </div>
        )}

        <div className="mt-12 flex gap-6 text-slate-400">
            <a href="https://github.com/AnonySharma" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="GitHub Profile">
                <Github size={24} />
            </a>
            <a href={CONTACT_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors" aria-label="LinkedIn Profile">
                <Linkedin size={24} />
            </a>
            <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-secondary transition-colors" aria-label="Send Email">
                <Mail size={24} />
            </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;