import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drivers.component.html',
  styleUrl: './drivers.component.css',
})
export class DriversComponent {
  drivers = [
    {
      id: 1,
      name: 'Mahmoud Reda',
      licenseNumber: 'EG-DL-123456',
      experience: '5 Years',
      image: './assets/dashboard-img/friend-01.jpg',
      joined: 'Jan 2022',
      rating: 4.8,
      totalTrips: 1250,
      vehicleType: 'Sedan',
    },
    {
      id: 2,
      name: 'Omar Khaled',
      licenseNumber: 'EG-DL-789012',
      experience: '3 Years',
      image: './assets/dashboard-img/friend-02.jpg',
      joined: 'May 2023',
      rating: 4.6,
      totalTrips: 890,
      vehicleType: 'SUV',
    },
    {
      id: 3,
      name: 'Hassan Ali',
      licenseNumber: 'EG-DL-345678',
      experience: '7 Years',
      image: './assets/dashboard-img/friend-03.jpg',
      joined: 'Aug 2021',
      rating: 4.9,
      totalTrips: 2100,
      vehicleType: 'Pickup',
    },
    {
      id: 4,
      name: 'Ahmed Nasser',
      licenseNumber: 'EG-DL-901234',
      experience: '2 Years',
      image: './assets/dashboard-img/friend-04.jpg',
      joined: 'Oct 2023',
      rating: 4.4,
      totalTrips: 520,
      vehicleType: 'Sedan',
    },
    {
      id: 5,
      name: 'Youssef Ibrahim',
      licenseNumber: 'EG-DL-567890',
      experience: '4 Years',
      image: './assets/dashboard-img/friend-05.jpg',
      joined: 'Dec 2022',
      rating: 4.7,
      totalTrips: 950,
      vehicleType: 'Van',
    },
    {
      id: 6,
      name: 'Karim Fouad',
      licenseNumber: 'EG-DL-234567',
      experience: '6 Years',
      image: './assets/dashboard-img/friend-01.jpg',
      joined: 'Mar 2021',
      rating: 4.8,
      totalTrips: 1680,
      vehicleType: 'SUV',
    },
    {
      id: 7,
      name: 'Tamer Said',
      licenseNumber: 'EG-DL-678901',
      experience: '8 Years',
      image: './assets/dashboard-img/friend-02.jpg',
      joined: 'Jun 2020',
      rating: 5.0,
      totalTrips: 2850,
      vehicleType: 'Pickup',
    },
    {
      id: 8,
      name: 'Mostafa Ahmed',
      licenseNumber: 'EG-DL-012345',
      experience: '3 Years',
      image: './assets/dashboard-img/friend-03.jpg',
      joined: 'Sep 2023',
      rating: 4.5,
      totalTrips: 720,
      vehicleType: 'Sedan',
    },
  ];

  callDriver(driver: any) {
    console.log('Viewing license for driver:', driver.name);
    alert(`License: ${driver.licenseNumber} - ${driver.experience} experience`);
  }

  emailDriver(driver: any) {
    console.log('Viewing trips for driver:', driver.name);
    alert(
      `${driver.name} has completed ${driver.totalTrips} trips with ${driver.rating}⭐ rating`
    );
  }

  viewDriverProfile(driver: any) {
    console.log('Viewing profile of driver:', driver.name);
    // Add navigation logic here
  }

  removeDriver(driver: any) {
    const confirmRemove = confirm(
      `Are you sure you want to remove ${driver.name}?`
    );
    if (confirmRemove) {
      this.drivers = this.drivers.filter((d) => d.id !== driver.id);
      console.log('Driver removed:', driver.name);
    }
  }
}
