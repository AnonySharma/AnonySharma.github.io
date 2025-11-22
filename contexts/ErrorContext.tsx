import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AlertCircle, X, AlertTriangle, Info } from 'lucide-react';
import { useAchievements } from './AchievementContext';

export interface ErrorInfo {
  id: string;
  message: string;
  details?: string;
  timestamp: number;
  type?: 'error' | 'warning' | 'info';
}

interface ErrorContextType {
  errors: ErrorInfo[];
  addError: (message: string, details?: string, type?: 'error' | 'warning' | 'info') => void;
  removeError: (id: string) => void;
  clearAll: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [errors, setErrors] = useState<ErrorInfo[]>([]);
  const { trackEvent } = useAchievements();

  const addError = useCallback((message: string, details?: string, type: 'error' | 'warning' | 'info' = 'error') => {
    const id = `error-${Date.now()}-${Math.random()}`;
    const newError: ErrorInfo = {
      id,
      message,
      details,
      timestamp: Date.now(),
      type
    };

    setErrors(prev => [...prev, newError]);

    // Unlock achievement when an error is caught
    if (type === 'error') {
      trackEvent('error_caught', true);
    }

    // Auto-remove after 8 seconds for errors, 5 seconds for warnings, 3 seconds for info
    const timeout = type === 'error' ? 8000 : type === 'warning' ? 5000 : 3000;
    setTimeout(() => {
      setErrors(prev => prev.filter(e => e.id !== id));
    }, timeout);
  }, [trackEvent]);

  const removeError = useCallback((id: string) => {
    setErrors(prev => prev.filter(e => e.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setErrors([]);
  }, []);

  return (
    <ErrorContext.Provider value={{ errors, addError, removeError, clearAll }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrors = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrors must be used within ErrorProvider');
  }
  return context;
};

// Error Notification Component
const ErrorNotificationItem: React.FC<{ error: ErrorInfo; onRemove: (id: string) => void }> = ({ error, onRemove }) => {
  const [showDetails, setShowDetails] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const toggleButtonRef = React.useRef<HTMLButtonElement>(null);
  const removeButtonRef = React.useRef<HTMLButtonElement>(null);


  // Use native DOM event listeners for buttons to bypass React synthetic events
  React.useEffect(() => {
    const toggleButton = toggleButtonRef.current;
    const removeButton = removeButtonRef.current;
    const container = containerRef.current;

    if (!container) return;

    // Stop events from reaching terminal
    const stopBubbling = (e: Event) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
    };

    // Handle toggle button with native listener
    const handleToggle = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      setShowDetails(prev => !prev);
    };

    // Handle remove button with native listener
    const handleRemove = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      onRemove(error.id);
    };

    if (toggleButton) {
      toggleButton.addEventListener('click', handleToggle, true); // Capture phase
      toggleButton.addEventListener('mousedown', stopBubbling, true);
    }

    if (removeButton) {
      removeButton.addEventListener('click', handleRemove, true); // Capture phase
      removeButton.addEventListener('mousedown', stopBubbling, true);
    }

    // Stop container events from bubbling
    const events = ['click', 'mousedown', 'mouseup'];
    events.forEach(eventType => {
      container.addEventListener(eventType, stopBubbling, false);
    });

    return () => {
      if (toggleButton) {
        toggleButton.removeEventListener('click', handleToggle, true);
        toggleButton.removeEventListener('mousedown', stopBubbling, true);
      }
      if (removeButton) {
        removeButton.removeEventListener('click', handleRemove, true);
        removeButton.removeEventListener('mousedown', stopBubbling, true);
      }
      events.forEach(eventType => {
        container.removeEventListener(eventType, stopBubbling, false);
      });
    };
  }, [showDetails, error.id, onRemove]);

  const borderColor = error.type === 'error' ? '#ef4444' : error.type === 'warning' ? '#f59e0b' : '#3b82f6';
  const glowColor = error.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : error.type === 'warning' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)';

  return (
    <div
      ref={containerRef}
      className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-lg p-4 animate-in flex items-start gap-3 relative overflow-hidden group"
      style={{ 
        zIndex: 99999,
        pointerEvents: 'auto',
        userSelect: 'text',
        WebkitUserSelect: 'text',
        MozUserSelect: 'text',
        msUserSelect: 'text',
        borderLeft: `4px solid ${borderColor}`,
        minWidth: '320px',
        maxWidth: '420px',
        boxShadow: `0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 0 20px ${glowColor}`
      }}
    >
      {/* Scanline effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5 z-0"
        style={{
          backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.5) 50%)',
          backgroundSize: '100% 4px'
        }}
      />

      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5 relative z-10">
        {error.type === 'error' && (
          <div 
            className="w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20"
            style={{ backgroundColor: borderColor }}
          >
            <span className="text-white text-xs font-bold leading-none font-mono">!</span>
          </div>
        )}
        {error.type === 'warning' && (
          <div className="relative w-5 h-5">
            <AlertTriangle 
              size={20} 
              className="text-yellow-500"
              fill="rgba(245, 158, 11, 0.2)"
            />
          </div>
        )}
        {error.type === 'info' && (
          <div 
            className="w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20"
            style={{ backgroundColor: borderColor }}
          >
            <span className="text-white text-xs font-bold leading-none font-mono">i</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0 relative z-10">
        <div className="text-slate-200 text-sm font-bold font-mono mb-1 tracking-wide flex items-center gap-2">
          {error.type === 'error' ? 'ERROR' : error.type === 'warning' ? 'WARNING' : 'INFO'}
          <span className="text-[10px] font-normal text-slate-500 opacity-50">
            [{new Date(error.timestamp).toLocaleTimeString('en-GB', { hour12: false })}]
          </span>
        </div>
        
        <div className="text-slate-300 text-sm font-mono leading-snug mb-2 opacity-90">
          {error.message}
        </div>
        
        {error.details && (
          <div className="mb-2">
            <button
              ref={toggleButtonRef}
              type="button"
              className="text-primary hover:text-green-400 text-xs font-mono underline cursor-pointer flex items-center gap-1 relative z-10 transition-colors"
              style={{ pointerEvents: 'auto' }}
              aria-expanded={showDetails}
              aria-label={showDetails ? 'Hide details' : 'Show details'}
            >
              <span className="text-[9px]">{showDetails ? '▼' : '▶'}</span>
              <span>trace_stack.log</span>
            </button>
            {showDetails && (
              <div 
                className="text-green-400/80 text-xs font-mono break-words whitespace-pre-wrap mt-2 p-3 rounded bg-black/50 border border-slate-800 max-h-64 overflow-y-auto custom-scrollbar shadow-inner"
                style={{ userSelect: 'text' }}
              >
                {error.details}
              </div>
            )}
          </div>
        )}
      </div>
      
      <button
        ref={removeButtonRef}
        type="button"
        className="text-slate-500 hover:text-white transition-colors flex-shrink-0 p-1 relative z-10 rounded hover:bg-white/5"
        style={{ pointerEvents: 'auto' }}
        aria-label="Dismiss error"
      >
        <X size={16} />
      </button>
    </div>
  );
};

// Error Notification Component
export const ErrorNotifications: React.FC = () => {
  const { errors, removeError } = useErrors();

  if (errors.length === 0) return null;

  return (
    <div 
      className="fixed bottom-6 right-6 flex flex-col gap-3 max-w-md pointer-events-none"
      style={{ 
        zIndex: 99999,
        position: 'fixed'
      }}
    >
      {errors.map((error) => (
        <ErrorNotificationItem key={error.id} error={error} onRemove={removeError} />
      ))}
    </div>
  );
};

