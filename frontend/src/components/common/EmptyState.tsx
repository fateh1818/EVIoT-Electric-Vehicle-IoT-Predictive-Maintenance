import type { ReactNode } from 'react';

interface Props { icon?: ReactNode; title: string; description?: string; action?: ReactNode; }

export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      {icon && <div className="w-16 h-16 rounded-full bg-border flex items-center justify-center text-text-secondary">{icon}</div>}
      <div className="text-center">
        <p className="text-text font-medium mb-1">{title}</p>
        {description && <p className="text-text-secondary text-sm max-w-xs">{description}</p>}
      </div>
      {action}
    </div>
  );
}
