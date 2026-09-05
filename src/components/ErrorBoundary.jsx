import React, { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Production Error Boundary Component
 * Catches JavaScript errors anywhere in child component tree
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b1329] text-white flex items-center justify-center p-6" role="alert" aria-live="assertive">
          <div className="max-w-md w-full bg-[#121d3a] border border-red-500/40 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto text-red-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white font-outfit">Something went wrong</h2>
            <p className="text-sm text-slate-300">
              An unexpected error occurred in the application. Don't worry, your data is safe.
            </p>
            {this.state.error && (
              <div className="p-3 bg-[#0a1024] border border-[#2a3c6b] rounded-lg text-xs font-mono text-red-300 text-left overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl flex items-center justify-center space-x-2 transition focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label="Reload Application"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
