import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Device } from '../../models/device';
import { CropService } from '../../../crops/services/crop.service';
import { DeviceService } from '../../services/device.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Crop } from '../../../crops/model/crop';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css'],
})
export default class DevicesComponent implements OnInit {
  device: Device | null = null;
  devices: Device[] = [];
  crops: Crop[] = [];
  deviceCodeInput: string = ''; 
  selectedCropId: number | null = null;

  
  generateDeviceMessage: string | null = null;
  connectDeviceMessage: string | null = null;

  constructor(
    private deviceService: DeviceService,
    private cropService: CropService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDevicesByFarmer();
    this.loadCrops();
  }

  loadCrops(): void {
    this.cropService.getCropsByFarmer().subscribe(
      (cropsData: Crop[]) => {
        this.crops = cropsData;
        if (this.crops.length > 0) {
          this.selectedCropId = this.crops[0].id;
        }
      },
      (error) => {
        console.error('Error loading crops:', error);
      }
    );
  }

  generateDevice(): void {
    this.deviceService.generateDeviceCode().subscribe(
      (newDevice) => {
        this.device = newDevice;
        this.deviceCodeInput = ''; 
        this.connectDeviceMessage = null;
      },
      (error) => {
        this.generateDeviceMessage = 'Error generating device.';
      }
    );
  }

  loadDevicesByFarmer(): void {
    this.deviceService.getDevicesByFarmer().subscribe(
      (devices) => {
        this.devices = devices;
      },
      (error) => {
        console.error('Error fetching devices:', error);
      }
    );
  }

  connectDeviceToCrop(): void {
    const codeToConnect = this.deviceCodeInput || this.device?.deviceCode;  

    if (codeToConnect && this.selectedCropId !== null) {
      this.deviceService
        .connectDeviceWithCrop(codeToConnect, this.selectedCropId)
        .subscribe(
          (updatedDevice) => {
            this.device = updatedDevice;
            this.connectDeviceMessage = 'Device successfully connected to the crop!';
            this.loadDevicesByFarmer(); 
          },
          (error) => {
            this.connectDeviceMessage = 'Error connecting device to crop.';
          }
        );
    } else {
      this.connectDeviceMessage = 'Please generate a device and select a crop.';
    }
  }

  copyToClipboard(text: string): void {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    this.generateDeviceMessage = 'Device code copied to clipboard!';
  }

  getName(cropId: number) {
    const crop = this.crops.find((crop) => crop.id === cropId);
    return crop ? crop.cropName : '';
  }
}
