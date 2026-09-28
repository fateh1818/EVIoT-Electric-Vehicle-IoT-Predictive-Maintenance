import type { ReactNode } from 'react';

interface Props { title: string; subtitle?: string; children: ReactNode; className?: string; }

export function ChartCard({ title, subtitle, children, className = '' }: Props) {
  return (
    <div className={`bg-card border border-border rounded-xl p-5 ${className}`}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-text">{title}</h3>
        {subtitle && <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
