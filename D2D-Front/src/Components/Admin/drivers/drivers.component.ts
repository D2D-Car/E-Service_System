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
    name: 'Ahmed Salem',
    phone: '0105551234',
    email: 'ahmed.salem@gmail.com',
    vehicle: 'Toyota Corolla',
    license: 'DR-4587',
    joined: '2021-11-15',
    image: './assets/drivers-img/driver1.jpg'
  },
  {
    name: 'Mona Ehab',
    phone: '0109998765',
    email: 'mona.ehab@gmail.com',
    vehicle: 'Hyundai Elantra',
    license: 'DR-8890',
    joined: '2022-06-01',
    image: './assets/drivers-img/driver2.jpg'
  },
  {
  name: 'Nadia Hassan',
  phone: '0102244668',
  email: 'nadia.hassan@example.com',
  vehicle: 'Kia Sportage',
  license: 'DR-9981',
  joined: '2022-09-18',
  image: './assets/drivers-img/driver3.jpg'
  }
];
}
