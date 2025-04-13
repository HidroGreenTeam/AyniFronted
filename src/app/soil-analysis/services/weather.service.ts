import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Weather } from '../model/weather';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService extends BaseService<Weather> {
  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/weatherReport';
  }

  
  getWeatherReportsByCrop(cropId: number): Observable<Weather[]> {
    return this.http.get<Weather[]>(`${this.resourcePath()}/${cropId}`, this.httpOptions);
  }

  getLastWeatherReportByCrop(cropId: number): Observable<Weather> {
    return this.http.get<Weather>(`${this.resourcePath()}/last/${cropId}`, this.httpOptions);
  }


}
  