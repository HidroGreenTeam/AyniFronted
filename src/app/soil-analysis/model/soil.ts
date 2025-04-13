export class Analysis {
  id: number;
  date: string;
  deviceId: number;

  

  nitrogen: number;
  phosphorus: number;
  potassium: number;
temperature: any;
humidity: any;

  constructor() {
    this.id = 0;
    this.deviceId = 0;
    this.date = '';
    this.nitrogen = 0;
    this.phosphorus = 0;
    this.potassium = 0;
  }
}
