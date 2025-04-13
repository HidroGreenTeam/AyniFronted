import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../iam/services/authentication.service';
import { FarmerService } from '../../services/farmer.service';
import { UserStateService } from '../../../shared/services/user-state.service';
import { switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Farmer } from '../../model/farmer';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export default class ProfileComponent implements OnInit {
  farmer = new Farmer();
  newImageFile: File | null = null;
  tempImageUrl: string | ArrayBuffer | null = '';
  isLoading = false;
  editMode = false;

  constructor(
    private farmerService: FarmerService,
    private userState: UserStateService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.authenticationService.currentUserId.subscribe((id) => id && this.loadFarmerDetails(id));
  }

  private loadFarmerDetails(id: number): void {
    this.isLoading = true;
    this.farmerService.getById(id).subscribe({
      next: (data) => {
        this.farmer = data;
        this.userState.updateUser(data.username, data.imageUrl);
        this.isLoading = false;
      },
      error: () => {
         this.isLoading = false;
      },
    });
  }

  updateFarmer(): void {
    this.isLoading = true;
    const updateObservable = this.newImageFile
      ? this.uploadImageAndSaveProfile()
      : this.farmerService.update(this.farmer.id, this.farmer);

    updateObservable.subscribe({
      next: () => {
        this.userState.updateUser(this.farmer.username, this.farmer.imageUrl);
        this.editMode = false;
        this.resetImageState();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  private uploadImageAndSaveProfile() {
    const formData = new FormData();
    formData.append('file', this.newImageFile as File);
    return this.farmerService.updateFarmerImage(this.farmer.id, formData).pipe(
      switchMap((response) => {
        this.farmer.imageUrl = response.imageUrl;
        return this.farmerService.update(this.farmer.id, this.farmer);
      })
    );
  }

  updateImage(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.addEventListener('change', (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.newImageFile = file;
        const reader = new FileReader();
        reader.onload = () => (this.tempImageUrl = reader.result);
        reader.readAsDataURL(file);
      }
    });
    fileInput.click();
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
   
    if (!this.editMode) this.resetImageState();
  }

  private resetImageState(): void {
    this.tempImageUrl = '';
    this.newImageFile = null;
  }

}
