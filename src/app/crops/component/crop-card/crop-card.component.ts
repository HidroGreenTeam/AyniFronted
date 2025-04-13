import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Crop } from '../../model/crop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './crop-card.component.html',
  styleUrls: ['./crop-card.component.css'],
})
export default class CropComponent {
  @Input() crop!: Crop;
  @Input() isSelected: boolean = false;
  @Output() cropSelected = new EventEmitter<Crop>();
  @Output() cropDeleted = new EventEmitter<number>();

  selectCrop() {
    this.cropSelected.emit(this.crop);
  }

  deleteCrop(event: Event, cropId: number) {
    event.stopPropagation();
    this.cropDeleted.emit(cropId);
  }

  calculateCropAge(plantingDate: Date): string {
    const today = new Date();
    const ageInDays = Math.floor(
      (today.getTime() - new Date(plantingDate).getTime()) / (1000 * 3600 * 24),
    );
    return `${ageInDays} days`;
  }
}
