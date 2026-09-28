export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatRUL(hours: number): string {
  if (hours > 1000) return '> 1000 h';
  return `${hours} h`;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'healthy':              return 'text-success';
    case 'warning':
    case 'maintenance_required': return 'text-warning';
    case 'critical':             return 'text-danger';
    default:                     return 'text-text-secondary';
  }
}

export function getStatusBgColor(status: string): string {
  switch (status) {
    case 'healthy':              return 'bg-success/10 text-success border-success/20';
    case 'warning':
    case 'maintenance_required': return 'bg-warning/10 text-warning border-warning/20';
    case 'critical':             return 'bg-danger/10 text-danger border-danger/20';
    default:                     return 'bg-border text-text-secondary';
  }
}

export function getProbabilityColor(p: number): string {
  if (p < 0.4)  return '#22C55E';
  if (p < 0.7)  return '#F59E0B';
  return '#EF4444';
}

export function formatStatusLabel(status: string): string {
  switch (status) {
    case 'healthy':              return 'Healthy';
    case 'maintenance_required': return 'Warning';
    case 'warning':              return 'Warning';
    case 'critical':             return 'Critical';
    default:                     return status;
  }
}
