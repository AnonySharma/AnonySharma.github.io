import React, { useState, Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useSearchParams } from 'react-router-dom';
import { AchievementProvider } from './contexts/AchievementContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import CodeSnippets from './components/CodeSnippets';
import Testimonials from './components/Testimonials';
import Achievements from './components/Achievements';

// Lazy load heavy components that are conditionally rendered
const Terminal = lazy(() => import('./components/Terminal').catch(() => ({ default: () => null })));

function HomePage() {
  const [showTerminal, setShowTerminal] = useState(false);
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Check for terminal query parameter
  useEffect(() => {
    if (searchParams.get('terminal') === 'open') {
      setShowTerminal(true);
      // Remove the query parameter from URL
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Prevent body scroll when terminal is open (but not minimized)
  useEffect(() => {
    if (showTerminal && !isTerminalMinimized) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showTerminal, isTerminalMinimized]);

  const handleMinimize = () => {
    setIsTerminalMinimized(true);
  };

  const handleRestore = () => {
    setIsTerminalMinimized(false);
  };

  const handleOpenTerminal = () => {
    if (showTerminal && isTerminalMinimized) {
      // If terminal is minimized, restore it
      setIsTerminalMinimized(false);
    } else if (!showTerminal) {
      // If terminal is closed, open it
      setShowTerminal(true);
      setIsTerminalMinimized(false);
    }
    // If terminal is already open and not minimized, do nothing (or focus it)
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      <Suspense fallback={null}>
        {showTerminal && (
          <Terminal 
            onClose={() => {
              setShowTerminal(false);
              setIsTerminalMinimized(false);
            }} 
            onMinimize={isTerminalMinimized ? handleRestore : handleMinimize}
            isMinimized={isTerminalMinimized}
          />
        )}
      </Suspense>
      
      <Navbar onOpenTerminal={handleOpenTerminal} />
      <Achievements />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <CodeSnippets />
        <Testimonials />
        <Contact />
      </main>
    </div>
  );
}

function App() {
  return (
    <AchievementProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AchievementProvider>
  );
}

export default App;