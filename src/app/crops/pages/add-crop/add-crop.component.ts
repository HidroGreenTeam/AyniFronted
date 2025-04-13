import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CropService } from '../../services/crop.service';
import { Crop } from '../../model/crop';
import { AuthenticationService } from '../../../iam/services/authentication.service';

@Component({
  selector: 'app-add-crop',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './add-crop.component.html',
  styleUrls: ['./add-crop.component.css'],
})
export default class AddCropComponent {
  @ViewChild('cropForm', { static: false }) cropForm!: NgForm;
  crop: Crop = new Crop();
  selectedFile: File | null = null;

  constructor(
    private router: Router,
    private cropService: CropService,
    private authService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.authService.currentUserId.subscribe((id) => (this.crop.farmerId = id));
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.cropForm.form.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append(
        'crop',
        new Blob([JSON.stringify(this.crop)], { type: 'application/json' }),
      );
      formData.append('file', this.selectedFile);

      
      this.cropService.createWithFile(formData).subscribe(
        () => {
          console.log('Crop added:', this.crop);
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('Error adding crop:', error);
        },
      );
    } else {
      console.error('Datos inválidos o no se ha seleccionado una imagen');
    }
  }
}
