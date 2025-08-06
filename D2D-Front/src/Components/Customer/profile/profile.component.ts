import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface CustomerProfile {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  carBrand: string;
  carModel: string;
  carYear: number;
  serviceArea: string;
  totalServices: number;
  avatar: string;
  joinDate: string;
  lastService: string;
  customerType: 'Regular' | 'Premium' | 'VIP';
}

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class CustomerProfileComponent implements OnInit {
  customerForm!: FormGroup;
  years: number[] = [];

  customers: CustomerProfile[] = [
    {
      id: 1,
      fullName: 'Mike Johnson',
      email: 'mike.johnson@autoworks.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main Street, Downtown Area, New York',
      carBrand: 'BMW',
      carModel: 'X5',
      carYear: 2020,
      serviceArea: 'Downtown Area',
      totalServices: 8,
      avatar: 'assets/customers-img/customer1.jpg',
      joinDate: '10/02/2021',
      lastService: '01/15/2025',
      customerType: 'Premium'
    }
  
  ];

  currentCustomer: CustomerProfile = this.customers[0];

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
    this.customerForm = this.fb.group({
      fullName: [this.currentCustomer.fullName, [Validators.required, Validators.minLength(3)]],
      email: [this.currentCustomer.email, [Validators.required, Validators.email]],
      phone: [this.currentCustomer.phone, [Validators.required]],
      address: [this.currentCustomer.address],
      carBrand: [this.currentCustomer.carBrand],
      carModel: [this.currentCustomer.carModel],
      carYear: [this.currentCustomer.carYear],
      serviceArea: [this.currentCustomer.serviceArea],
      totalServices: [this.currentCustomer.totalServices],
      customerType: [this.currentCustomer.customerType]
    });
  }

  onSelectCustomer(customerId: number) {
    const selected = this.customers.find(c => c.id === customerId);
    if (selected) {
      this.currentCustomer = selected;
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
          this.currentCustomer.avatar = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.customerForm.valid) {
      const formData = this.customerForm.value;
      Object.assign(this.currentCustomer, formData);
      alert('Customer profile updated successfully!');
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
    if (confirm('Are you sure you want to delete this customer?')) {
      const index = this.customers.findIndex(c => c.id === this.currentCustomer.id);
      if (index !== -1) {
        this.customers.splice(index, 1);
        this.currentCustomer = this.customers[0] || {} as CustomerProfile;
        this.initializeForm();
        alert('Customer deleted successfully!');
      }
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.customerForm.controls).forEach(key => {
      const control = this.customerForm.get(key);
      control?.markAsTouched();
    });
  }
}