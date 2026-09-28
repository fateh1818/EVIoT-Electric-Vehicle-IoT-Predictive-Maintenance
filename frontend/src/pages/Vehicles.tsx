import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingState } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { PageHeader } from '../components/common/PageHeader';
import type { Vehicle, VehicleStatus } from '../types/vehicle';
import { formatPercent, formatRUL, getProbabilityColor } from '../utils/format';

const PAGE_SIZE = 10;

export function Vehicles() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [search, setSearch]     = useState('');
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'all'>('all');
  const [page, setPage]         = useState(1);

  const load = async () => {
    setLoading(true); setError(null);
    try { setVehicles(await api.getVehicles()); }
    catch { setError('Failed to load vehicles.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = vehicles.filter(v => {
    const matchSearch = v.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <LoadingState message="Loading vehicles..." />;
  if (error)   return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-4">
      <PageHeader title="Vehicles" description="Monitor and inspect your electric vehicle fleet" />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search vehicle ID..."
            className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-text placeholder-text-secondary focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-text-secondary" />
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value as VehicleStatus | 'all'); setPage(1); }}
            className="bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:outline-none focus:border-primary/50"
          >
            <option value="all">All Status</option>
            <option value="healthy">Healthy</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr className="text-xs text-text-secondary">
                {['Vehicle ID', 'Status', 'Battery SOC', 'Battery SOH', 'Temperature', 'Failure Prob.', 'RUL', 'Last Update', ''].map((h, i) => (
                  <th key={i} className={`px-5 py-3 font-medium ${i > 1 ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paged.length === 0 ? (
                <tr><td colSpan={9}>
                  <EmptyState title="No vehicles found" description="Try changing your search or filter." />
                </td></tr>
              ) : paged.map(v => (
                <tr
                  key={v.id}
                  onClick={() => navigate(`/predict/single?vehicle=${v.id}`)}
                  className="hover:bg-border/30 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3.5 font-semibold text-sm text-text">{v.id}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={v.status} /></td>
                  <td className="px-5 py-3.5 text-right text-sm">{v.batterySOC}%</td>
                  <td className="px-5 py-3.5 text-right text-sm">{v.batterySOH}%</td>
                  <td className="px-5 py-3.5 text-right text-sm">{v.temperature}°C</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-sm font-mono font-medium" style={{ color: getProbabilityColor(v.failureProbability) }}>
                      {formatPercent(v.failureProbability)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right text-sm text-text-secondary">{formatRUL(v.rul)}</td>
                  <td className="px-5 py-3.5 text-right text-xs text-text-secondary">{v.lastUpdate}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-xs text-primary hover:text-primary-dark">Inspect →</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <span className="text-xs text-text-secondary">{filtered.length} vehicles</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="p-1.5 rounded-lg hover:bg-border disabled:opacity-40 transition-colors">
                <ChevronLeft size={14} className="text-text" />
              </button>
              <span className="text-xs text-text">{page} / {totalPages}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages} className="p-1.5 rounded-lg hover:bg-border disabled:opacity-40 transition-colors">
                <ChevronRight size={14} className="text-text" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
