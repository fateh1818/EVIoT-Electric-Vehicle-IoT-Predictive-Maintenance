export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }[size];
  return (
    <div className={`${s} border-2 border-border border-t-primary rounded-full animate-spin`} />
  );
}

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <LoadingSpinner size="lg" />
      <p className="text-text-secondary text-sm">{message}</p>
    </div>
  );
}
