import { Injectable } from '@angular/core';
import { Device } from '../models/device';
import { BaseService } from '../../shared/services/base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { AuthenticationService } from '../../iam/services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class DeviceService extends BaseService<Device> {
  constructor(http: HttpClient, 
    private authenticationService: AuthenticationService) {
    super(http);
    this.resourceEndpoint = '/devices';
  }


  generateDeviceCode(): Observable<Device> {

    return this.http.post<Device>( `${this.resourcePath()}/generate`, {}, this.httpOptions);
  }

  connectDeviceWithCrop(deviceCode: string, cropId: number): Observable<Device> {

    return this.http.patch<Device>(`${this.resourcePath()}/${deviceCode}/connect/crops/${cropId}`, {}, this.httpOptions);
  }

  getDevicesByCrop(cropId: number): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.resourcePath()}/crop/${cropId}`, this.httpOptions);
  }

  getDevicesByFarmer(): Observable<Device[]> {
    return this.authenticationService.currentUserId.pipe(
      switchMap(userId => 
        this.http.get<Device[]>(`${this.resourcePath()}/farmer/${userId}`, this.httpOptions)
      )
    );
  }

}
