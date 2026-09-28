export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
}

export interface ModelInfo {
  name: string;
  type: string;
  task: string;
  crossValidation: string;
  status: string;
  trainedAt: string;
  metrics: ModelMetrics;
}

export interface ModelComparison {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
}

export interface ConfusionMatrix {
  tn: number;
  fp: number;
  fn: number;
  tp: number;
}
