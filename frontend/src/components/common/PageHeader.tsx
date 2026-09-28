import type { ReactNode } from 'react';

interface Props { title: string; description?: string; actions?: ReactNode; }

export function PageHeader({ title, description, actions }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-text">{title}</h1>
        {description && <p className="text-text-secondary text-sm mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
