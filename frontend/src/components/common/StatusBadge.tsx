import { getStatusBgColor, formatStatusLabel } from '../../utils/format';

interface Props { status: string; size?: 'sm' | 'md'; }

export function StatusBadge({ status, size = 'sm' }: Props) {
  const classes = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${classes} ${getStatusBgColor(status)}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {formatStatusLabel(status)}
    </span>
  );
}
