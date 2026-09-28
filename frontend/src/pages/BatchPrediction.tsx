import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, X, Play, Download, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { useToast } from '../hooks/useToast';
import type { BatchPredictionResult } from '../types/prediction';
import { formatPercent, formatRUL } from '../utils/format';

export function BatchPrediction() {
  const toast            = useToast();
  const fileInputRef     = useRef<HTMLInputElement>(null);
  const [file, setFile]          = useState<File | null>(null);
  const [dragging, setDragging]  = useState(false);
  const [loading, setLoading]    = useState(false);
  const [result, setResult]      = useState<BatchPredictionResult | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.name.endsWith('.csv')) { setFile(f); setResult(null); }
    else toast('error', 'Please upload a CSV file.');
  }, [toast]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setResult(null); }
  };

  const handleRun = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await api.uploadBatch(file);
      setResult(res);
      toast('success', `Batch prediction complete: ${res.totalAnalyzed} vehicles analyzed.`);
    } catch {
      toast('error', 'Batch prediction failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const rows = [
      ['Vehicle ID', 'Status', 'Failure Probability', 'RUL', 'TTF', 'Component Health'],
      ...result.results.map(r => [
        r.vehicleId, r.prediction,
        r.failureProbability !== undefined ? (r.failureProbability * 100).toFixed(1) + '%' : '',
        r.rul ?? '', r.ttf ?? '', r.componentHealth ?? '',
      ]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'eviot_predictions.csv'; a.click();
    URL.revokeObjectURL(url);
    toast('success', 'Results downloaded.');
  };

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader title="Batch Prediction" description="Analyze multiple vehicles from a CSV file" />

      {/* Upload Area */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`bg-card border-2 border-dashed rounded-xl p-12 flex flex-col items-center gap-4 cursor-pointer transition-all duration-200
          ${dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 hover:bg-card'}
        `}
      >
        <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
        <div className={`w-16 h-16 rounded-xl flex items-center justify-center transition-colors ${dragging ? 'bg-primary/20' : 'bg-border'}`}>
          <Upload size={28} className={dragging ? 'text-primary' : 'text-text-secondary'} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-text">Drop CSV file here</p>
          <p className="text-xs text-text-secondary mt-1">or <span className="text-primary">browse files</span></p>
        </div>
        <p className="text-xs text-text-secondary">Supported format: CSV</p>
      </div>

      {/* File info */}
      {file && (
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-text">{file.name}</p>
                <p className="text-xs text-text-secondary">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button onClick={() => { setFile(null); setResult(null); }} className="text-text-secondary hover:text-text">
              <X size={16} />
            </button>
          </div>

          {/* Mock preview */}
          <div className="mt-4 overflow-x-auto">
            <p className="text-xs text-text-secondary mb-2 font-medium uppercase tracking-wider">Preview (first 3 rows)</p>
            <table className="w-full text-xs border border-border rounded-lg overflow-hidden">
              <thead className="bg-bg-secondary">
                <tr>
                  {['Vehicle ID', 'SoC', 'SoH', 'Temp (°C)', 'Voltage (V)', 'Motor RPM', '…'].map(h => (
                    <th key={h} className="px-3 py-2 text-left text-text-secondary font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[['EV-001', '82', '94', '31', '389', '4200', '…'], ['EV-002', '61', '79', '44', '362', '3850', '…'], ['EV-003', '88', '96', '27', '401', '4600', '…']].map((row, i) => (
                  <tr key={i} className="hover:bg-border/30">
                    {row.map((cell, j) => <td key={j} className="px-3 py-2 text-text">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleRun}
            disabled={loading}
            className="mt-4 flex items-center gap-2 px-6 py-3 bg-primary text-bg font-semibold text-sm rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60"
          >
            {loading ? (
              <><span className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" /> Processing...</>
            ) : (
              <><Play size={16} /> Run Batch Prediction</>
            )}
          </button>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Vehicles Analyzed', value: result.totalAnalyzed.toLocaleString(), color: 'text-primary' },
              { label: 'Maintenance Cases', value: result.maintenanceCases.toLocaleString(), color: 'text-warning' },
              { label: 'Critical Cases',    value: result.criticalCases.toLocaleString(), color: 'text-danger' },
            ].map(s => (
              <div key={s.label} className="bg-card border border-border rounded-xl p-5">
                <p className="text-xs text-text-secondary mb-2">{s.label}</p>
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-success" />
                <span className="text-sm font-semibold text-text">Prediction Results</span>
              </div>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary text-xs font-medium rounded-lg hover:bg-primary/20 transition-colors"
              >
                <Download size={12} /> Download CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="border-b border-border">
                  <tr className="text-text-secondary">
                    {['Vehicle ID', 'Status', 'Failure Prob.', 'RUL', 'TTF', 'Component Health'].map((h, i) => (
                      <th key={h} className={`px-5 py-3 font-medium ${i > 0 ? 'text-right' : 'text-left'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {result.results.map(r => (
                    <tr key={r.vehicleId} className="hover:bg-border/30">
                      <td className="px-5 py-3 font-medium text-text">{r.vehicleId}</td>
                      <td className="px-5 py-3 text-right"><StatusBadge status={r.prediction} /></td>
                      <td className="px-5 py-3 text-right font-mono">{r.failureProbability !== undefined ? formatPercent(r.failureProbability) : '—'}</td>
                      <td className="px-5 py-3 text-right text-text-secondary">{r.rul !== undefined ? formatRUL(r.rul) : '—'}</td>
                      <td className="px-5 py-3 text-right text-text-secondary">{r.ttf !== undefined ? formatRUL(r.ttf) : '—'}</td>
                      <td className="px-5 py-3 text-right">{r.componentHealth !== undefined ? r.componentHealth.toFixed(2) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
