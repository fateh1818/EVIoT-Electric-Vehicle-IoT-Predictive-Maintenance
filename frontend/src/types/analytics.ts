export interface TrendPoint {
  date: string;
  healthy: number;
  warning: number;
  critical: number;
}

export interface FailureProbabilityBucket {
  range: string;
  count: number;
}

export interface AnalyticsData {
  healthTrend: TrendPoint[];
  failureDistribution: FailureProbabilityBucket[];
  fleetHealth: { healthy: number; warning: number; critical: number };
  batteryHealthTrend: { date: string; avgSOH: number }[];
  temperatureTrend: { date: string; avgTemp: number }[];
  maintenanceDistribution: { type: string; count: number }[];
}
