import React, { useState, Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useSearchParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import NotFound from './components/NotFound';

// Lazy load heavy components that are conditionally rendered
const Terminal = lazy(() => import('./components/Terminal').catch(() => ({ default: () => null })));

function HomePage() {
  const [showTerminal, setShowTerminal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Check for terminal query parameter
  useEffect(() => {
    if (searchParams.get('terminal') === 'open') {
      setShowTerminal(true);
      // Remove the query parameter from URL
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Prevent body scroll when terminal is open
  useEffect(() => {
    if (showTerminal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showTerminal]);

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;