import { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { api } from '../services/api';
import { ChartCard } from '../components/common/ChartCard';
import { LoadingState } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';
import { PageHeader } from '../components/common/PageHeader';
import type { AnalyticsData } from '../types/analytics';

export function Analytics() {
  const [data, setData]     = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const load = async () => {
    setLoading(true); setError(null);
    try { setData(await api.getAnalytics()); }
    catch { setError('Failed to load analytics data.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState message="Loading analytics..." />;
  if (error || !data) return <ErrorState message={error ?? 'No data'} onRetry={load} />;

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Fleet-wide data analysis and trends" />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ChartCard title="Vehicle Health Trend" subtitle="Fleet health over time">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data.healthTrend}>
              <defs>
                <linearGradient id="gH" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1D3045" />
              <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#101D2E', border: '1px solid #1D3045', borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="healthy" stroke="#22C55E" fill="url(#gH)" strokeWidth={2} name="Healthy" />
              <Line type="monotone" dataKey="warning" stroke="#F59E0B" strokeWidth={2} dot={false} name="Warning" />
              <Line type="monotone" dataKey="critical" stroke="#EF4444" strokeWidth={2} dot={false} name="Critical" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Failure Probability Distribution" subtitle="Vehicle count by probability range">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.failureDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1D3045" />
              <XAxis dataKey="range" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#101D2E', border: '1px solid #1D3045', borderRadius: 8 }} />
              <Bar dataKey="count" fill="#22D3EE" radius={[4, 4, 0, 0]} name="Vehicles" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Average Battery Health (SOH)" subtitle="Fleet average state of health trend">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.batteryHealthTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1D3045" />
              <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis domain={[80, 95]} tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#101D2E', border: '1px solid #1D3045', borderRadius: 8 }} />
              <Line type="monotone" dataKey="avgSOH" stroke="#22C55E" strokeWidth={2} dot={{ fill: '#22C55E', r: 3 }} name="Avg SOH (%)" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Maintenance Distribution" subtitle="Cases by maintenance type">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.maintenanceDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1D3045" />
              <XAxis type="number" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis dataKey="type" type="category" tick={{ fill: '#94A3B8', fontSize: 11 }} width={80} />
              <Tooltip contentStyle={{ background: '#101D2E', border: '1px solid #1D3045', borderRadius: 8 }} />
              <Bar dataKey="count" fill="#0891B2" radius={[0, 4, 4, 0]} name="Vehicles" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Temperature trend */}
      <ChartCard title="Average Motor Temperature" subtitle="Fleet temperature trend">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data.temperatureTrend}>
            <defs>
              <linearGradient id="gT" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1D3045" />
            <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#101D2E', border: '1px solid #1D3045', borderRadius: 8 }} />
            <Area type="monotone" dataKey="avgTemp" stroke="#F59E0B" fill="url(#gT)" strokeWidth={2} name="Avg Temp (°C)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
