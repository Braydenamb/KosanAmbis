import React from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    // Clear localStorage to fix any state corruption
    try {
      window.localStorage.clear();
      window.location.reload();
    } catch (e) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6 font-sans relative">
          {/* Neon Glow backdrop */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full filter blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-500/10 rounded-full filter blur-[80px] pointer-events-none"></div>

          <div className="max-w-md w-full bg-slate-850/80 border border-slate-700/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl relative z-10 flex flex-col items-center text-center gap-6">
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 animate-pulse">
              <ShieldAlert className="w-10 h-10" />
            </div>

            <div>
              <h1 className="text-lg font-black tracking-tight text-white uppercase font-mono">INTELLIGENCE CRASH DETECTED</h1>
              <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed">
                KosanAmbis Core mengalami kegagalan sistem akibat data state lokal yang tidak kompatibel.
              </p>
            </div>

            <div className="w-full bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-left font-mono text-[10px] text-rose-400 overflow-x-auto max-h-40">
              <strong className="text-rose-500 block mb-1">Error:</strong>
              {this.state.error && this.state.error.toString()}
              {this.state.errorInfo && (
                <pre className="mt-2 text-slate-400 leading-normal white-space-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>

            <button 
              onClick={this.handleReset}
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider font-mono active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-rose-950/20"
            >
              <RefreshCw className="w-4 h-4" />
              Reset & Clear LocalStorage
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
