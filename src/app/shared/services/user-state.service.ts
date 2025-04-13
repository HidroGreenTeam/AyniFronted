import { Injectable, OnInit, signal, WritableSignal } from '@angular/core';
import { FarmerService } from '../../profile/services/farmer.service';

@Injectable({
  providedIn: 'root'
})
export class UserStateService{

  readonly username = signal<string>(''); 
  readonly userImage = signal<string>(
    ''
  ); 


  constructor(private farmerService: FarmerService) {}
  
  loadUserData(userId: number): void {
    if (userId) {
      this.farmerService.getById(userId).subscribe({
        next: (data) => {
          this.updateUser(data.username, data.imageUrl);
        },
        error: () => {
          console.error('Error loading user data');
        },
      });
    }
  }


  updateUser(username: string, imageUrl: string): void {
    this.username.set(username);
    this.userImage.set(imageUrl); 
  }
}