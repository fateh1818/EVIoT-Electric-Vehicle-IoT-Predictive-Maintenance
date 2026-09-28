export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-card border border-border rounded-xl p-5 animate-pulse ${className}`}>
      <div className="h-3 w-24 bg-border rounded mb-4" />
      <div className="h-8 w-32 bg-border rounded mb-2" />
      <div className="h-3 w-20 bg-border rounded" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="animate-pulse flex gap-4 items-center px-5 py-4 border-b border-border">
      <div className="h-3 w-16 bg-border rounded" />
      <div className="h-5 w-16 bg-border rounded-full" />
      <div className="h-3 w-12 bg-border rounded ml-auto" />
    </div>
  );
}
