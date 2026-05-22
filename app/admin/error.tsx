'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function AdminErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to monitoring service
    console.error('Admin panel error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
      <div className="bg-surface-secondary rounded-xl border border-border p-8 text-center max-w-md w-full">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Что-то пошло не так
        </h2>
        <p className="text-sm text-text-secondary mb-2">
          Произошла ошибка в панели администратора
        </p>
        {process.env.NODE_ENV === 'development' && (
          <pre className="text-xs text-text-muted bg-background-primary rounded-lg p-3 mb-4 overflow-auto max-h-32">
            {error.message}
          </pre>
        )}
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gold rounded-lg text-sm font-medium hover:bg-gold-light transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Попробовать снова
        </button>
      </div>
    </div>
  );
}
