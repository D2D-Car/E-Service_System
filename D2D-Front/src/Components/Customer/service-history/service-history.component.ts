import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FirebaseServiceService, ServiceBooking } from '../../../Services/firebase-service.service';
import { AuthService } from '../../../Services/auth.service';
import Swal from 'sweetalert2';

// Using ServiceBooking from firebase-service instead of separate interface
// This ensures type consistency with the data from Firebase

@Component({
  selector: 'app-service-history',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './service-history.component.html',
  styleUrls: ['./service-history.component.css'],
})
export class ServiceHistoryComponent implements OnInit, OnDestroy {
  serviceHistory: ServiceBooking[] = [];
  showAddServiceModal: boolean = false;
  addServiceForm: FormGroup;
  private subscriptions: Subscription[] = [];
  isLoading = false;
  errorMessage = '';
  isGettingLocation = false;

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseServiceService,
    private authService: AuthService
  ) {
    this.addServiceForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      technician: ['', Validators.required],
      vehicle: ['', Validators.required],
      date: ['', Validators.required],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      serviceType: ['General Service', Validators.required],
      location: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadServiceHistory();
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  selectedServiceType: string = 'all';
  selectedVehicle: string = 'all';
  get filteredServices(): ServiceBooking[] {
    return this.serviceHistory.filter(service => {
      const serviceType = service.serviceType || '';
      const vehicle = service.vehicle || '';
      
      const matchesServiceType =
        this.selectedServiceType === 'all' ||
        serviceType.toLowerCase().includes(this.selectedServiceType.toLowerCase());

      const matchesVehicle =
        this.selectedVehicle === 'all' ||
        vehicle.toLowerCase().includes(this.selectedVehicle.toLowerCase());

      return matchesServiceType && matchesVehicle;
    });
  }

  openAddServiceModal(): void {
    this.showAddServiceModal = true;
    this.addServiceForm.reset({
      title: '',
      description: '',
      price: 0,
      technician: '',
      vehicle: '',
      date: '',
      rating: 5,
      serviceType: 'General Service',
      location: ''
    });
  }

  closeAddServiceModal(): void {
    this.showAddServiceModal = false;
    this.errorMessage = '';
    this.addServiceForm.reset({
      title: '',
      description: '',
      price: 0,
      technician: '',
      vehicle: '',
      date: '',
      rating: 5,
      serviceType: 'General Service',
      location: ''
    });
  }

  async addNewService(): Promise<void> {
    if (this.addServiceForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const formValue = this.addServiceForm.value;
      console.log('Service History: Adding new service with form data:', formValue);
      
      try {
        // Prepare service data for Firebase
        const serviceData = {
          title: formValue.title,
          description: formValue.description,
          price: formValue.price,
          technician: formValue.technician,
          vehicle: formValue.vehicle,
          serviceDate: new Date(formValue.date),
          rating: formValue.rating,
          serviceType: formValue.serviceType,
          location: formValue.location
        };

        // Add service to Firebase
        const serviceId = await this.firebaseService.addServiceBooking(serviceData);
        console.log('Service History: Service added to Firebase with ID:', serviceId);

        // Close modal and show success message
        this.closeAddServiceModal();
        
        // Show SweetAlert success message
      Swal.fire({
  icon: 'success',
  title: 'Success!',
  text: 'Service has been added successfully.',
  confirmButtonText: 'OK',
  confirmButtonColor: '#ff3b3b'
});

        
      } catch (error: any) {
        console.error('Service History: Error adding service:', error);
        if (error.message && error.message.includes('Permission denied')) {
          this.errorMessage = 'Permission denied. Please check your account permissions or contact support.';
        } else {
          this.errorMessage = 'Failed to add service. Please try again.';
        }
      } finally {
        this.isLoading = false;
      }
    } else {
      console.log('Service History: Form is invalid:', this.addServiceForm.errors);
      // Mark all fields as touched to show validation errors
      Object.keys(this.addServiceForm.controls).forEach(key => {
        this.addServiceForm.get(key)?.markAsTouched();
      });
    }
  }

  // Get field error message
  getFieldError(fieldName: string): string {
    const field = this.addServiceForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['min']) return `${fieldName} must be greater than 0`;
    }
    return '';
  }

  // Get current location
  getCurrentLocation(): void {
    if (!navigator.geolocation) {
  Swal.fire({
  icon: 'error',
  title: 'Error',
  text: 'Your browser does not support location services.',
  confirmButtonText: 'OK',
  confirmButtonColor: '#ff3b3b'
});

      return;
    }

    this.isGettingLocation = true;
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Use a simple format for coordinates
          const locationString = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          this.addServiceForm.patchValue({ location: locationString });
          
        Swal.fire({
  icon: 'success',
  title: 'Location detected',
  text: 'Your current location has been retrieved successfully.',
  timer: 2000,
  showConfirmButton: false
});

          
        } catch (error) {
          console.error('Error getting location:', error);
        Swal.fire({
  icon: 'error',
  title: 'Error',
  text: 'Failed to detect location',
  confirmButtonText: 'OK',
  confirmButtonColor: '#ff3b3b'
});

        } finally {
          this.isGettingLocation = false;
        }
      },
      (error) => {
        this.isGettingLocation = false;
        let errorMessage = 'Failed to detect location';

        
        switch (error.code) {
          case error.PERMISSION_DENIED:
        errorMessage = 'Permission to access location was denied';  
            break;
          case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
           errorMessage = 'The request to get location timed out';
            break;
        }
        
      Swal.fire({
  icon: 'error',
  title: 'Location Error',
  text: errorMessage,
  confirmButtonText: 'OK',
  confirmButtonColor: '#ff3b3b'
});

      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }

  // Get today's date in YYYY-MM-DD format for date input min attribute
  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  trackByServiceId(index: number, service: ServiceBooking): string {
    return service.id || `service-${index}`;
  }

  // Format date for display
  formatDate(date: Date | any): string {
    if (!date) return 'N/A';
    const d = date instanceof Date ? date : date.toDate();
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  loadServiceHistory() {
    this.isLoading = true;
    const sub = this.firebaseService.services$.subscribe({
      next: (bookings: ServiceBooking[]) => {
        this.serviceHistory = bookings;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading service history:', error);
        this.errorMessage = 'Failed to load service history. Please try again later.';
        this.isLoading = false;
      }
    });
    this.subscriptions.push(sub);
  }
}