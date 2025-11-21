import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import AiChat from './components/AiChat';
import Terminal from './components/Terminal';

function App() {
  const [showTerminal, setShowTerminal] = useState(false);

  return (
    <div className="min-h-screen bg-dark text-slate-200 font-sans">
      {showTerminal && <Terminal onClose={() => setShowTerminal(false)} />}
      
      <Navbar onOpenTerminal={() => setShowTerminal(true)} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      {!showTerminal && <AiChat />}
    </div>
  );
}

export default App;