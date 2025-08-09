import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class CustomerProfileComponent implements OnInit {
  customerForm!: FormGroup;
  isEditing: boolean = false;
  years: number[] = [];

  customers: any[] = [];
  currentCustomer: any = {
    fullName: 'Mohamed Reda',
    email: 'mohamedreda32@email.com',
    phone: '+20 575 767 9879',
    completedServices: 8,
    specialization: 'BMW',
    experience: 'X5',  // car model
    hourlyRate: 2020,  // car year
    technicianType: 'Premium',
    address: '123 Main Street, Downtown Area, Cairo, Egypt'
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.customerForm = this.fb.group({
      fullName: [this.currentCustomer.fullName, [Validators.required]],
      email: [this.currentCustomer.email, [Validators.required, Validators.email]],
      phone: [this.currentCustomer.phone, [Validators.required]],
      completedServices: [{value: this.currentCustomer.completedServices, disabled: true}], // readonly
      specialization: [this.currentCustomer.specialization, [Validators.required]],  // car brand
      experience: [this.currentCustomer.experience, [Validators.required]],  // car model
      hourlyRate: [this.currentCustomer.hourlyRate, [Validators.required, Validators.min(1900)]], // car year with min validation
      technicianType: [this.currentCustomer.technicianType, [Validators.required]],  // customer type
      address: [this.currentCustomer.address, [Validators.required]]
    });

    this.customerForm.disable();  // disable all initially
  }

  toggleEdit() {
    if (!this.isEditing) {
      this.isEditing = true;
      this.customerForm.enable();
      this.customerForm.get('completedServices')?.disable(); // keep readonly

      Swal.fire({
        icon: 'info',
        title: 'Edit Mode Enabled',
        text: 'You can now update your profile.',
        confirmButtonText: 'OK'
      });
    } else {
      if (this.customerForm.valid) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to save the changes?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, save it',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.currentCustomer = { ...this.customerForm.getRawValue() };
            this.customerForm.disable();
            this.isEditing = false;

            Swal.fire({
              icon: 'success',
              title: 'Saved!',
              text: 'Your profile has been updated.',
              timer: 1500,
              showConfirmButton: false
            });
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Form',
          text: 'Please fill all required fields correctly before saving.'
        });
        this.markAllTouched();
      }
    }
  }

  private markAllTouched() {
    Object.keys(this.customerForm.controls).forEach(key => {
      const control = this.customerForm.get(key);
      control?.markAsTouched();
    });
  }

  // Optional helper methods for validation errors

  hasError(fieldName: string, errorType?: string): boolean {
    const field = this.customerForm.get(fieldName);
    if (errorType) {
      return !!(field?.hasError(errorType) && (field?.dirty || field?.touched));
    }
    return !!(field?.invalid && (field?.dirty || field?.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.customerForm.get(fieldName);
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
