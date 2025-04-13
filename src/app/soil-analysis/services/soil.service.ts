import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Analysis } from '../model/soil';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SoilService extends BaseService<Analysis> {
  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/soilReport';
  }

  getSoilReportsByCrop(cropId: number): Observable<Analysis[]> {
    this.resourceEndpoint = '/soilReport';
    return this.http.get<Analysis[]>(
      `${this.resourcePath()}/${cropId}`,
      this.httpOptions
    );
  }

  getLastSoilReportByCrop(cropId: number): Observable<Analysis> {
    this.resourceEndpoint = '/soilReport';
    return this.http.get<Analysis>(
      `${this.resourcePath()}/last/${cropId}`,
      this.httpOptions
    );
  }

  requestSoilAnalysis(deviceCode: string): Observable<string> {
  
    this.resourceEndpoint = '/soil_analysis';
    console.log(this.resourcePath()); 

    return this.http.post<string>(
      `${this.resourcePath()}/analyze`,
      {deviceCode},
      { ...this.httpOptions, responseType: 'text' as 'json' }
    );
  }

}
