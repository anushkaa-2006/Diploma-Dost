import React from 'react';
import { supabase } from '../lib/supabase';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    // Best-effort: log to Supabase error_logs table.
    // Requires: CREATE TABLE error_logs (id uuid default gen_random_uuid() primary key,
    //   message text, stack text, url text, timestamp timestamptz);
    supabase.from('error_logs').insert([{
      message: error.message,
      stack: error.stack?.slice(0, 500),
      url: window.location.href,
      timestamp: new Date().toISOString(),
    }]).then(() => {}).catch(() => {});
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--text)] p-6 text-center">
          <h1 className="text-4xl font-ui font-extrabold mb-4">Something went wrong.</h1>
          <p className="text-[var(--text-muted)] mb-8 max-w-md">
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary text-sm px-6 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;