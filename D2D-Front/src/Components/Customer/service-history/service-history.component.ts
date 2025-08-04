import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-service-history',
  templateUrl: './service-history.component.html',
  styleUrls: ['./service-history.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ServiceHistoryComponent implements OnInit {
  services = [
    {
      title: 'Oil Change & Filter Replacement',
      status: 'Completed',
      price: 65,
      rating: 5,
      date: 'December 10, 2023',
      technician: 'Ahmed Hassan',
      vehicle: 'Toyota Camry',
      notes: 'Synthetic oil change with premium filter. Engine running smoothly, oil level perfect.',
      type: 'oil-change',
      vehicleKey: 'toyota-camry',
    },
    {
      title: 'Brake Pad Replacement',
      status: 'Completed',
      price: 220,
      rating: 4,
      date: 'November 28, 2023',
      technician: 'Mohammed Ali',
      vehicle: 'Honda CR-V',
      notes: 'Front brake pads replaced, rotors resurfaced. Braking performance significantly improved.',
      type: 'brake-service',
      vehicleKey: 'honda-crv',
    },
    {
      title: 'Tire Rotation & Balance',
      status: 'Completed',
      price: 85,
      rating: 5,
      date: 'November 15, 2023',
      technician: 'Sarah Wilson',
      vehicle: 'Toyota Camry',
      notes: 'Professional service, completed on time. All tires rotated and balanced, pressure adjusted to manufacturer specs.',
      type: 'tire-service',
      vehicleKey: 'toyota-camry',
    },
    {
      title: 'Transmission Fluid Change',
      status: 'Completed',
      price: 180,
      rating: 5,
      date: 'September 18, 2023',
      technician: 'Jennifer Adams',
      vehicle: 'Ford F-150',
      notes: 'Complete transmission flush and filter replacement. Fluid was due for change, now shifting much smoother.',
      type: 'transmission',
      vehicleKey: 'ford-f150',
    },
    {
      title: 'Air Conditioning Service',
      status: 'Completed',
      price: 120,
      rating: 4,
      date: 'August 30, 2023',
      technician: 'David Brown',
      vehicle: 'BMW X3',
      notes: 'AC system cleaned and recharged. Coolant levels checked, system working perfectly.',
      type: 'ac-service',
      vehicleKey: 'bmw-x3',
    }
  ];

  constructor() {}

  ngOnInit(): void {}
}
