import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Vehicle {
  id: number;
  name: string;
  year: number;
  color: string;
  plateNumber: string;
  currentMileage: string;
  nextServiceDue: string;
  image: string;
}

@Component({
  selector: 'app-vehicles',
  imports: [CommonModule],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css',
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
    },
  ];

  // TrackBy function for performance optimization
  trackByVehicleId(index: number, vehicle: Vehicle): number {
    return vehicle.id;
  }
}
