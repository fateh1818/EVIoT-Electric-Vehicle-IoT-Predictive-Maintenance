import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Car, CheckCircle, AlertTriangle, XCircle, Eye } from 'lucide-react';
import { api } from '../services/api';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingState } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';
import { ChartCard } from '../components/common/ChartCard';
import { SkeletonCard } from '../components/common/SkeletonCard';
import type { PredictionResult } from '../types/prediction';
import { formatPercent, formatRUL } from '../utils/format';
import { MOCK_ANALYTICS } from '../services/mockData';

const PIE_COLORS = ['#22C55E', '#F59E0B', '#EF4444'];

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats]     = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch {
      setError('Unable to connect to the server. Please check that the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const analytics = MOCK_ANALYTICS;
  const pieData = [
    { name: 'Healthy', value: analytics.fleetHealth.healthy },
    { name: 'Warning', value: analytics.fleetHealth.warning },
    { name: 'Critical', value: analytics.fleetHealth.critical },
  ];

  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading ? (
          Array.from({length: 4}).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard title="Total Vehicles"       value={stats.totalVehicles.toLocaleString()}     subtitle="In fleet"              icon={<Car size={20} />}           color="primary"  trend="+4.2% this month" trendUp />
            <StatCard title="Healthy Vehicles"     value={stats.healthyVehicles.toLocaleString()}   subtitle={formatPercent(stats.healthyVehicles / stats.totalVehicles)}    icon={<CheckCircle size={20} />}   color="success"  />
            <StatCard title="Maintenance Required" value={stats.maintenanceRequired.toLocaleString()} subtitle={formatPercent(stats.maintenanceRequired / stats.totalVehicles)} icon={<AlertTriangle size={20} />} color="warning"  />
            <StatCard title="Critical Vehicles"   value={stats.criticalVehicles.toLocaleString()}  subtitle={formatPercent(stats.criticalVehicles / stats.totalVehicles)}  icon={<XCircle size={20} />}       color="danger"   />
          </>
        )}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartCard title="Vehicle Health Trend" subtitle="Last 30 days" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={analytics.healthTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1D3045" />
              <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#101D2E', border: '1px solid #1D3045', borderRadius: 8 }} labelStyle={{ color: '#F8FAFC' }} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
              <Line type="monotone" dataKey="healthy" stroke="#22C55E" strokeWidth={2} dot={false} name="Healthy" />
              <Line type="monotone" dataKey="warning" stroke="#F59E0B" strokeWidth={2} dot={false} name="Warning" />
              <Line type="monotone" dataKey="critical" stroke="#EF4444" strokeWidth={2} dot={false} name="Critical" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fleet Health" subtitle="Current distribution">
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#101D2E', border: '1px solid #1D3045', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 text-xs">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-text-secondary">{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ChartCard title="Failure Probability Distribution" subtitle="Vehicles by probability range">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analytics.failureDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1D3045" />
              <XAxis dataKey="range" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#101D2E', border: '1px solid #1D3045', borderRadius: 8 }} labelStyle={{ color: '#F8FAFC' }} />
              <Bar dataKey="count" fill="#22D3EE" radius={[4, 4, 0, 0]} name="Vehicles" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Recent Predictions Table */}
        {stats && (
          <ChartCard title="Recent Predictions" subtitle="Latest analysis results">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-text-secondary border-b border-border">
                    <th className="text-left pb-2 font-medium">Vehicle</th>
                    <th className="text-left pb-2 font-medium">Status</th>
                    <th className="text-right pb-2 font-medium">Prob.</th>
                    <th className="text-right pb-2 font-medium">RUL</th>
                    <th className="text-right pb-2 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {stats.recentPredictions.map((p: PredictionResult) => (
                    <tr key={p.vehicleId} className="hover:bg-border/30 transition-colors">
                      <td className="py-2 font-medium text-text">{p.vehicleId}</td>
                      <td className="py-2"><StatusBadge status={p.prediction} /></td>
                      <td className="py-2 text-right font-mono">{p.failureProbability !== undefined ? formatPercent(p.failureProbability) : '—'}</td>
                      <td className="py-2 text-right text-text-secondary">{p.rul !== undefined ? formatRUL(p.rul) : '—'}</td>
                      <td className="py-2 text-right">
                        <button
                          onClick={() => navigate(`/predict/single?vehicle=${p.vehicleId}`)}
                          className="flex items-center gap-1 ml-auto text-primary hover:text-primary-dark transition-colors"
                        >
                          <Eye size={12} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        )}
      </div>
    </div>
  );
}
