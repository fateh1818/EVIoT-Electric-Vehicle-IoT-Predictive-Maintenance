import { useLocation } from 'react-router-dom';
import { Bell, Menu, User, Wifi } from 'lucide-react';

const routeMeta: Record<string, { title: string; desc: string }> = {
  '/dashboard':     { title: 'Dashboard',           desc: 'Fleet health and predictive maintenance overview' },
  '/vehicles':      { title: 'Vehicles',             desc: 'Monitor and inspect your electric vehicle fleet' },
  '/predict/single':{ title: 'Single Prediction',    desc: 'Analyze one vehicle using the predictive maintenance model' },
  '/predict/batch': { title: 'Batch Prediction',     desc: 'Analyze multiple vehicles from a CSV file' },
  '/analytics':     { title: 'Analytics',            desc: 'Fleet-wide data analysis and trends' },
  '/model':         { title: 'Predictive Model',     desc: 'Machine learning model performance and configuration' },
  '/settings':      { title: 'Settings',             desc: 'Application preferences and API configuration' },
};

interface Props { onMenuClick: () => void; }

export function Header({ onMenuClick }: Props) {
  const { pathname } = useLocation();
  const meta = routeMeta[pathname] ?? { title: 'EVIoT', desc: '' };

  return (
    <header className="h-16 bg-bg-secondary border-b border-border flex items-center justify-between px-4 lg:px-6 shrink-0">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden text-text-secondary hover:text-text">
          <Menu size={20} />
        </button>
        <div>
          <h2 className="text-sm font-semibold text-text leading-tight">{meta.title}</h2>
          <p className="text-xs text-text-secondary leading-tight hidden sm:block">{meta.desc}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-success">
          <Wifi size={13} />
          <span>Online</span>
        </div>
        <button className="relative w-8 h-8 flex items-center justify-center text-text-secondary hover:text-text rounded-lg hover:bg-card transition-colors">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-danger rounded-full" />
        </button>
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-card transition-colors cursor-pointer">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <User size={12} className="text-primary" />
          </div>
          <span className="text-xs font-medium text-text hidden sm:block">Admin</span>
        </div>
      </div>
    </header>
  );
}
