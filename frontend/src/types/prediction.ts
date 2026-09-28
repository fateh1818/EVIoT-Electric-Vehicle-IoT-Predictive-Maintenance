export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface PredictionResult {
  vehicleId: string;
  prediction: 'healthy' | 'maintenance_required' | 'critical';
  failureProbability?: number;
  rul?: number;
  ttf?: number;
  componentHealth?: number;
  featureImportance?: FeatureImportance[];
  timestamp?: string;
}

export interface PredictionInput {
  vehicleId: string;
  features: Record<string, number | string>;
}

export interface BatchPredictionResult {
  totalAnalyzed: number;
  maintenanceCases: number;
  criticalCases: number;
  results: PredictionResult[];
}
