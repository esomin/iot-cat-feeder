// Data model interfaces for the cat feeder application

export interface FeedingSchedule {
  id: string;
  time: string; // HH:MM format
  amount: number; // in grams
  enabled: boolean;
  repeatPattern: 'daily' | 'weekdays' | 'weekends' | 'custom';
  customDays?: number[]; // 0-6 (Sunday-Saturday)
  label?: string;
}

export interface FeedingLog {
  id: string;
  timestamp: Date;
  amount: number;
  type: 'manual' | 'scheduled';
  scheduleId?: string;
  success: boolean;
  errorMessage?: string;
}

export interface DeviceStatus {
  connected: boolean;
  lastSeen: Date;
  batteryLevel?: number;
  motorStatus: 'idle' | 'feeding' | 'error';
  cameraStatus: 'active' | 'inactive' | 'error';
}