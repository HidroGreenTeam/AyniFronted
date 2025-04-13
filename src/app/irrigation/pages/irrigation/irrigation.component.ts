import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CropService } from '../../../crops/services/crop.service';
import { IrrigationService } from '../../services/irrigation.service';
import { Crop } from '../../../crops/model/crop';
import { Analysis } from '../../../soil-analysis/model/soil';
import { Weather } from '../../../soil-analysis/model/weather';
import { SoilService } from '../../../soil-analysis/services/soil.service';
import { WeatherService } from '../../../soil-analysis/services/weather.service';


@Component({
  selector: 'app-irrigation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './irrigation.component.html',
  styleUrls: ['./irrigation.component.css'],
})
export default class IrrigationComponent implements OnInit {
  crops: Crop[] = [];
  selectedCropId: number | null = null;

  
  lastSoilAnalysis: Analysis | null = null;
  lastWeatherReport: Weather | null = null;

  
  irrigationStatus: boolean | null = null;
  statusMessage: string | null = null;

  constructor(
    private cropService: CropService,
    private irrigationService: IrrigationService,
    private soilService: SoilService,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    this.loadCrops();
  }

  /**
   * Cargar la lista de cultivos.
   */
  loadCrops(): void {
    this.cropService.getCropsByFarmer().subscribe({
      next: (cropsData) => {
        this.crops = cropsData;
        if (this.crops.length > 0) {
          this.selectedCropId = this.crops[0].id;
          this.loadSoilAndWeatherData();
        }
      },
      error: (error) => {
        console.error('Error loading crops:', error);
        this.statusMessage = 'Failed to load crops.';
      },
    });
  }

  /**
   * Cargar datos de suelo y clima para el cultivo seleccionado.
   */
  loadSoilAndWeatherData(): void {
    if (!this.selectedCropId) {
      this.statusMessage = 'Please select a crop.';
      return;
    }

    
    this.soilService.getLastSoilReportByCrop(this.selectedCropId).subscribe({
      next: (analysis) => {
        this.lastSoilAnalysis = analysis;
      },
      error: (error) => {
        console.error('Error fetching soil report:', error);
        this.statusMessage = 'Failed to fetch soil report.';
      },
    });

    
    this.weatherService.getLastWeatherReportByCrop(this.selectedCropId).subscribe({
      next: (report) => {
        this.lastWeatherReport = report;
      },
      error: (error) => {
        console.error('Error fetching weather report:', error);
        this.statusMessage = 'Failed to fetch weather report.';
      },
    });
  }

  /**
   * Cambiar el estado de riego del cultivo seleccionado.
   */
  irrigateCrop(): void {
    if (!this.selectedCropId) {
      this.statusMessage = 'Please select a crop.';
      return;
    }

    this.irrigationService
      .irrigateCrop(this.selectedCropId, true)
      .subscribe({
        next: (response) => {
          this.showTemporaryMessage(response);
        },
        error: (error) => {
          console.error('Error updating irrigation status:', error);
          this.showTemporaryMessage('Failed to update irrigation status.');
        },
      });
  }

  /**
   * Mostrar un mensaje temporal debajo del botón.
   */
  showTemporaryMessage(message: string): void {
    this.statusMessage = message;
    setTimeout(() => {
      this.statusMessage = null;
    }, 5000); 
  }
}
