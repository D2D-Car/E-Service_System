import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
})
export class CustomersComponent {
  customers = [
  {
    name: 'Alice Smith',
    email: 'alice@gmail.com',
    phone: '01012345678',
    joined: '2022-03-10',
    image: './assets/customers-img/customer1.jpg'
  },
  {
    name: 'Bob Johnson',
    email: 'bob@gmail.com',
    phone: '01087654321',
    joined: '2023-07-22',
    image: './assets/customers-img/customer2.jpg'
  },
  {
  name: 'Kareem Fouad',
  phone: '0119988776',
  email: 'kareem.fouad@example.com',
  address: '10 El-Salam St, Tanta',
  joined: '2023-05-22',
  image: './assets/customers-img/customer3.jpeg'
 }
];
}
