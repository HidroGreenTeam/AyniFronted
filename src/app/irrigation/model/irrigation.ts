export class Irrigation {
  id: number;
  cropId: number;
  mode: 'manual' | 'automatic';
  automaticIrrigationEnabled: boolean;
  manualIrrigationEnabled: boolean;
  sensorThreshold: number;
  waterAmount: number;
  currentSoilMoisture: number;
  consentGiven: boolean;
  isCurrentlyIrrigating: boolean;
  duration: number;

  constructor() {
    this.id = 0;
    this.cropId = 0;
    this.mode = 'manual';
    this.automaticIrrigationEnabled = false;
    this.manualIrrigationEnabled = false;
    this.sensorThreshold = 30;
    this.waterAmount = 0;
    this.currentSoilMoisture = 25;
    this.consentGiven = false;
    this.isCurrentlyIrrigating = false;
    this.duration = 0;
  }
}
