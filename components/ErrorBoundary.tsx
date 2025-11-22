import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-slate-900 border border-red-700 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={32} className="text-red-400" />
              <h1 className="text-2xl font-bold text-red-400">Something went wrong</h1>
            </div>
            
            <p className="text-slate-300 mb-4">
              An unexpected error occurred. This has been logged and will be fixed soon.
            </p>

            {this.state.error && (
              <div className="bg-slate-800 rounded-lg p-4 mb-4">
                <div className="text-red-400 font-semibold mb-2">Error:</div>
                <div className="text-slate-300 font-mono text-sm break-words">
                  {this.state.error.toString()}
                </div>
              </div>
            )}

            {this.state.errorInfo && process.env.NODE_ENV === 'development' && (
              <details className="bg-slate-800 rounded-lg p-4 mb-4">
                <summary className="text-slate-400 cursor-pointer mb-2">Stack Trace (Dev Only)</summary>
                <pre className="text-xs text-slate-500 overflow-auto max-h-64">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-primary hover:bg-indigo-600 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

