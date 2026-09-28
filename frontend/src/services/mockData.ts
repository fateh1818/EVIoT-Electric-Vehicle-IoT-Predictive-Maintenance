import type { Vehicle } from '../types/vehicle';
import type { AnalyticsData } from '../types/analytics';
import type { ModelInfo, ModelComparison, ConfusionMatrix } from '../types/model';
import type { PredictionResult } from '../types/prediction';

export const MOCK_VEHICLES: Vehicle[] = [
  { id: 'EV-001', status: 'healthy',   batterySOC: 82, batterySOH: 94, temperature: 31, failureProbability: 0.084, rul: 842, lastUpdate: '2 min ago',  mileage: 24520, vehicleAge: 3 },
  { id: 'EV-002', status: 'healthy',   batterySOC: 76, batterySOH: 91, temperature: 29, failureProbability: 0.121, rul: 720, lastUpdate: '5 min ago',  mileage: 31200, vehicleAge: 4 },
  { id: 'EV-003', status: 'healthy',   batterySOC: 88, batterySOH: 96, temperature: 27, failureProbability: 0.045, rul: 980, lastUpdate: '1 min ago',  mileage: 12800, vehicleAge: 2 },
  { id: 'EV-004', status: 'healthy',   batterySOC: 71, batterySOH: 89, temperature: 33, failureProbability: 0.178, rul: 680, lastUpdate: '7 min ago',  mileage: 42100, vehicleAge: 5 },
  { id: 'EV-005', status: 'healthy',   batterySOC: 65, batterySOH: 87, temperature: 35, failureProbability: 0.212, rul: 610, lastUpdate: '3 min ago',  mileage: 38400, vehicleAge: 4 },
  { id: 'EV-006', status: 'healthy',   batterySOC: 90, batterySOH: 98, temperature: 26, failureProbability: 0.032, rul: 1100, lastUpdate: '2 min ago', mileage: 8200,  vehicleAge: 1 },
  { id: 'EV-007', status: 'healthy',   batterySOC: 79, batterySOH: 93, temperature: 30, failureProbability: 0.098, rul: 810, lastUpdate: '4 min ago',  mileage: 27900, vehicleAge: 3 },
  { id: 'EV-008', status: 'healthy',   batterySOC: 84, batterySOH: 95, temperature: 28, failureProbability: 0.067, rul: 900, lastUpdate: '6 min ago',  mileage: 19300, vehicleAge: 2 },
  { id: 'EV-009', status: 'healthy',   batterySOC: 73, batterySOH: 90, temperature: 32, failureProbability: 0.145, rul: 740, lastUpdate: '8 min ago',  mileage: 35600, vehicleAge: 4 },
  { id: 'EV-010', status: 'healthy',   batterySOC: 68, batterySOH: 88, temperature: 34, failureProbability: 0.189, rul: 650, lastUpdate: '3 min ago',  mileage: 41200, vehicleAge: 5 },
  { id: 'EV-011', status: 'warning',   batterySOC: 61, batterySOH: 79, temperature: 44, failureProbability: 0.674, rul: 124, lastUpdate: '8 min ago',  mileage: 58900, vehicleAge: 6 },
  { id: 'EV-012', status: 'warning',   batterySOC: 54, batterySOH: 75, temperature: 47, failureProbability: 0.712, rul: 98,  lastUpdate: '12 min ago', mileage: 67800, vehicleAge: 7 },
  { id: 'EV-013', status: 'warning',   batterySOC: 58, batterySOH: 77, temperature: 45, failureProbability: 0.634, rul: 145, lastUpdate: '5 min ago',  mileage: 53200, vehicleAge: 6 },
  { id: 'EV-014', status: 'warning',   batterySOC: 63, batterySOH: 81, temperature: 42, failureProbability: 0.521, rul: 178, lastUpdate: '9 min ago',  mileage: 49800, vehicleAge: 5 },
  { id: 'EV-015', status: 'warning',   batterySOC: 56, batterySOH: 74, temperature: 48, failureProbability: 0.758, rul: 82,  lastUpdate: '15 min ago', mileage: 72400, vehicleAge: 8 },
  { id: 'EV-016', status: 'warning',   batterySOC: 59, batterySOH: 76, temperature: 46, failureProbability: 0.689, rul: 112, lastUpdate: '11 min ago', mileage: 61500, vehicleAge: 7 },
  { id: 'EV-017', status: 'warning',   batterySOC: 64, batterySOH: 82, temperature: 41, failureProbability: 0.487, rul: 195, lastUpdate: '6 min ago',  mileage: 46200, vehicleAge: 5 },
  { id: 'EV-018', status: 'warning',   batterySOC: 52, batterySOH: 73, temperature: 49, failureProbability: 0.821, rul: 65,  lastUpdate: '18 min ago', mileage: 78900, vehicleAge: 8 },
  { id: 'EV-019', status: 'critical',  batterySOC: 42, batterySOH: 63, temperature: 58, failureProbability: 0.918, rul: 38,  lastUpdate: '12 min ago', mileage: 98400, vehicleAge: 10 },
  { id: 'EV-020', status: 'critical',  batterySOC: 38, batterySOH: 58, temperature: 62, failureProbability: 0.954, rul: 22,  lastUpdate: '20 min ago', mileage: 112000, vehicleAge: 11 },
  { id: 'EV-021', status: 'critical',  batterySOC: 45, batterySOH: 61, temperature: 59, failureProbability: 0.897, rul: 45,  lastUpdate: '9 min ago',  mileage: 95600, vehicleAge: 10 },
  { id: 'EV-022', status: 'critical',  batterySOC: 36, batterySOH: 55, temperature: 65, failureProbability: 0.972, rul: 14,  lastUpdate: '25 min ago', mileage: 124500, vehicleAge: 12 },
  { id: 'EV-023', status: 'critical',  batterySOC: 41, batterySOH: 59, temperature: 61, failureProbability: 0.931, rul: 31,  lastUpdate: '14 min ago', mileage: 108700, vehicleAge: 11 },
  { id: 'EV-024', status: 'warning',   batterySOC: 61, batterySOH: 79, temperature: 44, failureProbability: 0.673, rul: 124, lastUpdate: '8 min ago',  mileage: 58200, vehicleAge: 6 },
  { id: 'EV-087', status: 'critical',  batterySOC: 42, batterySOH: 63, temperature: 58, failureProbability: 0.918, rul: 38,  lastUpdate: '12 min ago', mileage: 97800, vehicleAge: 10 },
];

export const MOCK_ANALYTICS: AnalyticsData = {
  healthTrend: [
    { date: 'Sep 1',  healthy: 1080, warning: 110, critical: 58 },
    { date: 'Sep 5',  healthy: 1090, warning: 108, critical: 50 },
    { date: 'Sep 10', healthy: 1095, warning: 105, critical: 48 },
    { date: 'Sep 15', healthy: 1060, warning: 125, critical: 63 },
    { date: 'Sep 20', healthy: 1050, warning: 132, critical: 66 },
    { date: 'Sep 25', healthy: 1041, warning: 142, critical: 65 },
    { date: 'Sep 28', healthy: 1041, warning: 142, critical: 65 },
  ],
  failureDistribution: [
    { range: '0–20%',   count: 890 },
    { range: '20–40%',  count: 218 },
    { range: '40–60%',  count: 95  },
    { range: '60–80%',  count: 87  },
    { range: '80–100%', count: 58  },
  ],
  fleetHealth: { healthy: 1041, warning: 142, critical: 65 },
  batteryHealthTrend: [
    { date: 'Sep 1',  avgSOH: 87.2 },
    { date: 'Sep 5',  avgSOH: 86.9 },
    { date: 'Sep 10', avgSOH: 86.5 },
    { date: 'Sep 15', avgSOH: 86.1 },
    { date: 'Sep 20', avgSOH: 85.8 },
    { date: 'Sep 25', avgSOH: 85.4 },
    { date: 'Sep 28', avgSOH: 85.1 },
  ],
  temperatureTrend: [
    { date: 'Sep 1',  avgTemp: 33.2 },
    { date: 'Sep 5',  avgTemp: 34.1 },
    { date: 'Sep 10', avgTemp: 35.4 },
    { date: 'Sep 15', avgTemp: 36.8 },
    { date: 'Sep 20', avgTemp: 37.2 },
    { date: 'Sep 25', avgTemp: 38.1 },
    { date: 'Sep 28', avgTemp: 38.6 },
  ],
  maintenanceDistribution: [
    { type: 'None',        count: 890 },
    { type: 'Preventive',  count: 218 },
    { type: 'Predictive',  count: 95  },
    { type: 'Corrective',  count: 45  },
  ],
};

export const MOCK_MODEL_INFO: ModelInfo = {
  name: 'Random Forest',
  type: 'Ensemble',
  task: 'Classification',
  crossValidation: '5-Fold',
  status: 'Production Ready',
  trainedAt: '2026-09-20T10:30:00Z',
  metrics: {
    accuracy: 0.942,
    precision: 0.918,
    recall: 0.935,
    f1Score: 0.926,
    rocAuc: 0.961,
  },
};

export const MOCK_MODEL_COMPARISONS: ModelComparison[] = [
  { name: 'KNN',            accuracy: 0.912, precision: 0.893, recall: 0.887, f1: 0.890 },
  { name: 'Decision Tree',  accuracy: 0.924, precision: 0.901, recall: 0.913, f1: 0.907 },
  { name: 'Random Forest',  accuracy: 0.942, precision: 0.918, recall: 0.935, f1: 0.926 },
  { name: 'Naive Bayes',    accuracy: 0.889, precision: 0.862, recall: 0.874, f1: 0.868 },
  { name: 'SVM',            accuracy: 0.931, precision: 0.908, recall: 0.921, f1: 0.914 },
];

export const MOCK_CONFUSION_MATRIX: ConfusionMatrix = {
  tn: 4821, fp: 179, fn: 312, tp: 4688,
};

export const MOCK_RECENT_PREDICTIONS: PredictionResult[] = [
  { vehicleId: 'EV-001', prediction: 'healthy',              failureProbability: 0.084, rul: 842, ttf: 900,  componentHealth: 0.94, timestamp: '2 min ago' },
  { vehicleId: 'EV-024', prediction: 'maintenance_required', failureProbability: 0.673, rul: 124, ttf: 108,  componentHealth: 0.71, timestamp: '8 min ago' },
  { vehicleId: 'EV-087', prediction: 'critical',             failureProbability: 0.918, rul: 38,  ttf: 32,   componentHealth: 0.43, timestamp: '12 min ago' },
  { vehicleId: 'EV-012', prediction: 'maintenance_required', failureProbability: 0.712, rul: 98,  ttf: 85,   componentHealth: 0.68, timestamp: '15 min ago' },
  { vehicleId: 'EV-006', prediction: 'healthy',              failureProbability: 0.032, rul: 1100, ttf: 1200, componentHealth: 0.98, timestamp: '20 min ago' },
];
