import type { ReactNode } from 'react';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: string;
  trendUp?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

export function StatCard({ title, value, subtitle, icon, trend, trendUp, color = 'primary' }: Props) {
  const colorMap = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    danger:  'text-danger',
  };
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">{title}</span>
        {icon && <div className={`${colorMap[color]} opacity-70`}>{icon}</div>}
      </div>
      <div>
        <div className={`text-3xl font-bold ${colorMap[color]}`}>{value}</div>
        {subtitle && <div className="text-sm text-text-secondary mt-0.5">{subtitle}</div>}
      </div>
      {trend && (
        <div className={`text-xs font-medium ${trendUp !== false ? 'text-success' : 'text-danger'}`}>
          {trendUp !== false ? '▲' : '▼'} {trend}
        </div>
      )}
    </div>
  );
}
