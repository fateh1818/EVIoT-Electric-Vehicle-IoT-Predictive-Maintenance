import { useState } from 'react';
import { Save, Wifi, WifiOff } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { useToast } from '../hooks/useToast';

export function Settings() {
  const toast = useToast();
  const [theme]     = useState<'dark' | 'light'>('dark');
  const [notifs, setNotifs] = useState({ maintenance: true, critical: true, model: false });
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_API_URL ?? 'http://localhost:8000');
  const useMock = import.meta.env.VITE_USE_MOCK_API !== 'false';

  const save = () => toast('success', 'Settings saved.');

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Settings" description="Application preferences and API configuration" />

      {/* Appearance */}
      <section className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-text mb-4">Appearance</h3>
        <div className="space-y-3">
          {(['dark', 'light'] as const).map(t => (
            <label key={t} className="flex items-center gap-3 cursor-pointer">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${ theme === t ? 'border-primary' : 'border-border' }`}>
                {theme === t && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>
              <span className="text-sm text-text capitalize">{t} theme</span>
              {t === 'dark' && <span className="text-xs text-text-secondary">(Active)</span>}
            </label>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-text mb-4">Notifications</h3>
        <div className="space-y-3">
          {[
            { key: 'maintenance' as const, label: 'Maintenance alerts', desc: 'Notify when a vehicle requires maintenance' },
            { key: 'critical'    as const, label: 'Critical alerts',     desc: 'Notify for vehicles in critical condition' },
            { key: 'model'       as const, label: 'Model alerts',        desc: 'Notify when model metrics degrade' },
          ].map(n => (
            <div key={n.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text">{n.label}</p>
                <p className="text-xs text-text-secondary">{n.desc}</p>
              </div>
              <button
                onClick={() => setNotifs(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
                className={`w-11 h-6 rounded-full transition-colors relative ${ notifs[n.key] ? 'bg-primary' : 'bg-border' }`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${ notifs[n.key] ? 'left-6' : 'left-1' }`} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* API */}
      <section className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-text mb-4">API Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text mb-1.5">Backend URL</label>
            <input
              value={apiUrl}
              onChange={e => setApiUrl(e.target.value)}
              className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:outline-none focus:border-primary/50"
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-bg-secondary border border-border rounded-lg">
            <div className="flex items-center gap-2">
              {useMock ? <WifiOff size={14} className="text-warning" /> : <Wifi size={14} className="text-success" />}
              <span className="text-sm text-text">API Mode</span>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full border ${ useMock ? 'text-warning bg-warning/10 border-warning/20' : 'text-success bg-success/10 border-success/20' }`}>
              {useMock ? 'Mock API (Development)' : 'Live Backend'}
            </span>
          </div>
          <p className="text-xs text-text-secondary">Set <code className="text-primary bg-primary/10 px-1 rounded">VITE_USE_MOCK_API=false</code> in your <code className="text-primary bg-primary/10 px-1 rounded">.env</code> to connect to a real backend.</p>
        </div>
      </section>

      <button
        onClick={save}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-bg font-semibold text-sm rounded-xl hover:bg-primary-dark transition-colors"
      >
        <Save size={14} /> Save Settings
      </button>
    </div>
  );
}
