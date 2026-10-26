import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 p-6 text-center select-none">
          <div className="max-w-md p-8 rounded-3xl bg-zinc-900/90 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col items-center">
            <div className="text-3xl mb-3">✨</div>
            <h2 className="text-xl font-bold mb-2 text-white">Something unexpected happened</h2>
            <p className="text-sm text-zinc-400 mb-6">
              Don't worry, your progress is saved! Let's get you right back to the celebration.
            </p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false });
                if (this.props.onReset) {
                  this.props.onReset();
                } else {
                  window.location.assign('/');
                }
              }}
              className="px-6 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-rose-500 to-amber-500 text-white cursor-pointer hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Birthday Experience</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
