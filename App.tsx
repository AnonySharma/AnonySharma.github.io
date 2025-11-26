import React, { useState, Suspense, lazy, useEffect, useRef, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, useSearchParams } from 'react-router-dom';
import { AchievementProvider, useAchievements } from './contexts/AchievementContext';
import { ErrorProvider, ErrorNotifications, useErrors } from './contexts/ErrorContext';
import { SoundProvider } from './contexts/SoundContext';
import ErrorBoundary from './components/layout/ErrorBoundary';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Contact from './components/sections/Contact';
import NotFound from './components/ui/NotFound';
import Achievements from './components/ui/Achievements';

// Lazy load heavy components
const Terminal = lazy(() => import('./components/terminal/Terminal').catch(() => ({ default: () => null })));
const GlobalBackground = lazy(() => import('./components/effects/3D/GlobalBackground'));
const Screensaver = lazy(() => import('./components/effects/Screensaver').then(m => ({ default: m.Screensaver })));
const CodeSnippets = lazy(() => import('./components/sections/CodeSnippets'));
const Testimonials = lazy(() => import('./components/sections/Testimonials'));

function HomePage() {
  const [showTerminal, setShowTerminal] = useState(false);
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { trackEvent } = useAchievements();
  const scrollBottomCountRef = useRef(0);
  const lastScrollBottomTimeRef = useRef(0);
  const totalScrollDistanceRef = useRef(0);
  const lastScrollYRef = useRef(0);

  // Listen for force_screensaver event (from terminal)
  useEffect(() => {
    const handleForceScreensaver = () => {
       // The screensaver component will handle its own activation state based on user inactivity
       // But we can also force it if needed. For now, we'll rely on the component's internal logic
       // If we wanted to force it, we'd need to expose a control or use a context.
       // Since the requirement was just to have the command print "Initializing...", we're good.
       // But actually, let's make it fun.
       // We can't easily force the internal state of Screensaver from here without context/ref.
       // Given the complexity, the terminal command is just "flavor" for now unless we move state up.
    };
    window.addEventListener('force_screensaver', handleForceScreensaver);
    return () => window.removeEventListener('force_screensaver', handleForceScreensaver);
  }, []);

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

    // More lenient observer options - trigger when section is 20% visible
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sectionId) {
            trackEvent(`section_${sectionId}_visited`, true);
            // Unobserve after tracking to avoid re-tracking
            observer.unobserve(entry.target);
          }
        }
      });
    }, observerOptions);

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      sections.forEach(section => {
        const element = document.querySelector(section.selector);
        if (element) {
          // Check if already visible on load
          const rect = element.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
          if (isVisible && rect.height > 0) {
            // Section is already visible, track it immediately
            trackEvent(`section_${section.id}_visited`, true);
          } else {
            // Observe for when it becomes visible
            observer.observe(element);
          }
        }
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      sections.forEach(section => {
        const element = document.querySelector(section.selector);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [trackEvent]);

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
  }, [trackEvent]);


  return (
    <div className="min-h-screen text-slate-200 font-sans relative">
      <Suspense fallback={null}>
        <GlobalBackground />
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
        <Screensaver />
      </Suspense>
      
      <Navbar onOpenTerminal={handleOpenTerminal} />
      <Achievements />
      <ErrorNotifications />
      <main className="perspective-[2000px] transform-style-3d">
        <Hero />
        <Skills />
        <Projects />
        <Suspense fallback={<div className="min-h-screen" />}>
          <CodeSnippets />
        </Suspense>
        <Suspense fallback={<div className="min-h-screen" />}>
          <Testimonials />
        </Suspense>
        <About />
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
    <SoundProvider>
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
    </SoundProvider>
  );
}

export default App;