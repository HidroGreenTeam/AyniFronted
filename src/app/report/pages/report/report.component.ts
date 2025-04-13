import { Component, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  NgApexchartsModule,
} from 'ng-apexcharts';

import { Crop } from '../../../crops/model/crop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CropService } from '../../../crops/services/crop.service';
import { Analysis } from '../../../soil-analysis/model/soil';
import { Weather } from '../../../soil-analysis/model/weather';
import { SoilService } from '../../../soil-analysis/services/soil.service';
import { WeatherService } from '../../../soil-analysis/services/weather.service';

export type LineChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, FormsModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export default class ReportComponent implements OnInit {
  crops: Crop[] = [];
  selectedCropId: number | null = null; 
  soilReports: Analysis[] = [];
  weatherReports: Weather[] = [];
  soilChartOptions: Partial<LineChartOptions> | null = null;
  weatherChartOptions: Partial<LineChartOptions> | null = null;

  constructor(
    private cropService: CropService,
    private weatherService: WeatherService,
    private soilService: SoilService
  ) {}

  ngOnInit(): void {
    this.loadCrops();
  }

  /**
   * Cargar los cultivos disponibles.
   */
  loadCrops(): void {
    this.cropService.getCropsByFarmer().subscribe({
      next: (cropsData) => {
        this.crops = cropsData;
        if (this.crops.length > 0) {
          this.selectedCropId = this.crops[0].id; 
          this.updateReports();
        }
      },
      error: (error) => {
        console.error('Error loading crops:', error);
      },
    });
  }

  /**
   * Cargar los reportes de suelo y clima para el cultivo seleccionado.
   */
  updateReports(): void {
    if (!this.selectedCropId) return;

    this.loadSoilReports();
    this.loadWeatherReports();
  }

  /**
   * Cargar los reportes de suelo.
   */
  loadSoilReports(): void {
    this.soilService.getSoilReportsByCrop(this.selectedCropId!).subscribe({
      next: (reports) => {
        this.soilReports = reports;
        this.soilChartOptions = {
          series: [
            {
              name: 'Nitrogen',
              data: reports.map((r) => r.nitrogen),
            },
            {
              name: 'Phosphorus',
              data: reports.map((r) => r.phosphorus),
            },
            {
              name: 'Potassium',
              data: reports.map((r) => r.potassium),
            },
          ],
          chart: {
            type: 'line',
            height: 350,
          },
          xaxis: {
            categories: reports.map((r) => new Date(r.date).toLocaleDateString()),
            title: { text: 'Date' },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: 'smooth',
          },
          title: {
            text: 'Soil Analysis Over Time',
            align: 'center',
          },
        };
      },
      error: (error) => {
        console.error('Error fetching soil reports:', error);
      },
    });
  }

  /**
   * Cargar los reportes climáticos.
   */
  loadWeatherReports(): void {
    this.weatherService.getWeatherReportsByCrop(this.selectedCropId!).subscribe({
      next: (reports) => {
        this.weatherReports = reports;
        this.weatherChartOptions = {
          series: [
            {
              name: 'Temperature',
              data: reports.map((r) => r.temperature),
            },
            {
              name: 'Humidity',
              data: reports.map((r) => r.humidity),
            },
          ],
          chart: {
            type: 'line',
            height: 350,
          },
          xaxis: {
            categories: reports.map((r) => new Date(r.date).toLocaleDateString()),
            title: { text: 'Date' },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: 'smooth',
          },
          title: {
            text: 'Weather Data Over Time',
            align: 'center',
          },
        };
      },
      error: (error) => {
        console.error('Error fetching weather reports:', error);
      },
    });
  }
}
