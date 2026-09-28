export type VehicleStatus = 'healthy' | 'warning' | 'critical';

export interface Vehicle {
  id: string;
  status: VehicleStatus;
  batterySOC: number;   // %
  batterySOH: number;   // %
  temperature: number;  // °C
  failureProbability: number; // 0–1
  rul: number;          // hours
  lastUpdate: string;
  mileage?: number;
  vehicleAge?: number;
}
