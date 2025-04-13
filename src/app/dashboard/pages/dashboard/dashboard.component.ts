import { Component, signal, OnInit } from '@angular/core';
import { Crop } from '../../../crops/model/crop';
import { CropService } from '../../../crops/services/crop.service';

import { CommonModule } from '@angular/common';
import CropComponent from '../../../crops/component/crop-card/crop-card.component';
import { RouterLink } from '@angular/router';
import { Weather } from '../../../soil-analysis/model/weather';
import { WeatherService } from '../../../soil-analysis/services/weather.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CropComponent, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export default class DashboardComponent implements OnInit {
  crops = signal<Crop[]>([]);
  selectedCrop = signal<Crop | null>(null);
  currentDate = new Date();


  deviceStatuses = signal<
    { status: string; label: string; count: number; indicatorClass: string }[]
  >([
    {
      status: 'connected',
      label: 'Connected',
      count: 4,
      indicatorClass: 'connected',
    },
    {
      status: 'disconnected',
      label: 'Disconnected',
      count: 2,
      indicatorClass: 'disconnected',
    },
    {
      status: 'failure',
      label: 'With Failure',
      count: 1,
      indicatorClass: 'failure',
    },
  ]);

  
  currentMetrics = signal<
    { description: string; value: number | string; unit: string }[]
  >([]);

  constructor(
    private cropService: CropService,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    this.loadCrops();
  }

  /**
   * Cargar la lista de cultivos.
   */
  loadCrops(): void {
    this.cropService.getCropsByFarmer().subscribe((cropsData: Crop[]) => {
      this.crops.set(cropsData);
      if (cropsData.length > 0) {
        this.selectCrop(cropsData[0]); 
      }
    });
  }

  /**
   * Manejar la selección de un cultivo.
   */
  selectCrop(crop: Crop): void {
    this.selectedCrop.set(crop); 
    this.loadWeatherData(crop.id); 
  }

  deleteCrop(cropId: number): void {
    this.crops.update((crops) => crops.filter((crop) => crop.id !== cropId));
    this.cropService.delete(cropId).subscribe({
      next: () => {
        if (this.selectedCrop()?.id === cropId) {
          this.selectedCrop.set(null);
        }
      },
      error: () => this.loadCrops(),
    });
  }

  getIconClass(description: string): string {
    switch (description) {
      case 'Temperature':
        return 'fas fa-cloud';
      case 'Soil Moisture':
        return 'fas fa-tint';
      case 'Soil Temperature':
        return 'fas fa-thermometer-half';
      case 'PH Level':
        return 'fas fa-flask';
      default:
        return '';
    }
  }


  /**
   * Cargar los datos del clima para el cultivo seleccionado.
   */
  loadWeatherData(cropId: number): void {
    this.weatherService.getLastWeatherReportByCrop(cropId).subscribe({
      next: (weather: Weather) => {
        this.currentMetrics.set([
          { description: 'Soil Temperature', value: weather.temperature, unit: '°C' },
          { description: 'Soil Moisture', value: weather.humidity, unit: '%' },
        ]);
      },
      error: (error) => {
        console.error('Error loading weather data:', error);
        this.currentMetrics.set([]);
      },
    });
  }
}
