import { useEffect, useState } from 'react';
import { Brain, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { PageHeader } from '../components/common/PageHeader';
import { LoadingState } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';
import type { ModelInfo, ModelComparison, ConfusionMatrix } from '../types/model';

function MetricCard({ label, value, color = 'text-primary' }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-5">
      <p className="text-xs text-text-secondary mb-2">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

export function Model() {
  const [info, setInfo]           = useState<ModelInfo | null>(null);
  const [comparisons, setComp]    = useState<ModelComparison[]>([]);
  const [matrix, setMatrix]       = useState<ConfusionMatrix | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const [i, c, m] = await Promise.all([api.getModelInfo(), api.getModelComparisons(), api.getConfusionMatrix()]);
      setInfo(i); setComp(c); setMatrix(m);
    } catch { setError('Failed to load model data.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState message="Loading model data..." />;
  if (error || !info) return <ErrorState message={error ?? 'No data'} onRetry={load} />;

  const maxVal = matrix ? Math.max(matrix.tn, matrix.fp, matrix.fn, matrix.tp) : 1;
  const cellBg = (v: number) => `rgba(34, 211, 238, ${0.05 + 0.4 * (v / maxVal)})`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Predictive Model"
        description="Machine learning model performance and configuration"
        actions={
          <div className="hidden sm:block">
            <p className="text-xs text-text-secondary text-right">⚠ Mock metrics — replace with real backend data</p>
          </div>
        }
      />

      {/* Model card */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Brain size={24} className="text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h2 className="text-lg font-bold text-text">{info.name}</h2>
              <span className="flex items-center gap-1.5 text-xs text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> {info.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-text-secondary">
              <span><span className="text-text">Task:</span> {info.task}</span>
              <span><span className="text-text">Type:</span> {info.type}</span>
              <span><span className="text-text">CV:</span> {info.crossValidation}</span>
              <span><span className="text-text">Trained:</span> {new Date(info.trainedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetricCard label="Accuracy"  value={`${(info.metrics.accuracy * 100).toFixed(1)}%`}  color="text-primary" />
        <MetricCard label="Precision" value={`${(info.metrics.precision * 100).toFixed(1)}%`} color="text-success" />
        <MetricCard label="Recall"    value={`${(info.metrics.recall * 100).toFixed(1)}%`}    color="text-success" />
        <MetricCard label="F1 Score"  value={`${(info.metrics.f1Score * 100).toFixed(1)}%`}  color="text-warning" />
        <MetricCard label="ROC-AUC"   value={`${(info.metrics.rocAuc * 100).toFixed(1)}%`}   color="text-primary" />
      </div>

      {/* Model Comparison */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-text">Model Comparison</h3>
          <p className="text-xs text-text-secondary mt-0.5">Comparative evaluation of candidate models (mock values)</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr className="text-xs text-text-secondary">
                {['Model', 'Accuracy', 'Precision', 'Recall', 'F1 Score'].map(h => (
                  <th key={h} className={`px-5 py-3 font-medium ${h === 'Model' ? 'text-left' : 'text-right'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {comparisons.map(m => (
                <tr key={m.name} className={`hover:bg-border/30 transition-colors ${m.name === info.name ? 'bg-primary/5' : ''}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {m.name === info.name && <CheckCircle size={14} className="text-primary" />}
                      <span className={`font-medium ${m.name === info.name ? 'text-primary' : 'text-text'}`}>{m.name}</span>
                      {m.name === info.name && <span className="text-[10px] text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded">SELECTED</span>}
                    </div>
                  </td>
                  {[m.accuracy, m.precision, m.recall, m.f1].map((v, i) => (
                    <td key={i} className="px-5 py-3 text-right font-mono text-xs">{(v * 100).toFixed(1)}%</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confusion Matrix */}
      {matrix && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-text mb-1">Confusion Matrix</h3>
          <p className="text-xs text-text-secondary mb-6">Test set evaluation (mock values)</p>
          <div className="flex justify-center">
            <div>
              <div className="text-xs text-text-secondary text-center mb-3 font-medium">Predicted</div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'TN', value: matrix.tn, desc: 'True Negative',  v: matrix.tn },
                  { label: 'FP', value: matrix.fp, desc: 'False Positive', v: matrix.fp },
                  { label: 'FN', value: matrix.fn, desc: 'False Negative', v: matrix.fn },
                  { label: 'TP', value: matrix.tp, desc: 'True Positive',  v: matrix.tp },
                ].map(cell => (
                  <div
                    key={cell.label}
                    className="w-36 h-28 rounded-xl flex flex-col items-center justify-center gap-1 border border-border"
                    style={{ background: cellBg(cell.v) }}
                  >
                    <span className="text-xs text-text-secondary">{cell.label}</span>
                    <span className="text-2xl font-bold text-text">{cell.value.toLocaleString()}</span>
                    <span className="text-[10px] text-text-secondary">{cell.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
