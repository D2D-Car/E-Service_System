import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-technicians',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './technicians.component.html',
  styleUrl: './technicians.component.css',
})
export class TechniciansComponent implements OnInit {
  isNavbarCollapsed = true;
  selectedStatus = 'All';

  allTechnicians = [
    {
      id: 1,
      name: 'Mohamed Hassan',
      specialty: 'Engine Repair',
      certification: 'ASE Certified',
      image: './assets/technicians-img/tech1.jpg',
      joined: '2021-08-15',
      experience: '8 Years',
      status: 'Available',
      rating: 4.9,
      completedJobs: 450,
    },
    {
      id: 2,
      name: 'Ahmed Farouk',
      specialty: 'Brake Service',
      certification: 'Master Tech',
      image: './assets/technicians-img/tech2.jpg',
      joined: '2021-03-22',
      experience: '6 Years',
      status: 'Busy',
      rating: 4.7,
      completedJobs: 380,
    },
    {
      id: 3,
      name: 'Omar El-Sayed',
      specialty: 'Transmission',
      certification: 'Certified Tech',
      image: './assets/technicians-img/tech3.jpg',
      joined: '2021-11-10',
      experience: '5 Years',
      status: 'Available',
      rating: 4.8,
      completedJobs: 320,
    },
    {
      id: 4,
      name: 'Youssef Mahmoud',
      specialty: 'Electrical',
      certification: 'Master Tech',
      image: './assets/technicians-img/tech4.jpg',
      joined: '2022-07-08',
      experience: '4 Years',
      status: 'On Break',
      rating: 4.6,
      completedJobs: 280,
    },
    {
      id: 5,
      name: 'Khaled Ibrahim',
      specialty: 'Suspension',
      certification: 'ASE Certified',
      image: './assets/technicians-img/tech5.jpg',
      joined: '2021-05-22',
      experience: '7 Years',
      status: 'Available',
      rating: 4.9,
      completedJobs: 420,
    },
    {
      id: 6,
      name: 'Mahmoud Ali',
      specialty: 'AC Repair',
      certification: 'Certified Tech',
      image: './assets/technicians-img/tech6.jpg',
      joined: '2022-03-22',
      experience: '3 Years',
      status: 'Busy',
      rating: 4.5,
      completedJobs: 190,
    },
    {
      id: 7,
      name: 'Hassan Nasser',
      specialty: 'Tire Service',
      certification: 'Master Tech',
      image: './assets/technicians-img/tech7.jpg',
      joined: '2022-11-10',
      experience: '2 Years',
      status: 'Available',
      rating: 4.4,
      completedJobs: 150,
    },
    {
      id: 8,
      name: 'Ali Mostafa',
      specialty: 'Body Work',
      certification: 'Certified Tech',
      image: './assets/technicians-img/tech8.jpg',
      joined: '2022-07-08',
      experience: '3 Years',
      status: 'On Break',
      rating: 4.6,
      completedJobs: 210,
    },
  ];

  technicians = [...this.allTechnicians]; // initialize with full list

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  ngOnInit(): void {
    this.setTheme();
  }


  filterTrips(status: string): void {
    this.selectedStatus = status;

    if (status === 'All') {
      this.technicians = [...this.allTechnicians];
    } else {
      this.technicians = this.allTechnicians.filter(
        tech => tech.status.toLowerCase() === status.toLowerCase()
      );
    }
  }

  callTechnician(tech: any) {
    console.log('Viewing certification for technician:', tech.name);
    alert(`${tech.name} - ${tech.certification} in ${tech.specialty}`);
  }

  emailTechnician(tech: any) {
    console.log('Viewing jobs for technician:', tech.name);
    alert(
      `${tech.name} completed ${tech.completedJobs} jobs with ${tech.rating}⭐ rating`
    );
  }

  viewTechnicianProfile(tech: any) {
    console.log('Viewing profile for:', tech.name);
  }

  removeTechnician(tech: any) {
    const confirmRemove = confirm(
      `Are you sure you want to remove ${tech.name}?`
    );
    if (confirmRemove) {
      this.allTechnicians = this.allTechnicians.filter(t => t.id !== tech.id);
      this.filterTrips(this.selectedStatus);
    }
  }

  setTheme(): void {
    const theme = localStorage.getItem('theme') || 'light';
    const body = document.body;
    body.classList.remove('dark-theme', 'light-theme');
    body.classList.add(`${theme}-theme`);
  }
}

