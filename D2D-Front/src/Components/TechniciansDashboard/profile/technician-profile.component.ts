import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-technician-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './technician-profile.component.html',
  styleUrl: './technician-profile.component.css'
})
export class TechnicianProfileComponent implements OnInit {
  technicianForm!: FormGroup;
  isEditing: boolean = false;
  originalData: any = {};
  
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

  technicians: any[] = [];
  currentTechnician: any = {
    fullName: 'Ahmed Hassan',
    email: 'ahmed.hassan@email.com',
    phone: '+20 123 456 7890',
    completedServices: 156,
    specialization: 'Electrical',
    experience: 8,
    hourlyRate: 120,
    technicianType: 'Senior',
    workingArea: 'Downtown Area',
    address: '123 Main Street, Downtown Area, Cairo, Egypt',
    joinDate: '2022-03-15',
    lastService: '2024-08-01',
    rating: 4.8
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.technicianForm = this.fb.group({
      fullName: [this.currentTechnician.fullName, [Validators.required]],
      email: [this.currentTechnician.email, [Validators.required, Validators.email]],
      phone: [this.currentTechnician.phone, [Validators.required]],
      completedServices: [this.currentTechnician.completedServices, [Validators.required, Validators.min(0)]],
      specialization: [this.currentTechnician.specialization, [Validators.required]],
      experience: [this.currentTechnician.experience, [Validators.required, Validators.min(0)]],
      hourlyRate: [this.currentTechnician.hourlyRate, [Validators.required, Validators.min(50)]],
      technicianType: [this.currentTechnician.technicianType, [Validators.required]],
      workingArea: [this.currentTechnician.workingArea, [Validators.required]],
      address: [this.currentTechnician.address, [Validators.required]]
    });

    // Initially disable all form controls
    this.technicianForm.disable();
  }
editOrSaveProfile() {
  if (!this.isEditing) {
    this.isEditing = true;
    Object.keys(this.technicianForm.controls).forEach(key => {
      this.technicianForm.get(key)?.enable();
    });

    Swal.fire({
      icon: 'info',
      title: 'Edit Mode Enabled',
      text: 'You can now update the technician profile.',
      confirmButtonText: 'OK'
    });
  } else {
    if (this.technicianForm.valid) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to save the changes to the profile?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, save it',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.currentTechnician = {
            ...this.currentTechnician,
            ...this.technicianForm.value
          };
          this.technicianForm.disable();
          this.isEditing = false;

          Swal.fire({
            icon: 'success',
            title: 'Profile Updated',
            text: 'The technician profile has been saved successfully.',
            confirmButtonText: 'Great!'
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Form',
        text: 'Please fill in all required fields correctly.',
        confirmButtonText: 'OK'
      });
      this.markFormGroupTouched();
    }
  }
}




  

  private markFormGroupTouched() {
    Object.keys(this.technicianForm.controls).forEach(key => {
      const control = this.technicianForm.get(key);
      control?.markAsTouched();
    });
  }

  // Utility method to check if a field has errors
  hasError(fieldName: string, errorType?: string): boolean {
    const field = this.technicianForm.get(fieldName);
    if (errorType) {
      return !!(field?.hasError(errorType) && (field?.dirty || field?.touched));
    }
    return !!(field?.invalid && (field?.dirty || field?.touched));
  }

  // Method to get error message for a field
  getErrorMessage(fieldName: string): string {
    const field = this.technicianForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field?.hasError('min')) {
      return `${fieldName} must be at least ${field.errors?.['min'].min}`;
    }
    return '';
  }
}