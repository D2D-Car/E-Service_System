import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface TechnicianProfile {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  specialization: string;
  experience: number;
  workingArea: string;
  completedServices: number;
  avatar: string;
  joinDate: string;
  lastService: string;
  technicianType: 'Junior' | 'Senior' | 'Expert';
  hourlyRate: number;
  rating: number;
  certifications: string[];
}

@Component({
  selector: 'app-technician-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './technician-profile.component.html',
  styleUrl: './technician-profile.component.css'
})
export class TechnicianProfileComponent implements OnInit {
  technicianForm!: FormGroup;
  years: number[] = [];
  specializations: string[] = [
    'Engine Repair',
    'Transmission',
    'Brake System',
    'Electrical System',
    'Air Conditioning',
    'Body Work',
    'Paint & Detailing',
    'Tire Services',
    'Oil Change',
    'General Maintenance'
  ];

  technicians: TechnicianProfile[] = [
    {
      id: 1,
      fullName: 'Ahmed Hassan',
      email: 'ahmed.hassan@carservice.com',
      phone: '+20 100 123 4567',
      address: '15 Tahrir Square, Cairo, Egypt',
      specialization: 'Engine Repair',
      experience: 8,
      workingArea: 'Downtown Area',
      completedServices: 245,
      avatar: 'assets/technicians-img/tech9.jpg',
      joinDate: '15/03/2020',
      lastService: '05/08/2025',
      technicianType: 'Senior',
      hourlyRate: 150,
      rating: 4.8,
      certifications: ['ASE Certified', 'BMW Specialist', 'Engine Expert']
    },
    {
      id: 2,
      fullName: 'Omar Mohamed',
      email: 'omar.mohamed@carservice.com',
      phone: '+20 101 234 5678',
      address: '25 Nasr City, Cairo, Egypt',
      specialization: 'Electrical System',
      experience: 12,
      workingArea: 'East District',
      completedServices: 380,
      avatar: 'assets/technicians-img/tech3.jpg',
      joinDate: '10/01/2018',
      lastService: '04/08/2025',
      technicianType: 'Expert',
      hourlyRate: 200,
      rating: 4.9,
      certifications: ['Master Technician', 'Electrical Specialist', 'Hybrid Expert']
    },
    {
      id: 3,
      fullName: 'Mahmoud Ali',
      email: 'mahmoud.ali@carservice.com',
      phone: '+20 102 345 6789',
      address: '30 Heliopolis, Cairo, Egypt',
      specialization: 'Brake System',
      experience: 3,
      workingArea: 'North District',
      completedServices: 95,
      avatar: 'assets\technicians-img\tech4.jpg',
      joinDate: '20/06/2022',
      lastService: '03/08/2025',
      technicianType: 'Junior',
      hourlyRate: 100,
      rating: 4.5,
      certifications: ['Brake Specialist', 'Safety Certified']
    }
  ];

  currentTechnician: TechnicianProfile = this.technicians[0];

  constructor(private fb: FormBuilder) {
    this.initializeYears();
  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeYears() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1990; year--) {
      this.years.push(year);
    }
  }

  initializeForm() {
    this.technicianForm = this.fb.group({
      fullName: [this.currentTechnician.fullName, [Validators.required, Validators.minLength(3)]],
      email: [this.currentTechnician.email, [Validators.required, Validators.email]],
      phone: [this.currentTechnician.phone, [Validators.required]],
      address: [this.currentTechnician.address],
      specialization: [this.currentTechnician.specialization, [Validators.required]],
      experience: [this.currentTechnician.experience, [Validators.required, Validators.min(0)]],
      workingArea: [this.currentTechnician.workingArea],
      completedServices: [this.currentTechnician.completedServices],
      technicianType: [this.currentTechnician.technicianType],
      hourlyRate: [this.currentTechnician.hourlyRate, [Validators.required, Validators.min(50)]],
      rating: [this.currentTechnician.rating]
    });
  }

  onSelectTechnician(technicianId: number) {
    const selected = this.technicians.find(t => t.id === technicianId);
    if (selected) {
      this.currentTechnician = selected;
      this.initializeForm();
    }
  }

  onPhotoChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.currentTechnician.avatar = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.technicianForm.valid) {
      const formData = this.technicianForm.value;
      Object.assign(this.currentTechnician, formData);
      alert('Technician profile updated successfully!');
    } else {
      alert('Please correct the errors in the form');
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.initializeForm();
    alert('Changes cancelled');
  }

  onDelete() {
    if (confirm('Are you sure you want to delete this technician?')) {
      const index = this.technicians.findIndex(t => t.id === this.currentTechnician.id);
      if (index !== -1) {
        this.technicians.splice(index, 1);
        this.currentTechnician = this.technicians[0] || {} as TechnicianProfile;
        this.initializeForm();
        alert('Technician deleted successfully!');
      }
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.technicianForm.controls).forEach(key => {
      const control = this.technicianForm.get(key);
      control?.markAsTouched();
    });
  }

  getStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    
    if (hasHalfStar) {
      stars.push('☆');
    }
    
    while (stars.length < 5) {
      stars.push('☆');
    }
    
    return stars;
  }
}