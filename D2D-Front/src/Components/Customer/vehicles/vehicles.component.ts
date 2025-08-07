import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Vehicle {
  id: number;
  name: string;
  year: number;
  color: string;
  plateNumber: string;
  currentMileage: string;
  nextServiceDue: string;
  image: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-vehicles',
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css'], // fix typo here: styleUrl => styleUrls
})
export class VehiclesComponent {
  vehicles: Vehicle[] = [
    {
      id: 1,
      name: 'Dodge',
      year: 2021,
      color: 'Dark',
      plateNumber: 'ABC-123',
      currentMileage: '45,000',
      nextServiceDue: 'Oil Change (500 miles)',
      image: './assets/vehicles-img/Dodge.jpeg',
      email: 'dodge.owner@email.com',
      password: 'dodge123',
    },
    {
      id: 2,
      name: 'Jeep Renegade',
      year: 2022,
      color: 'Blue',
      plateNumber: 'FGH-652',
      currentMileage: '41,200',
      nextServiceDue: 'Battery Check (800 miles)',
      image: './assets/vehicles-img/jeep.jpeg',
      email: 'jeep.owner@email.com',
      password: 'jeep456',
    },
    {
      id: 3,
      name: 'BMW x6',
      year: 2024,
      color: 'Gray',
      plateNumber: 'XYZ-789',
      currentMileage: '38,000',
      nextServiceDue: 'Oil Change (500 miles)',
      image: './assets/vehicles-img/BMW_x6.jpeg',
      email: 'bmw.owner@email.com',
      password: 'bmw789',
    },
  ];

  // Modal state
  showAddVehicleModal = false;
  imagePreview: string | null = null;
  selectedImageFile: File | null = null;

  // Flag for add or edit mode
  isEditMode = false;

  // The vehicle being edited (null if adding)
  editingVehicleId: number | null = null;

  // Form model
  newVehicle: Omit<Vehicle, 'id'> = this.getEmptyVehicle();

  trackByVehicleId(index: number, vehicle: Vehicle): number {
    return vehicle.id;
  }

  // Utility to get empty vehicle model
  getEmptyVehicle(): Omit<Vehicle, 'id'> {
    return {
      name: '',
      year: 2024,
      color: '',
      plateNumber: '',
      currentMileage: '',
      nextServiceDue: 'Oil Change (3,000 miles)',
      image: '',
      email: '',
      password: '',
    };
  }

  // Open modal for adding vehicle
  openAddVehicleModal(): void {
    this.isEditMode = false;
    this.editingVehicleId = null;
    this.newVehicle = this.getEmptyVehicle();
    this.imagePreview = null;
    this.selectedImageFile = null;
    this.showAddVehicleModal = true;
  }

  // Open modal for editing vehicle
  editVehicle(vehicle: Vehicle): void {
    this.isEditMode = true;
    this.editingVehicleId = vehicle.id;

    // Copy vehicle data to form (except id)
    this.newVehicle = {
      name: vehicle.name,
      year: vehicle.year,
      color: vehicle.color,
      plateNumber: vehicle.plateNumber,
      currentMileage: vehicle.currentMileage,
      nextServiceDue: vehicle.nextServiceDue,
      image: vehicle.image,
      email: vehicle.email,
      password: vehicle.password,
    };
    this.imagePreview = vehicle.image;
    this.selectedImageFile = null;

    this.showAddVehicleModal = true;
  }

  // Close modal
  closeAddVehicleModal(): void {
    this.showAddVehicleModal = false;
  }

  // Add or Update vehicle on form submit
  submitVehicle(): void {
    if (!this.isFormValid()) return;

    if (this.isEditMode && this.editingVehicleId !== null) {
      // Update existing vehicle
      const index = this.vehicles.findIndex(v => v.id === this.editingVehicleId);
      if (index !== -1) {
        this.vehicles[index] = {
          id: this.editingVehicleId,
          ...this.newVehicle,
          image: this.imagePreview || './assets/vehicles-img/default-car.jpg'
        };
        console.log('Vehicle updated:', this.vehicles[index]);
      }
    } else {
      // Add new vehicle
      const newId = Math.max(...this.vehicles.map(v => v.id), 0) + 1;
      const vehicle: Vehicle = {
        id: newId,
        ...this.newVehicle,
        image: this.imagePreview || './assets/vehicles-img/default-car.jpg'
      };
      this.vehicles.push(vehicle);
      console.log('Vehicle added:', vehicle);
    }

    this.closeAddVehicleModal();
  }

  // Confirm and delete vehicle
  confirmDelete(vehicleId: number): void {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.deleteVehicle(vehicleId);
    }
  }

  private deleteVehicle(vehicleId: number): void {
    this.vehicles = this.vehicles.filter(v => v.id !== vehicleId);
    console.log('Vehicle deleted:', vehicleId);
  }

  // Image file selection handler
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImageFile = input.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
        this.newVehicle.image = this.imagePreview;
      };
      reader.readAsDataURL(this.selectedImageFile);
    }
  }

  // Trigger file input click
  triggerFileInput(): void {
    const fileInput = document.getElementById('vehicleImage') as HTMLInputElement;
    fileInput?.click();
  }

  // Form validation
  private isFormValid(): boolean {
    return !!(
      this.newVehicle.name.trim() &&
      this.newVehicle.year &&
      this.newVehicle.color.trim() &&
      this.newVehicle.plateNumber.trim() &&
      this.newVehicle.currentMileage.trim() &&
      this.imagePreview &&
      this.newVehicle.email.trim() &&
      this.newVehicle.password.trim()
    );
  }
}
