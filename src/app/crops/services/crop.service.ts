import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Crop } from '../model/crop';
import { BaseService } from '../../shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../../iam/services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class CropService extends BaseService<Crop> {
  override farmerId: number | null = null;

  constructor(
    http: HttpClient,
    private authenticationService: AuthenticationService,
  ) {
    super(http);
    this.resourceEndpoint = '/crops';
  }

  getCropsByFarmer(): Observable<Crop[]> {
    this.authenticationService.currentUserId.subscribe((id: number) => {
      this.farmerId = id;
    });
    const customPath = `farmer/${this.farmerId}/crops`;
    return this.getByCustomPath(customPath);
  }
}
