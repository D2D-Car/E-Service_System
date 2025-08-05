import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-technicians',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './technicians.component.html',
  styleUrls: ['./technicians.component.css']
})
export class TechniciansComponent {
  
   technicians = [
    {
      name: 'John Doe',
      experience: 7,
      specialty: 'Brake Repair',
      rating: 4,
image: 'assets/technicians-img/tech1.jpg' 
   },
    {
      name: 'Karl Lee',
      experience: 10,
      specialty: 'Transmission Fixing',
      rating: 5,
image: 'assets/technicians-img/tech2.jpg' 
    },
    {
      name: 'Mike Ross',
      experience: 5,
      specialty: 'Suspension & Alignment',
      rating: 3,
image: 'assets/technicians-img/tech3.jpg' 
    },
    {
      name: 'Ethan Brown',
      experience: 8,
      specialty: 'Engine Diagnostics',
      rating: 4,
image: 'assets/technicians-img/tech4.jpg' 
    },
    {
      name: 'Logan Wilson',
      experience: 6,
      specialty: 'AC Repair',
      rating: 5,
image: 'assets/technicians-img/tech5.jpg' 
    },
    {
      name: 'Liam Johnson',
      experience: 9,
      specialty: 'Electrical Systems',
      rating: 4,
image: 'assets/technicians-img/tech6.jpg' 
    }
  ];

  visibleCount = 3;

  showMore() {
    this.visibleCount = this.technicians.length;
  }

  showLess() {
    this.visibleCount = 3;
  }
}