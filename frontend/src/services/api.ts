import axios from 'axios';
import { mockApi } from './mockApi';
import type { Vehicle } from '../types/vehicle';
import type { PredictionInput, PredictionResult, BatchPredictionResult } from '../types/prediction';
import type { AnalyticsData } from '../types/analytics';
import type { ModelInfo, ModelComparison, ConfusionMatrix } from '../types/model';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

export const api = {
  async getDashboardStats() {
    if (USE_MOCK) return mockApi.getDashboardStats();
    const { data } = await client.get('/api/dashboard');
    return data;
  },

  async getVehicles(): Promise<Vehicle[]> {
    if (USE_MOCK) return mockApi.getVehicles();
    const { data } = await client.get('/api/vehicles');
    return data;
  },

  async getVehicle(vehicleId: string): Promise<Vehicle | null> {
    if (USE_MOCK) return mockApi.getVehicle(vehicleId);
    const { data } = await client.get(`/api/vehicles/${vehicleId}`);
    return data;
  },

  async predictVehicle(input: PredictionInput): Promise<PredictionResult> {
    if (USE_MOCK) return mockApi.predictVehicle(input);
    const { data } = await client.post('/api/predict', input);
    return data;
  },

  async uploadBatch(file: File): Promise<BatchPredictionResult> {
    if (USE_MOCK) return mockApi.uploadBatch(file);
    const form = new FormData();
    form.append('file', file);
    const { data } = await client.post('/api/predict/batch', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async getAnalytics(): Promise<AnalyticsData> {
    if (USE_MOCK) return mockApi.getAnalytics();
    const { data } = await client.get('/api/analytics');
    return data;
  },

  async getModelInfo(): Promise<ModelInfo> {
    if (USE_MOCK) return mockApi.getModelInfo();
    const { data } = await client.get('/api/model');
    return data;
  },

  async getModelComparisons(): Promise<ModelComparison[]> {
    if (USE_MOCK) return mockApi.getModelComparisons();
    const { data } = await client.get('/api/model/comparisons');
    return data;
  },

  async getConfusionMatrix(): Promise<ConfusionMatrix> {
    if (USE_MOCK) return mockApi.getConfusionMatrix();
    const { data } = await client.get('/api/model/confusion-matrix');
    return data;
  },
};
