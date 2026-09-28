import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Car, Zap, BarChart2, Brain, Settings, ChevronLeft, ChevronRight,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard',         path: '/dashboard',       icon: LayoutDashboard },
  { label: 'Vehicles',          path: '/vehicles',         icon: Car             },
  { label: 'Single Prediction', path: '/predict/single',  icon: Zap             },
  { label: 'Batch Prediction',  path: '/predict/batch',   icon: BarChart2       },
  { label: 'Analytics',         path: '/analytics',        icon: BarChart2       },
  { label: 'Model',             path: '/model',            icon: Brain           },
  { label: 'Settings',          path: '/settings',         icon: Settings        },
];

interface Props { collapsed: boolean; onToggle: () => void; mobileOpen: boolean; onMobileClose: () => void; }

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: Props) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-30 lg:hidden" onClick={onMobileClose} />
      )}

      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-40 flex flex-col
          bg-bg-secondary border-r border-border
          transition-all duration-300 ease-in-out
          ${ collapsed ? 'w-16' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 h-16 border-b border-border shrink-0 ${ collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
            <Zap size={16} className="text-primary" />
          </div>
          {!collapsed && (
            <div>
              <div className="text-sm font-bold text-text">EVIoT</div>
              <div className="text-[10px] text-text-secondary leading-tight">Predictive Maintenance</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-all duration-150
                 ${ isActive
                   ? 'bg-primary/15 text-primary border border-primary/20'
                   : 'text-text-secondary hover:text-text hover:bg-card'
                 }`
              }
            >
              <item.icon size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-border">
          {!collapsed && (
            <div className="flex items-center gap-2 text-xs text-success mb-3">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              System Online
            </div>
          )}
          <button
            onClick={onToggle}
            className="hidden lg:flex items-center justify-center w-full py-2 rounded-lg text-text-secondary hover:text-text hover:bg-card transition-colors"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </aside>
    </>
  );
}
