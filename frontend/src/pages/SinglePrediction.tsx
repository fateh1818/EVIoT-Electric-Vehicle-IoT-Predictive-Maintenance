import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, AlertTriangle, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { api } from '../services/api';
import { PageHeader } from '../components/common/PageHeader';
import { useToast } from '../hooks/useToast';
import type { PredictionResult } from '../types/prediction';
import { formatPercent, formatRUL } from '../utils/format';

interface FormField {
  key: string;
  label: string;
  unit?: string;
  hint?: string;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
}

const FORM_GROUPS: { title: string; icon: string; fields: FormField[] }[] = [
  {
    title: 'Vehicle Information',
    icon: '🚗',
    fields: [
      { key: 'vehicle_age',  label: 'Vehicle Age',  unit: 'years', hint: 'Age of the vehicle',          min: 0, max: 20 },
      { key: 'mileage',      label: 'Mileage',       unit: 'km',    hint: 'Total kilometers driven',      min: 0, max: 500000 },
    ],
  },
  {
    title: 'Battery',
    icon: '🔋',
    fields: [
      { key: 'battery_soc',         label: 'State of Charge (SoC)',   unit: '%',  hint: 'Current battery charge level',            min: 0,    max: 100,   step: 0.1, required: true },
      { key: 'battery_soh',         label: 'State of Health (SoH)',   unit: '%',  hint: 'Overall battery health',                  min: 0,    max: 100,   step: 0.1, required: true },
      { key: 'battery_voltage',     label: 'Battery Voltage',         unit: 'V',  hint: 'Current battery pack voltage',            min: 200,  max: 450,   step: 0.1 },
      { key: 'battery_current',     label: 'Battery Current',         unit: 'A',  hint: 'Current draw from battery',               min: -500, max: 500,   step: 0.1 },
      { key: 'battery_temperature', label: 'Battery Temperature',     unit: '°C', hint: 'Battery pack temperature',               min: -20,  max: 80,    step: 0.1, required: true },
      { key: 'charging_cycles',     label: 'Charging Cycles',         unit: '',   hint: 'Total number of charge/discharge cycles', min: 0,    max: 5000              },
      { key: 'battery_energy',      label: 'Battery Energy',          unit: 'kWh',hint: 'Available energy in battery',            min: 0,    max: 120,   step: 0.1 },
    ],
  },
  {
    title: 'Motor',
    icon: '⚙️',
    fields: [
      { key: 'motor_temperature', label: 'Motor Temperature', unit: '°C', hint: 'Electric motor temperature',   min: -20, max: 120,  step: 0.1, required: true },
      { key: 'motor_rpm',         label: 'Motor RPM',         unit: 'rpm',hint: 'Motor rotational speed',       min: 0,   max: 20000             },
      { key: 'motor_torque',      label: 'Motor Torque',      unit: 'Nm', hint: 'Motor output torque',          min: 0,   max: 500,  step: 0.1 },
      { key: 'motor_current',     label: 'Motor Current',     unit: 'A',  hint: 'Current supplied to motor',   min: 0,   max: 1000, step: 0.1 },
      { key: 'motor_vibration',   label: 'Motor Vibration',   unit: 'g',  hint: 'Vibration level (g-force)',   min: 0,   max: 10,   step: 0.01 },
    ],
  },
  {
    title: 'Vehicle Dynamics',
    icon: '📡',
    fields: [
      { key: 'speed',        label: 'Vehicle Speed', unit: 'km/h', hint: 'Current vehicle speed',        min: 0, max: 300, step: 0.1 },
      { key: 'acceleration', label: 'Acceleration',  unit: 'm/s²', hint: 'Longitudinal acceleration',    min: -20, max: 20, step: 0.01 },
    ],
  },
  {
    title: 'Environment',
    icon: '🌡️',
    fields: [
      { key: 'ambient_temperature', label: 'Ambient Temperature', unit: '°C', hint: 'Outside temperature',   min: -40, max: 60, step: 0.1 },
      { key: 'humidity',            label: 'Humidity',            unit: '%',  hint: 'Relative air humidity',  min: 0,   max: 100, step: 0.1 },
    ],
  },
];

const REQUIRED_KEYS = FORM_GROUPS.flatMap(g => g.fields.filter(f => f.required).map(f => f.key));

function getResultStyle(p: PredictionResult) {
  switch (p.prediction) {
    case 'healthy': return { color: 'text-success', bg: 'bg-success/10 border-success/30', Icon: CheckCircle, label: 'VEHICLE HEALTHY' };
    case 'critical': return { color: 'text-danger',  bg: 'bg-danger/10  border-danger/30',  Icon: XCircle,      label: 'CRITICAL CONDITION' };
    default:         return { color: 'text-warning', bg: 'bg-warning/10 border-warning/30', Icon: AlertTriangle, label: 'MAINTENANCE RECOMMENDED' };
  }
}

export function SinglePrediction() {
  const [params]   = useSearchParams();
  const toast      = useToast();
  const [vehicleId, setVehicleId] = useState(params.get('vehicle') ?? 'EV-001');
  const [values, setValues]       = useState<Record<string, string>>({});
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState<PredictionResult | null>(null);

  const setValue = (key: string, val: string) => {
    setValues(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    FORM_GROUPS.forEach(g => g.fields.forEach(f => {
      const v = values[f.key];
      if (f.required && (!v || v.trim() === '')) { errs[f.key] = 'This field is required.'; return; }
      if (v && v.trim() !== '') {
        const n = parseFloat(v);
        if (isNaN(n)) { errs[f.key] = 'Must be a valid number.'; return; }
        if (f.min !== undefined && n < f.min) { errs[f.key] = `Value must be ≥ ${f.min}.`; return; }
        if (f.max !== undefined && n > f.max) { errs[f.key] = `Value must be ≤ ${f.max}.`; return; }
      }
    }));
    return errs;
  };

  const handlePredict = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); toast('warning', 'Please fix validation errors.'); return; }
    setLoading(true); setResult(null);
    try {
      const features: Record<string, number> = {};
      Object.entries(values).forEach(([k, v]) => { if (v) features[k] = parseFloat(v); });
      const res = await api.predictVehicle({ vehicleId, features });
      setResult(res);
      toast('success', 'Prediction completed successfully.');
    } catch {
      toast('error', 'Prediction failed. Check the backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setValues({}); setErrors({}); setResult(null); };

  return (
    <div className="max-w-5xl space-y-6">
      <PageHeader title="Single Vehicle Prediction" description="Analyze one vehicle using the predictive maintenance model" />

      {/* Vehicle ID */}
      <div className="bg-card border border-border rounded-xl p-5">
        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Vehicle Identifier</label>
        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            value={vehicleId}
            onChange={e => setVehicleId(e.target.value)}
            placeholder="e.g. EV-001"
            className="w-full bg-bg-secondary border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-text placeholder-text-secondary focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>

      {/* Form Groups */}
      <div className="space-y-4">
        {FORM_GROUPS.map(group => (
          <div key={group.title} className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-text mb-4 flex items-center gap-2">
              <span>{group.icon}</span> {group.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {group.fields.map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-text mb-1">
                    {field.label}
                    {field.required && <span className="text-danger ml-1">*</span>}
                    {field.unit && <span className="text-text-secondary ml-1">({field.unit})</span>}
                  </label>
                  {field.hint && <p className="text-xs text-text-secondary mb-1.5">{field.hint}</p>}
                  <input
                    type="number"
                    value={values[field.key] ?? ''}
                    onChange={e => setValue(field.key, e.target.value)}
                    min={field.min}
                    max={field.max}
                    step={field.step ?? 1}
                    placeholder={field.min !== undefined && field.max !== undefined ? `${field.min} – ${field.max}` : ''}
                    className={`w-full bg-bg-secondary border rounded-lg px-3 py-2.5 text-sm text-text placeholder-text-secondary focus:outline-none transition-colors
                      ${errors[field.key] ? 'border-danger/50 focus:border-danger' : 'border-border focus:border-primary/50'}
                    `}
                  />
                  {errors[field.key] && (
                    <p className="text-xs text-danger mt-1 flex items-center gap-1">
                      <AlertTriangle size={11} /> {errors[field.key]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handlePredict}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-bg font-semibold text-sm rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><span className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" /> Analyzing vehicle...</>
          ) : (
            <><Search size={16} /> Predict Maintenance</>
          )}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-3 bg-card border border-border text-text text-sm rounded-xl hover:border-primary/30 transition-colors"
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-border border-t-primary rounded-full animate-spin" />
          <div className="text-center">
            <p className="text-sm font-medium text-text">Analyzing vehicle...</p>
            <p className="text-xs text-text-secondary mt-1">Processing telemetry data with the ML model</p>
          </div>
        </div>
      )}

      {/* Result */}
      {result && !loading && (() => {
        const style = getResultStyle(result);
        return (
          <div className="space-y-4">
            {/* Main result */}
            <div className={`border rounded-xl p-6 ${style.bg}`}>
              <div className={`flex items-center gap-3 mb-6 ${style.color}`}>
                <style.Icon size={28} />
                <span className="text-lg font-bold tracking-wide">{style.label}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {result.failureProbability !== undefined && (
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Failure Probability</p>
                    <p className={`text-2xl font-bold ${style.color}`}>{formatPercent(result.failureProbability)}</p>
                  </div>
                )}
                {result.componentHealth !== undefined && (
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Component Health</p>
                    <p className="text-2xl font-bold text-text">{result.componentHealth.toFixed(2)}</p>
                  </div>
                )}
                {result.rul !== undefined && (
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Remaining Useful Life</p>
                    <p className="text-2xl font-bold text-text">{formatRUL(result.rul)}</p>
                  </div>
                )}
                {result.ttf !== undefined && (
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Time To Failure</p>
                    <p className="text-2xl font-bold text-text">{formatRUL(result.ttf)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Model Confidence */}
            {result.failureProbability !== undefined && (
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="text-sm font-semibold text-text mb-4">Model Confidence</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary">Prediction confidence</span>
                    <span className="font-mono font-medium text-text">{formatPercent(result.failureProbability)}</span>
                  </div>
                  <div className="w-full h-3 bg-bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${result.failureProbability * 100}%`, background: style.color.replace('text-', '') === 'success' ? '#22C55E' : style.color.includes('warning') ? '#F59E0B' : '#EF4444' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Feature Importance */}
            {result.featureImportance && result.featureImportance.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="text-sm font-semibold text-text mb-4">Top Contributing Factors</h3>
                <div className="space-y-3">
                  {result.featureImportance.map(f => (
                    <div key={f.feature}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-text">{f.feature}</span>
                        <span className="font-mono text-text-secondary">{Math.round(f.importance * 100)}%</span>
                      </div>
                      <div className="w-full h-2 bg-bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-700"
                          style={{ width: `${f.importance * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
