import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props { message?: string; onRetry?: () => void; }

export function ErrorState({ message = 'An error occurred.', onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center">
        <AlertTriangle size={28} className="text-danger" />
      </div>
      <div className="text-center">
        <p className="text-text font-medium mb-1">Something went wrong</p>
        <p className="text-text-secondary text-sm max-w-xs">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm text-text hover:border-primary/50 transition-colors"
        >
          <RefreshCw size={14} /> Try Again
        </button>
      )}
    </div>
  );
}
