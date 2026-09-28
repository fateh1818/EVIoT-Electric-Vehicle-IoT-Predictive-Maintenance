import type { Vehicle } from '../types/vehicle';
import type { PredictionInput, PredictionResult, BatchPredictionResult } from '../types/prediction';
import type { AnalyticsData } from '../types/analytics';
import type { ModelInfo, ModelComparison, ConfusionMatrix } from '../types/model';
import {
  MOCK_VEHICLES,
  MOCK_ANALYTICS,
  MOCK_MODEL_INFO,
  MOCK_MODEL_COMPARISONS,
  MOCK_CONFUSION_MATRIX,
  MOCK_RECENT_PREDICTIONS,
} from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  async getDashboardStats() {
    await delay(600);
    return {
      totalVehicles: 1248,
      healthyVehicles: 1041,
      maintenanceRequired: 142,
      criticalVehicles: 65,
      recentPredictions: MOCK_RECENT_PREDICTIONS,
    };
  },

  async getVehicles(): Promise<Vehicle[]> {
    await delay(700);
    return MOCK_VEHICLES;
  },

  async getVehicle(vehicleId: string): Promise<Vehicle | null> {
    await delay(400);
    return MOCK_VEHICLES.find(v => v.id === vehicleId) ?? null;
  },

  async predictVehicle(input: PredictionInput): Promise<PredictionResult> {
    await delay(1800); // Simulate ML inference
    const fp = Math.random() * 0.9 + 0.05;
    let prediction: PredictionResult['prediction'] = 'healthy';
    if (fp > 0.8) prediction = 'critical';
    else if (fp > 0.45) prediction = 'maintenance_required';
    const rul = fp > 0.8 ? Math.round(20 + Math.random() * 50) : fp > 0.45 ? Math.round(80 + Math.random() * 150) : Math.round(600 + Math.random() * 400);
    return {
      vehicleId: input.vehicleId,
      prediction,
      failureProbability: parseFloat(fp.toFixed(3)),
      rul,
      ttf: Math.round(rul * 0.9),
      componentHealth: parseFloat((1 - fp * 0.7).toFixed(2)),
      featureImportance: [
        { feature: 'Battery Temperature', importance: 0.32 },
        { feature: 'Battery SOH',         importance: 0.24 },
        { feature: 'Motor Temperature',   importance: 0.18 },
        { feature: 'Battery Current',     importance: 0.14 },
        { feature: 'Motor Vibration',     importance: 0.09 },
        { feature: 'Other',               importance: 0.03 },
      ],
      timestamp: new Date().toISOString(),
    };
  },

  async uploadBatch(_file: File): Promise<BatchPredictionResult> {
    await delay(2500);
    return {
      totalAnalyzed: 1245,
      maintenanceCases: 142,
      criticalCases: 65,
      results: MOCK_RECENT_PREDICTIONS,
    };
  },

  async getAnalytics(): Promise<AnalyticsData> {
    await delay(800);
    return MOCK_ANALYTICS;
  },

  async getModelInfo(): Promise<ModelInfo> {
    await delay(500);
    return MOCK_MODEL_INFO;
  },

  async getModelComparisons(): Promise<ModelComparison[]> {
    await delay(500);
    return MOCK_MODEL_COMPARISONS;
  },

  async getConfusionMatrix(): Promise<ConfusionMatrix> {
    await delay(500);
    return MOCK_CONFUSION_MATRIX;
  },
};
