import React, { useState, Suspense, lazy, useEffect, useRef, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, useSearchParams } from 'react-router-dom';
import { AchievementProvider, useAchievements } from './contexts/AchievementContext';
import { ErrorProvider, ErrorNotifications, useErrors } from './contexts/ErrorContext';
import ErrorBoundary from './components/ErrorBoundary';
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
  const { checkAchievements, trackEvent } = useAchievements();
  const { addError } = useErrors();
  const scrollBottomCountRef = useRef(0);
  const lastScrollBottomTimeRef = useRef(0);
  const totalScrollDistanceRef = useRef(0);
  const lastScrollYRef = useRef(0);

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

  // Track section visits for Explorer achievement
  useEffect(() => {
    const sections = [
      { id: 'about', selector: '#about' },
      { id: 'skills', selector: '#skills' },
      { id: 'projects', selector: '#projects' },
      { id: 'code-snippets', selector: '#code-snippets' },
      { id: 'testimonials', selector: '#testimonials' },
      { id: 'contact', selector: '#contact' }
    ];

    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sectionId) {
            trackEvent(`section_${sectionId}_visited`, true);
          }
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      const element = document.querySelector(section.selector);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach(section => {
        const element = document.querySelector(section.selector);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [checkAchievements]);

  // Track scroll for easter eggs and achievements
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollYRef.current);
      totalScrollDistanceRef.current += scrollDelta;
      lastScrollYRef.current = currentScrollY;

      // Save total scroll distance
      trackEvent('total_scroll_distance', scrollDelta);

      // Check if scrolled to bottom
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const isAtBottom = scrollTop + windowHeight >= documentHeight - 10; // 10px threshold

      if (isAtBottom) {
        const now = Date.now();
        const timeSinceLastBottom = now - lastScrollBottomTimeRef.current;

        // If scrolled to bottom within 2 seconds of last time, increment count
        if (timeSinceLastBottom < 2000) {
          scrollBottomCountRef.current += 1;
        } else {
          scrollBottomCountRef.current = 1;
        }

        lastScrollBottomTimeRef.current = now;

        // If scrolled to bottom 3 times quickly, unlock achievement
        if (scrollBottomCountRef.current >= 3) {
          trackEvent('scroll_master', true);
        }
      }

      // Check achievements periodically
      // checkAchievements(); // Handled by context effect now
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [checkAchievements]);


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
      <ErrorNotifications />
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

// Error Boundary Wrapper Component
const HomePageWithErrorBoundary: React.FC = () => {
  const { addError } = useErrors();

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        addError(
          'React Component Error',
          `${error.toString()}\n\nComponent Stack:\n${errorInfo.componentStack}`,
          'error'
        );
      }}
    >
      <HomePage />
    </ErrorBoundary>
  );
};

// Global error handler setup component
const GlobalErrorHandlers: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { addError } = useErrors();

  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason;
      const message = error?.message || 'Unhandled promise rejection';
      const details = error?.stack || String(error);
      addError('Promise Rejection', details, 'error');
    };

    // Handle JavaScript errors
    const handleError = (event: ErrorEvent) => {
      // Only catch errors that aren't from extensions or external scripts
      const isInternalError = !event.filename || 
        event.filename.includes(window.location.origin) ||
        event.filename === '' ||
        event.filename.startsWith('blob:') ||
        event.filename.startsWith('data:');
      
      if (isInternalError || event.error) {
        const message = event.message || 'JavaScript error occurred';
        const details = event.filename 
          ? `${event.filename}:${event.lineno}:${event.colno}\n${event.error?.stack || ''}`
          : event.error?.stack || String(event.error || message);
        addError('Runtime Error', details, 'error');
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    // Expose a global function for testing errors from console
    (window as any).testError = (message: string = 'Test error', type: 'error' | 'warning' | 'info' = 'error', details?: string) => {
      addError(message, details, type);
    };

    // Expose function to trigger promise rejection
    (window as any).testPromiseRejection = () => {
      Promise.reject(new Error('Test promise rejection'));
    };

    // Expose function to trigger runtime error
    (window as any).testRuntimeError = () => {
      throw new Error('Test runtime error');
    };

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
      delete (window as any).testError;
      delete (window as any).testPromiseRejection;
      delete (window as any).testRuntimeError;
    };
  }, [addError]);

  return <>{children}</>;
};

function App() {
  return (
    <AchievementProvider>
      <ErrorProvider>
        <GlobalErrorHandlers>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePageWithErrorBoundary />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </GlobalErrorHandlers>
      </ErrorProvider>
    </AchievementProvider>
  );
}

export default App;