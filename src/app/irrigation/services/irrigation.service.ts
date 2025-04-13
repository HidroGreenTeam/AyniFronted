import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Irrigation } from '../model/irrigation';

@Injectable({
  providedIn: 'root',
})
export class IrrigationService extends BaseService<Irrigation> {
  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/irrigation';
  }

  /**
   * Send an irrigation request for a specific crop.
   * @param cropId - The ID of the crop.
   * @param irrigationStatus - The new irrigation status.
   * @returns Observable<string> - Response message from the server.
   */
  irrigateCrop(cropId: number, irrigationStatus: boolean): Observable<string> {
    return this.http.post(
      `${this.resourcePath()}/irrigate-crop?cropId=${cropId}&irrigationStatus=${irrigationStatus}`,
      null,
      {
        ...this.httpOptions,
        responseType: 'text', 
      }
    ) as Observable<string>;
  }
}
