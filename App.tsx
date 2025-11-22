import React, { useState, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';

// Lazy load heavy components that are conditionally rendered
const Terminal = lazy(() => import('./components/Terminal').catch(() => ({ default: () => null })));

function App() {
  const [showTerminal, setShowTerminal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      <Suspense fallback={null}>
        {showTerminal && <Terminal onClose={() => setShowTerminal(false)} />}
      </Suspense>
      
      <Navbar onOpenTerminal={() => setShowTerminal(true)} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </div>
  );
}

export default App;