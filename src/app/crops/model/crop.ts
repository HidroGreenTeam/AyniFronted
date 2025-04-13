export class Crop {
  id: number;
  cropName: string;
  irrigationType: string;
  area: number;
  plantingDate: Date;
  farmerId: number;
  imageUrl: string;

  constructor() {
    this.id = 0;
    this.cropName = '';
    this.irrigationType = '';
    this.area = 0;
    this.plantingDate = new Date();
    this.farmerId = 0;
    this.imageUrl = '';
  }
}
